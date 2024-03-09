const express=require("express");
const oracledb=require("oracledb");
const clientOrderRouter=express.Router();


clientOrderRouter.get("/", async (req, res) => {
    try 
    {
        let clientOrders;
        const searchkey=req.query.searchkey;
        const clientId=req.query.clientId;
        //category wise filtering
        
        if(clientId)
        {
            clientOrders= await req.db.execute(
                `SELECT DISTINCT PT.TRANSACTION_ID,O.NAME, PT.STATUS, FT.STATUS AS PAYMENT_STATUS, S2.STATUS AS SHIPMENT_STATUS
                FROM PRODUCT_TRANSACTIONS PT LEFT OUTER JOIN ORGANIZATIONS O ON O.ORGANIZATION_ID=PT.COUNTERPARTY_ID
                LEFT OUTER JOIN FINANCIAL_TRANSACTIONS FT ON FT.PRODUCT_TRANSACTION_ID=PT.TRANSACTION_ID
                LEFT OUTER JOIN (
                SELECT S.SHIPMENT_ID, S.PRODUCT_TRANSACTION_ID,
                CASE 
                        WHEN S.ARRIVAL_DATE IS NULL THEN 'PENDING'
                        ELSE 'COMPLETED'
                END STATUS
                FROM SHIPMENTS S
                ) S2 ON S2.PRODUCT_TRANSACTION_ID=PT.TRANSACTION_ID
                WHERE FT.TYPE='CLIENT_ORDER_PAYMENT' AND O.ORGANIZATION_ID=:clientId
                ORDER BY PT.TRANSACTION_ID DESC`,{clientId}
                );
        }
        
        else if (searchkey)
        {
            const searchPattern = `%${searchkey.toUpperCase()}%`;
        
            clientOrders = await req.db.execute(
                `SELECT DISTINCT PT.TRANSACTION_ID,O.NAME, PT.STATUS, FT.STATUS AS PAYMENT_STATUS, S2.STATUS AS SHIPMENT_STATUS
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
                WHERE FT.TYPE='CLIENT_ORDER_PAYMENT'  AND
                                (
                                UPPER(O.NAME) LIKE :searchPattern OR
                                UPPER(PT.STATUS) LIKE :searchPattern OR
                                UPPER(FT.STATUS) LIKE :searchPattern OR
                                UPPER(S2.STATUS) LIKE :searchPattern
                                )
                ORDER BY PT.TRANSACTION_ID DESC
                `, 
                { searchPattern }
            );
        }
        else
        {
            clientOrders= await req.db.execute(
            `SELECT DISTINCT PT.TRANSACTION_ID,O.NAME, PT.STATUS, FT.STATUS AS PAYMENT_STATUS, S2.STATUS AS SHIPMENT_STATUS
            FROM PRODUCT_TRANSACTIONS PT LEFT OUTER JOIN ORGANIZATIONS O ON O.ORGANIZATION_ID=PT.COUNTERPARTY_ID
            LEFT OUTER JOIN FINANCIAL_TRANSACTIONS FT ON FT.PRODUCT_TRANSACTION_ID=PT.TRANSACTION_ID
            LEFT OUTER JOIN (
            SELECT S.SHIPMENT_ID, S.PRODUCT_TRANSACTION_ID,
            CASE 
                    WHEN S.ARRIVAL_DATE IS NULL THEN 'PENDING'
                    ELSE 'COMPLETED'
            END STATUS
            FROM SHIPMENTS S
            ) S2 ON S2.PRODUCT_TRANSACTION_ID=PT.TRANSACTION_ID
            WHERE FT.TYPE='CLIENT_ORDER_PAYMENT'
            ORDER BY PT.TRANSACTION_ID DESC`
            );
        }

            // const supplier_list = await req.db.execute(
            //     `SELECT O.ORGANIZATION_ID,O.NAME
            //     FROM ORGANIZATIONS O
            //     WHERE O.TYPE='SUPPLIER'`
            //     // Use bind variables to prevent SQL injection
            // );
        res.render('./clientOrders/clientOrders', {
            'clientOrders': clientOrders.rows,
            //'supplier_list': supplier_list.rows
        });
    } catch (error) {
        console.error('error fetching', error);
        res.status(500).send('Internal server error');
    }
});


// clientOrderRouter.get("/details",async(req,res)=>{       
//     //just render the addSupplier page
//     const transactionId=parseInt(req.query.transactionId);

//     const shipment_complete=req.query.shipment_complete;
//     const payment_complete=req.query.payment_complete;
//     const payment_type='CLIENT_ORDER_PAYMENT';
//     const t_type='CLIENT_TRANSACTION';
//     if(payment_complete)
//     {
//         try{
//             await req.db.execute(
//                 `BEGIN UPDATE_FT(:transactionId,:payment_type); END;`,
//                 {
//                     transactionId,
//                     payment_type
//                 }
//             );
//             await req.db.execute("COMMIT");
//         }catch(error){
//             console.log('payment update error'+error);
//             await req.db.execute("ROLLBACK");
//             // await req.db.execute(" INSERT INTO LOGS (TIMESTAMP_COL, LOG_MESSAGE,TYPE) VALUES (CURRENT_TIMESTAMP,  'SUPPLIER '|| :name || ' INSERT FAILED','INSERT')",[name]);
//             // await req.db.execute("COMMIT");
//         }
//     }

//     if(shipment_complete)
//     {
//         try{
//             var arr_time = req.query.arr_time;
//             var arr_date = req.query.arr_date;
//             await req.db.execute(
//                 `BEGIN UPDATE_SHIPMENT(:transactionId,:t_type, :arr_time,:arr_date); END;`,
//                 {
//                     transactionId,
//                     t_type,
//                     arr_time,
//                     arr_date
//                 }
//             );
//             await req.db.execute("COMMIT");
//         }catch(error){
//             console.log('shipment update error'+error);
//             await req.db.execute("ROLLBACK");
//             // await req.db.execute(" INSERT INTO LOGS (TIMESTAMP_COL, LOG_MESSAGE,TYPE) VALUES (CURRENT_TIMESTAMP,  'SUPPLIER '|| :name || ' INSERT FAILED','INSERT')",[name]);
//             // await req.db.execute("COMMIT");
//         }
//     }
//     // Execute SQL query to search in the database
//     const transactioninfo = await req.db.execute(
//         `SELECT DISTINCT PT.TRANSACTION_ID,PT.PICKUP_DATE,O.NAME, PT.STATUS, PT.COUNTERPARTY_ID AS CLIENT_ID
//         FROM PRODUCT_TRANSACTIONS PT JOIN ORGANIZATIONS O ON O.ORGANIZATION_ID=PT.COUNTERPARTY_ID
//         WHERE PT.TRANSACTION_ID=:transactionId`,
//         [transactionId] 
//         // Use bind variables to prevent SQL injection
//     );

//     const financial_details = await req.db.execute(
//         `SELECT FT.METHOD, PI.ACCOUNT_NUMBER,PI.BANK_NAME, FT.AMOUNT,FT.STATUS
//         FROM FINANCIAL_TRANSACTIONS FT JOIN PAYMENT_INFO PI ON FT.TO_ACCOUNT=PI.OWNER_ID
//         WHERE FT.PRODUCT_TRANSACTION_ID=:transactionId AND TYPE= UPPER('CLIENT_ORDER_PAYMENT')`,
//         [transactionId]
//         // Use bind variables to prevent SQL injection
//     );

//     const shipment_details = await req.db.execute(
//         `SELECT O.NAME, L1.STREET_ADDRESS||', '||L1.CITY||'-'||L1.POSTAL_CODE||','||L1.COUNTRY AS PICK_UP_FROM, S.DEPARTURE_DATE,S.DEPARTURE_TIME,S.VEHICLE_NO,S.CURRENT_LOCATION,S.ARRIVAL_DATE,S.ARRIVAL_TIME,
//         CASE 
//                 WHEN S.ARRIVAL_DATE IS NULL THEN 'PENDING'
//                 ELSE 'COMPLETED'
//         END STATUS
//         FROM SHIPMENTS S JOIN ORGANIZATIONS O ON O.ORGANIZATION_ID=S.TRANSPORT_COMPANY_ID
//                 JOIN LOCATIONS L1 ON S.START_LOCATION=L1.LOCATION_ID
//         WHERE S.PRODUCT_TRANSACTION_ID=:transactionId`,
//         [transactionId]
//         // Use bind variables to prevent SQL injection
//     );

//     const purchase_list = await req.db.execute(
//         `SELECT P.PRODUCT_NAME,OP.PRICE/OP.QUANTITY AS PRICE_EACH,OP.QUANTITY
//         FROM ORDER_PRODUCTS OP JOIN PRODUCTS P ON P.PRODUCT_ID=OP.PRODUCT_ID
//         WHERE OP.ORDER_ID=:transactionId`,
//         [transactionId]
//         // Use bind variables to prevent SQL injection
//     );

    


//     res.render('./clientOrders/clientOrderDetails', { 'transactioninfo': transactioninfo.rows, 'financial_details':financial_details.rows, 'shipment_details':shipment_details.rows,
//     'purchase_list':purchase_list.rows });
// })


clientOrderRouter.post("/submit", async (req, res) => {
    try {
        // Extract form data from request body
        const {tcompany,departureDate,departureTime,vehicleNo,currLoc, clientId, transaction_id} = req.body;
        

        try{
            

            //inserting shipments
            await req.db.execute(
                `BEGIN INSERT_SHIPMENTS_CLIENT(:tcompany,:transaction_id, :departureTime, :departureDate, :vehicleNo, :currLoc, :clientId); END;`,
                {
                    tcompany,
                    transaction_id,
                    departureTime,
                    departureDate,
                    vehicleNo,
                    currLoc,
                    clientId
                }
            );

            await req.db.execute("COMMIT");

        }catch(error){
            console.log(error);
            await req.db.execute("ROLLBACK");
            // await req.db.execute(" INSERT INTO LOGS (TIMESTAMP_COL, LOG_MESSAGE,TYPE,ACTION,OUTCOME) VALUES (CURRENT_TIMESTAMP,  'SHIPPING COMPANY '|| ' INSERT FAILED','TRANSACTION','INSERT','FAILED)");
            // await req.db.execute("COMMIT");
            // res.status(500).send("Internal Server Error;"+message);
        }

        
    } catch (error) {
        console.error(error);
        // Send an error response
        
        await req.db.execute("ROLLBACK");
        // await req.db.execute(" INSERT INTO LOGS (TIMESTAMP_COL, LOG_MESSAGE,TYPE) VALUES (CURRENT_TIMESTAMP,  'product_transaction ' || ' INSERT FAILED','INSERT')");
        // await req.db.execute("COMMIT");
        // res.status(500).send("Internal Server Error;"+message);
    }
    res.redirect('/clientOrders')
    //res.render('home');
});

////////////////////////////////////////////////////////////////
clientOrderRouter.get("/details",async(req,res)=>{       
    //just render the addSupplier page
    const transactionId=parseInt(req.query.transactionId);

    const shipment_complete=req.query.shipment_complete;
    const payment_complete=req.query.payment_complete;
    const payment_type='CLIENT_ORDER_PAYMENT';
    const t_type='CLIENT_TRANSACTION';

    const result = await req.db.execute(
        `BEGIN :state := CLIENT_ORDER_STATE(:transactionId); END;`,
        {
            transactionId,
            state: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
        }
    );
    

    const state = result.outBinds.state;

    if(payment_complete)
    {
        try{
            await req.db.execute(
                `BEGIN UPDATE_FT(:transactionId,:payment_type); END;`,
                {
                    transactionId,
                    payment_type
                }
            );
            await req.db.execute("COMMIT");
        }catch(error){
            console.log('payment update error'+error);
            await req.db.execute("ROLLBACK");
            // await req.db.execute(" INSERT INTO LOGS (TIMESTAMP_COL, LOG_MESSAGE,TYPE) VALUES (CURRENT_TIMESTAMP,  'SUPPLIER '|| :name || ' INSERT FAILED','INSERT')",[name]);
            // await req.db.execute("COMMIT");
        }
    }

    if(shipment_complete)
    {
        try{
            var arr_time = req.query.arr_time;
            var arr_date = req.query.arr_date;
            await req.db.execute(
                `BEGIN UPDATE_SHIPMENT(:transactionId,:t_type, :arr_time,:arr_date); END;`,
                {
                    transactionId,
                    t_type,
                    arr_time,
                    arr_date
                }
            );
            await req.db.execute("COMMIT");
        }catch(error){
            console.log('shipment update error'+error);
            await req.db.execute("ROLLBACK");
            // await req.db.execute(" INSERT INTO LOGS (TIMESTAMP_COL, LOG_MESSAGE,TYPE) VALUES (CURRENT_TIMESTAMP,  'SUPPLIER '|| :name || ' INSERT FAILED','INSERT')",[name]);
            // await req.db.execute("COMMIT");
        }
    }



    // Execute SQL query to search in the database
    const transactioninfo = await req.db.execute(
        `SELECT DISTINCT PT.TRANSACTION_ID,PT.PICKUP_DATE,O.NAME, PT.STATUS, PT.COUNTERPARTY_ID AS CLIENT_ID
        FROM PRODUCT_TRANSACTIONS PT JOIN ORGANIZATIONS O ON O.ORGANIZATION_ID=PT.COUNTERPARTY_ID
        WHERE PT.TRANSACTION_ID=:transactionId`,
        [transactionId] 
        // Use bind variables to prevent SQL injection
    );

    const financial_details = await req.db.execute(
        `SELECT FT.METHOD, PI.ACCOUNT_NUMBER,PI.BANK_NAME, FT.AMOUNT,FT.STATUS
        FROM FINANCIAL_TRANSACTIONS FT JOIN PAYMENT_INFO PI ON FT.TO_ACCOUNT=PI.OWNER_ID
        WHERE FT.PRODUCT_TRANSACTION_ID=:transactionId AND TYPE= UPPER('CLIENT_ORDER_PAYMENT')`,
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

    const tcompany_list = await req.db.execute(
        `SELECT O.ORGANIZATION_ID,O.NAME
        FROM ORGANIZATIONS O
        WHERE O.TYPE='TRANSPORT'`
        // Use bind variables to prevent SQL injection
    );

    if(state===0)
    {
        res.render('./clientOrders/clientOrderDetails2', { 'transactioninfo': transactioninfo.rows, 'financial_details':financial_details.rows, 
        'tcompany_list': tcompany_list.rows,
        'purchase_list':purchase_list.rows });
    }
    else
    {
        res.render('./clientOrders/clientOrderDetails', { 'transactioninfo': transactioninfo.rows, 'financial_details':financial_details.rows, 'shipment_details':shipment_details.rows,
        'purchase_list':purchase_list.rows });
    }


    
})



module.exports=clientOrderRouter;


//if (Array.isArray(selectedProductData)) {
    //     // Now you can safely use forEach on selectedProductData
       
    // } else {
    //     // Handle the case where selectedProductData is not an array
    //     console.error('selectedProductData is not an array.');
    // }