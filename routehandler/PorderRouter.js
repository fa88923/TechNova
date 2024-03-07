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

            const supplier_list = await req.db.execute(
                `SELECT O.ORGANIZATION_ID,O.NAME
                FROM ORGANIZATIONS O
                WHERE O.TYPE='SUPPLIER'`
                // Use bind variables to prevent SQL injection
            );
        res.render('./purchaseOrder/purchaseOrder', {
            'purchase_orders': purchase_orders.rows,
            'supplier_list': supplier_list.rows
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

    


    res.render('./purchaseOrder/purchaseOrderDetails', { 'transactioninfo': transactioninfo.rows, 'financial_details':financial_details.rows, 'shipment_details':shipment_details.rows,
    'purchase_list':purchase_list.rows });
})


///////////////////////////
poRoute.get("/add",async(req,res)=>{       
    //just render the addSupplier page
    const supplierId=parseInt(req.query.supplierId);

    const supplierinfo = await req.db.execute(
        `SELECT S.SUPPLIER_ID, O.NAME,L2.STREET_ADDRESS||','||L2.CITY||'-'||L2.POSTAL_CODE||','||L2.COUNTRY PICKUP_LOCATION,P.ID,P.ACCOUNT_NUMBER,P.ACCOUNT_HOLDER,P.BANK_NAME, L2.LOCATION_ID
        FROM ORGANIZATIONS O JOIN SUPPLIERS S ON (O.ORGANIZATION_ID=S.SUPPLIER_ID) 
            LEFT OUTER JOIN LOCATIONS L2 ON (O.ORGANIZATION_ID=L2.ORGANIZATION_ID AND (UPPER(L2.TYPE) IN ('DUAL','PICKUP')))  
            LEFT OUTER JOIN PAYMENT_INFO P ON (S.SUPPLIER_ID=P.OWNER_ID) 
        WHERE S.SUPPLIER_ID=:supplierId`,
        [supplierId] 
        // Use bind variables to prevent SQL injection
    );

    destination = await req.db.execute(
        `SELECT L2.LOCATION_ID
        FROM ORGANIZATIONS O  
            LEFT OUTER JOIN LOCATIONS L2 ON (O.ORGANIZATION_ID=L2.ORGANIZATION_ID AND (UPPER(L2.TYPE) IN ('DUAL','PICKUP'))) 
        WHERE O.TYPE='CENTRAL'`
    );

    products = await req.db.execute(
        `SELECT *
        FROM SUPPLIER_PRODUCT SP JOIN products P ON (SP.PRODUCT_ID=P.PRODUCT_ID) WHERE SP.SUPPLIER_ID=:supplierId
        ORDER BY p.product_id`,{supplierId}
    );

    const tcompany_list = await req.db.execute(
        `SELECT O.ORGANIZATION_ID,O.NAME
        FROM ORGANIZATIONS O
        WHERE O.TYPE='TRANSPORT'`
        // Use bind variables to prevent SQL injection
    );
    //console.log(supplierinfo)
    res.render('./purchaseOrder/addPurchaseOrder',{
        'supplierinfo': supplierinfo.rows, 
        'products': products.rows,
        'tcompany_list': tcompany_list.rows , 
        'destination': destination.rows                                                                         
    });
})

//////////////////////////////////
poRoute.post("/submit", async (req, res) => {
    try {
        // Extract form data from request body
        const {supplierId,to_acc,pickupDate,method,currency,total_amount,tcompany,departure_time,departure_date,vehicle_no,current_location,start_loc,dest} = req.body;

        const selectedProductData = JSON.parse(req.body.selectedProductData);

        let message = "";
        let errorflag=0;

        const result = await req.db.execute(
            `BEGIN :transactionId := INSERT_PRODUCT_TRANSACTIONS('PURCHASE_TRANSACTION', :supplierId, :pickupDate); END;`,
            {
                supplierId,
                pickupDate,
                transactionId: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
            }
        );
        

        const transaction_id = result.outBinds.transactionId;

        for (const product of selectedProductData) 
        {
            const productId = product.productId;
            const quantity = product.quantity;
            const price = product.price;
            const total=quantity*price;

            await req.db.execute(
                `INSERT INTO ORDER_PRODUCTS (ORDER_ID, PRODUCT_ID, QUANTITY, PRICE) VALUES (:transaction_id, :productId,:quantity,:total)`,
                {
                    transaction_id,
                    productId,
                    quantity,
                    total
                }
            );
        }
        //inserting financial transaction
        await req.db.execute(
            `BEGIN INSERT_PURCHASE_TRANSACTION(:transaction_id, :method, :to_acc, :currency, :total_amount); END;`,
            {
                transaction_id,
                method,
                to_acc,
                currency,
                total_amount
            }
        );
        //inserting shipments
        await req.db.execute(
            `BEGIN INSERT_SHIPMENTS(:tcompany,:transaction_id, :departure_time, :departure_date, :vehicle_no, :current_location, :start_loc, :dest, 1500); END;`,
            {
                tcompany,
                transaction_id,
                departure_time,
                departure_date,
                vehicle_no,
                current_location,
                start_loc,
                dest
            }
        );
        
    } catch (error) {
        console.error(error);
        // Send an error response
        
        await req.db.execute("ROLLBACK");
        await req.db.execute(" INSERT INTO LOGS (TIMESTAMP_COL, LOG_MESSAGE,TYPE) VALUES (CURRENT_TIMESTAMP,  'product_transaction ' || ' INSERT FAILED','INSERT')");
        await req.db.execute("COMMIT");
        res.status(500).send("Internal Server Error;"+message);
    }
    res.redirect('/purchaseOrder')
    //res.render('home');
});


module.exports=poRoute;


//if (Array.isArray(selectedProductData)) {
    //     // Now you can safely use forEach on selectedProductData
       
    // } else {
    //     // Handle the case where selectedProductData is not an array
    //     console.error('selectedProductData is not an array.');
    // }