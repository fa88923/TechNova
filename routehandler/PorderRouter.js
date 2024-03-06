const express=require("express");
const oracledb=require("oracledb");
const poRoute=express.Router();


poRoute.get("/", async (req, res) => {
    try 
    {
        let purchase_orders;
        const searchkey=req.query.searchkey;
        //category wise filtering

        
        if (searchkey) {
            const searchPattern = `%${searchkey.toUpperCase()}%`;
        
            purchase_orders = await req.db.execute(
                `SELECT DISTINCT PT.TRANSACTION_ID,O.NAME,O.ORGANIZATION_ID AS SUPPLIER_ID, PT.STATUS, FT.STATUS AS PAYMENT_STATUS, S2.STATUS AS SHIPMENT_STATUS
                FROM PRODUCT_TRANSACTIONS PT JOIN ORGANIZATIONS O ON O.ORGANIZATION_ID=PT.COUNTERPARTY_ID
                JOIN FINANCIAL_TRANSACTIONS FT ON FT.PRODUCT_TRANSACTION_ID=PT.TRANSACTION_ID
                JOIN (
                SELECT S.SHIPMENT_ID, S.PRODUCT_TRANSACTION_ID,
                CASE 
                        WHEN S.ARRIVAL_DATE IS NULL THEN 'PENDING'
                        ELSE 'COMPLETED'
                END STATUS
                FROM SHIPMENTS S
                ) S2 ON S2.PRODUCT_TRANSACTION_ID=PT.TRANSACTION_ID
                WHERE PT.TYPE='PURCHASE_TRANSACTION' AND
                (
                UPPER(O.NAME) LIKE :searchPattern OR
                UPPER(PT.STATUS) LIKE :searchPattern OR
                UPPER(FT.STATUS) LIKE :searchPattern OR
                UPPER(S2.STATUS) LIKE :searchPattern
                )
                ORDER BY PT.TRANSACTION_ID DESC`, 
                { searchPattern }
            );
        }
        else
            {
                purchase_orders= await req.db.execute(
                `SELECT DISTINCT PT.TRANSACTION_ID,O.NAME,O.ORGANIZATION_ID AS SUPPLIER_ID, PT.STATUS, FT.STATUS AS PAYMENT_STATUS, S2.STATUS AS SHIPMENT_STATUS
                FROM PRODUCT_TRANSACTIONS PT JOIN ORGANIZATIONS O ON O.ORGANIZATION_ID=PT.COUNTERPARTY_ID
                JOIN FINANCIAL_TRANSACTIONS FT ON FT.PRODUCT_TRANSACTION_ID=PT.TRANSACTION_ID
                JOIN (
                SELECT S.SHIPMENT_ID, S.PRODUCT_TRANSACTION_ID,
                CASE 
                        WHEN S.ARRIVAL_DATE IS NULL THEN 'PENDING'
                        ELSE 'COMPLETED'
                END STATUS
                FROM SHIPMENTS S
                ) S2 ON S2.PRODUCT_TRANSACTION_ID=PT.TRANSACTION_ID
                WHERE PT.TYPE='PURCHASE_TRANSACTION'
                ORDER BY PT.TRANSACTION_ID DESC`
            );
            }


        res.render('./purchaseOrder/purchaseOrder', {
            'purchase_orders': purchase_orders.rows
        });
    } catch (error) {
        console.error('error fetching', error);
        res.status(500).send('Internal server error');
    }
});


poRoute.get("/details",async(req,res)=>{       
    //just render the addSupplier page
    const transactionId=parseInt(req.query.transactionId);
    // Execute SQL query to search in the database
    const transactioninfo = await req.db.execute(
        `SELECT DISTINCT PT.TRANSACTION_ID,PT.PICKUP_DATE,O.NAME, PT.STATUS
        FROM PRODUCT_TRANSACTIONS PT JOIN ORGANIZATIONS O ON O.ORGANIZATION_ID=PT.COUNTERPARTY_ID
        WHERE PT.TRANSACTION_ID=:transactionId`,
        [transactionId] 
        // Use bind variables to prevent SQL injection
    );

    const financial_details = await req.db.execute(
        `SELECT FT.METHOD, PI.ACCOUNT_NUMBER,PI.BANK_NAME, FT.AMOUNT,FT.STATUS
        FROM FINANCIAL_TRANSACTIONS FT JOIN PAYMENT_INFO PI ON FT.TO_ACCOUNT=PI.OWNER_ID
        WHERE FT.PRODUCT_TRANSACTION_ID=:transactionId AND TYPE= UPPER('PURCHASE_ORDER_PAYMENT')`,
        [transactionId]
        // Use bind variables to prevent SQL injection
    );

    const shipment_details = await req.db.execute(
        `SELECT O.NAME, L1.STREET_ADDRESS||', '||L1.CITY||'-'||L1.POSTAL_CODE||','||L1.COUNTRY AS PICK_UP_FROM, S.DEPARTURE_DATE,S.DEPARTURE_TIME,S.VEHICLE_NO,S.CURRENT_LOCATION,S.ARRIVAL_DATE,S.ARRIVAL_TIME,
        CASE 
                WHEN S.ARRIVAL_DATE IS NULL THEN 'PENDING'
                ELSE 'COMPLETED'
        END STATUS
        FROM SHIPMENTS S JOIN ORGANIZATIONS O ON O.ORGANIZATION_ID=S.TRANSPORT_COMPANY_ID
                JOIN LOCATIONS L1 ON S.START_LOCATION=L1.LOCATION_ID
        WHERE S.PRODUCT_TRANSACTION_ID=:transactionId`,
        [transactionId]
        // Use bind variables to prevent SQL injection
    );

    const purchase_list = await req.db.execute(
        `SELECT P.PRODUCT_NAME,OP.PRICE/OP.QUANTITY AS PRICE_EACH,OP.QUANTITY
        FROM ORDER_PRODUCTS OP JOIN PRODUCTS P ON P.PRODUCT_ID=OP.PRODUCT_ID
        WHERE OP.ORDER_ID=:transactionId`,
        [transactionId]
        // Use bind variables to prevent SQL injection
    );

    // const branch_list = await req.db.execute(
    //     ``
    //     // Use bind variables to prevent SQL injection
    // );


    res.render('./purchaseOrder/purchaseOrderDetails', { 'transactioninfo': transactioninfo.rows, 'financial_details':financial_details.rows, 'shipment_details':shipment_details.rows,
    'purchase_list':purchase_list.rows });
})


module.exports=poRoute;