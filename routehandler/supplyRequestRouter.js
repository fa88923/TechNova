const express=require("express");
const oracledb=require("oracledb");
const supplyRequestRouter=express.Router();


supplyRequestRouter.get("/", async (req, res) => {
    try 
    {
        let supplyRequests;
        const searchkey=req.query.searchkey;
        //category wise filtering

        const branchId=req.query.branchId;

        if(branchId)
        {
            supplyRequests = await req.db.execute(
                `SELECT *
                FROM SUPPLY_REQUESTS SR JOIN ORGANIZATIONS O ON O.ORGANIZATION_ID=SR.BRANCH_ID
                WHERE O.ORGANIZATION_ID=:branchId
                ORDER BY SR.PLACEMENT_DATE, SR.DEADLINE
                `, 
                { branchId }
            );
        }
        else if (searchkey)
        {
            const searchPattern = `%${searchkey.toUpperCase()}%`;
        
            supplyRequests = await req.db.execute(
                `SELECT *
                FROM SUPPLY_REQUESTS SR JOIN ORGANIZATIONS O ON O.ORGANIZATION_ID=SR.BRANCH_ID
                WHERE UPPER(O.NAME) LIKE :searchPattern
                ORDER BY SR.PLACEMENT_DATE, SR.DEADLINE
                `, 
                { searchPattern }
            );
        }
        else
        {
            supplyRequests= await req.db.execute(
            `SELECT *
            FROM SUPPLY_REQUESTS SR JOIN ORGANIZATIONS O ON O.ORGANIZATION_ID=SR.BRANCH_ID
            ORDER BY SR.PLACEMENT_DATE, SR.DEADLINE`
            );
        }

            // const supplier_list = await req.db.execute(
            //     `SELECT O.ORGANIZATION_ID,O.NAME
            //     FROM ORGANIZATIONS O
            //     WHERE O.TYPE='SUPPLIER'`
            //     // Use bind variables to prevent SQL injection
            // );
        res.render('./supply/supplyRequests', {
            'supplyRequests': supplyRequests.rows,
            //'supplier_list': supplier_list.rows
        });
    } catch (error) {
        console.error('error fetching', error);
        res.status(500).send('Internal server error');
    }
});


supplyRequestRouter.get("/details",async(req,res)=>{       
    //just render the addSupplier page
    const requestId=parseInt(req.query.requestId);
    //console.log('req '+requestId);
    // Execute SQL query to search in the database
    const requestInfo = await req.db.execute(
        `SELECT *
        FROM SUPPLY_REQUESTS SR JOIN ORGANIZATIONS O ON O.ORGANIZATION_ID=SR.BRANCH_ID
        WHERE SR.REQUEST_ID= :requestId`,
        [requestId] 
        // Use bind variables to prevent SQL injection
    );


    const product_list = await req.db.execute(
        `
        SELECT REQ.PRODUCT_ID,P.PRODUCT_NAME,REQ.QUANTITY_REQUESTED,( REQ.QUANTITY_REQUESTED-NVL(CONFIRM.QUANTITY_DELIVERED, 0) ) AS QUANTITY_LEFT, P.CENTRAL_STOCK
        FROM 
        (
        SELECT SRP.PRODUCT_ID,SRP.QUANTITY AS QUANTITY_REQUESTED
        FROM SUPPLY_REQUEST_PRODUCTS SRP
        WHERE SRP.REQUEST_ID= :requestId 
        ) REQ LEFT OUTER JOIN
        (
        SELECT CSP.PRODUCT_ID, SUM(CSP.QUANTITY) AS QUANTITY_DELIVERED
        FROM CONFIRMED_SUPPLY_PRODUCTS CSP JOIN CONFIRMED_SUPPLY CS ON CS.SUPPLY_ID=CSP.SUPPLY_ID
        WHERE CS.REQUEST_ID= :requestId
        GROUP BY CSP.PRODUCT_ID
        ) CONFIRM ON REQ.PRODUCT_ID=CONFIRM.PRODUCT_ID  
        LEFT OUTER JOIN PRODUCTS P ON REQ.PRODUCT_ID=P.PRODUCT_ID`,
        [requestId,requestId]
        // Use bind variables to prevent SQL injection
    );

    const confirmed_supply_list = await req.db.execute(
        `SELECT PT.TRANSACTION_ID, PT.PICKUP_DATE,PT.STATUS
        FROM CONFIRMED_SUPPLY CS JOIN SUPPLY_REQUESTS SR ON SR.REQUEST_ID=CS.REQUEST_ID 
                JOIN PRODUCT_TRANSACTIONS PT ON PT.TRANSACTION_ID=CS.SUPPLY_ID
        WHERE SR.REQUEST_ID=:requestId
        ORDER BY PT.TRANSACTION_ID`,
        [requestId]
        // Use bind variables to prevent SQL injection
    );

    //console.log(confirmed_supply_list);
    const tcompany_list = await req.db.execute(
        `SELECT O.ORGANIZATION_ID,O.NAME
        FROM ORGANIZATIONS O
        WHERE O.TYPE='TRANSPORT'`
        // Use bind variables to prevent SQL injection
    );


    res.render('./supply/supplyRequestDetails', { 'requestInfo': requestInfo.rows,
    'product_list': product_list.rows, 
    'confirmed_supply_list':confirmed_supply_list,
    'tcompany_list': tcompany_list.rows});
})


supplyRequestRouter.post("/submit", async (req, res) => {
    try {
        // Extract form data from request body
        const {tcompany,pickupDate,departureDate,departureTime,vehicleNo,currLoc, branchId,requestId} = req.body;
        //console.log(pickupDate);
        const selectedProductData = JSON.parse(req.body.selectedProductData);
        
        // for (const product of selectedProductData) 
        // {
        //     const productId = product.productId;
        //     const quantity = product.quantity;
            
        //     //console.log(productId+' ' +quantity);
        // }

        // let message = "";
        // let errorflag=0;

        const result = await req.db.execute(
            `BEGIN :transactionId := INSERT_PRODUCT_TRANSACTIONS('CONFIRMED_SUPPLY', :branchId, :pickupDate); END;`,
            {
                branchId,
                pickupDate,
                transactionId: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
            }
        );
        

        const transaction_id = result.outBinds.transactionId;

        try{
            await req.db.execute(
                `INSERT INTO CONFIRMED_SUPPLY (SUPPLY_ID, REQUEST_ID) VALUES (:transaction_id, :requestId)`,
                {
                    transaction_id,
                    requestId
                }
            );

            for (const product of selectedProductData) 
            {
                const productId = product.productId;
                const quantity = product.quantity;

                await req.db.execute(
                    `INSERT INTO CONFIRMED_SUPPLY_PRODUCTS (SUPPLY_ID, PRODUCT_ID, QUANTITY) VALUES (:transaction_id, :productId,:quantity)`,
                    {
                        transaction_id,
                        productId,
                        quantity
                    }
                );
            }

            //inserting shipments
            await req.db.execute(
                `BEGIN INSERT_SHIPMENTS_SUPPLY(:tcompany,:transaction_id, :departureTime, :departureDate, :vehicleNo, :currLoc, :branchId); END;`,
                {
                    tcompany,
                    transaction_id,
                    departureTime,
                    departureDate,
                    vehicleNo,
                    currLoc,
                    branchId
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
    res.redirect('/supplyRequests')
    //res.render('home');
});

supplyRequestRouter.get("/details/confirmedDetails",async(req,res)=>{       
    const transactionId=parseInt(req.query.transactionId);

    const shipment_complete=req.query.shipment_complete;
    const t_type='CONFIRMED_SUPPLY';
    
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
        `SELECT DISTINCT PT.TRANSACTION_ID,PT.PICKUP_DATE,O.NAME, PT.STATUS
        FROM PRODUCT_TRANSACTIONS PT JOIN ORGANIZATIONS O ON O.ORGANIZATION_ID=PT.COUNTERPARTY_ID
        WHERE PT.TRANSACTION_ID=:transactionId`,
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
        `SELECT P.PRODUCT_NAME,CSP.QUANTITY
        FROM CONFIRMED_SUPPLY_PRODUCTS CSP JOIN PRODUCTS P ON P.PRODUCT_ID=CSP.PRODUCT_ID
        WHERE CSP.SUPPLY_ID= :transactionId`,
        [transactionId]
        // Use bind variables to prevent SQL injection
    );

    


    res.render('./supply/confirmSupplyDetails', { 'transactioninfo': transactioninfo.rows, 'shipment_details':shipment_details.rows,
    'purchase_list':purchase_list.rows });
})



module.exports=supplyRequestRouter;


//if (Array.isArray(selectedProductData)) {
    //     // Now you can safely use forEach on selectedProductData
       
    // } else {
    //     // Handle the case where selectedProductData is not an array
    //     console.error('selectedProductData is not an array.');
    // }