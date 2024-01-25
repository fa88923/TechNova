const express=require("express");
const supplierRoute=express.Router();

//for the /supplier route
supplierRoute.get("/",async(req,res)=>{
    // Fetch and pass supplier data to the view 
    try{
        //execute sql query to get supplier info
        const result=await req.db.execute(
            `SELECT supplier_id,supplier_name,city,country,url
            FROM suppliers
            ORDER BY supplier_id`
        );

        res.render('supplier',{'suppliers':result.rows});
    }catch(error){
        console.error('error fetching',error);
        res.status(500).send('Internal server error');
    }


})

//get search
supplierRoute.get(`/search`, async (req, res) => {
    try {
        // Extract the search string from the request
        const searchString = req.query.query ||''; 

        // Execute SQL query to search in the database
        const result = await req.db.execute(
            `SELECT supplier_id, supplier_name, city, country, url
            FROM suppliers
            WHERE UPPER(supplier_name) LIKE UPPER(:searchString)
            OR UPPER(city) LIKE UPPER(:searchString)
            OR UPPER(country) LIKE UPPER(:searchString)`,
            [ `%${searchString}%` , `%${searchString}%`, `%${searchString}%` ] 
            // Use bind variables to prevent SQL injection
        );

        // Render the page with the search results
        res.render('supplier', { 'suppliers': result.rows });
    } catch (error) {
        console.error('Error searching:', error);
        res.status(500).send('Internal server error');
    }
});


supplierRoute.get("/add",(req,res)=>{       
    //just render the addSupplier page
    res.render('addSupplier');
})

//suppliers deatils page
supplierRoute.get("/supplierDetails",async(req,res)=>{       
    //just render the addSupplier page
    const supplierId=parseInt(req.query.supplierId);
    console.log(supplierId);
    // Execute SQL query to search in the database
    const result = await req.db.execute(
        `SELECT S.SUPPLIER_ID,S.SUPPLIER_NAME,S.CITY,S.COUNTRY,S.URL,S.AVG_DELIVERY_TIME,P.ACCOUNT_NUMBER,P.ACCOUNT_HOLDER,P.BANK_NAME,
        P.IBAN, L.STREET_ADDRESS,L.POSTAL_CODE,L.CITY AS PICKUP_LOC_CITY,L.COUNTRY AS PICKUP_LOC_COUNTRY,C.PHONE_NO,C.EMAIL
        FROM SUPPLIERS S 
                JOIN PAYMENT_INFO P ON S.PAYMENT_INFO_ID=P.ID
                JOIN LOCATIONS L ON L.LOCATION_ID=S.PICKUP_LOCATION_ID
                JOIN (
                SELECT DISTINCT C1.OWNER_ID AS SUPPLIER_ID, C1.VALUE AS PHONE_NO, C2.VALUE AS EMAIL
                FROM CONTACTS C1 JOIN CONTACTS C2 ON (C1.OWNER_ID=C2.OWNER_ID	AND C1.TYPE <> C2.TYPE AND C1.TYPE='PHONE')
                ) C ON C.SUPPLIER_ID=S.SUPPLIER_ID 
        WHERE S.SUPPLIER_ID=:supplierId`,
        [supplierId] 
        // Use bind variables to prevent SQL injection
    );
    console.log(result.rows);
    res.render('supplierDetails', { 'supplierInfo': result.rows });
})


//product catalogue from supplier details
supplierRoute.get("/supplierDetails/productCatalogue",async(req,res)=>{       
    const supplierId=parseInt(req.query.supplierId);
    // Execute SQL query to search in the database
    const result = await req.db.execute(
        `SELECT SP.PRODUCT_ID, P.PRODUCT_NAME,P.CATEGORY,P.PRICE,P.WARRANTY,P.MANUFACTURER,P.CENTRAL_STOCK
        FROM SUPPLIER_PRODUCT SP JOIN PRODUCTS P ON SP.PRODUCT_ID=P.PRODUCT_ID
        WHERE SP.SUPPLIER_ID=:supplierId
        ORDER BY SP.PRODUCT_ID`,
        [supplierId] 
        // Use bind variables to prevent SQL injection
    );
    res.render('productCatalogue', { 'productCatalogue': result.rows });
})

//purchase orders from supplier details
supplierRoute.get("/supplierDetails/purchaseOrders",async(req,res)=>{       
    const supplierId=parseInt(req.query.supplierId);
    // Execute SQL query to search in the database
    const result = await req.db.execute(
        `SELECT SUPPLIER_ID, ORDER_ID, PLACEMENT_DATE,PICKUP_DATE
        FROM PURCHASE_ORDERS
        WHERE SUPPLIER_ID= :supplierId
        ORDER BY ORDER_ID`,
        [supplierId] 
        // Use bind variables to prevent SQL injection
    );
   // console.log(result.rows);
    res.render('purchaseOrders', { 'purchaseOrders': result.rows });
})

supplierRoute.get("/supplierDetails/purchaseOrders/POdetails",async(req,res)=>{       
    const supplierId=parseInt(req.query.supplierId);
    const orderId=parseInt(req.query.orderId);
    // Execute SQL query to search in the database
    const result = await req.db.execute(
        `SELECT *
        FROM (
            SELECT ORDER_ID,PLACEMENT_DATE,PICKUP_DATE,TRANSACTION_ID,SHIPMENT_ID
            FROM PURCHASE_ORDERS
            WHERE SUPPLIER_ID=:supplierId AND ORDER_ID=:orderId
        ) PO 
            JOIN 
            (
            SELECT FT.TRANSACTION_ID, FT.METHOD, PI1.ACCOUNT_HOLDER AS SENT_FROM_ACOOUNT, PI2.ACCOUNT_HOLDER AS RECEIVED_TO_ACCOUNT,FT.STATUS, (FT.AMOUNT || ' ' || UPPER(FT.CURRENCY)) AS AMOUNT, FT.PLACEMENT_DATE AS PAYMENT_DATE
            FROM FINANCIAL_TRANSACTIONS FT 
                JOIN PAYMENT_INFO PI1 ON (FT.FROM_ACCOUNT=PI1.ID)
                JOIN PAYMENT_INFO PI2 ON (FT.TO_ACCOUNT=PI2.ID)
            --WHERE FT.TRANSACTION_ID=4
            ) F USING(TRANSACTION_ID)--ON F.TRANSACTION_ID=PO.TRANSACTION_ID
            JOIN
            (
            SELECT S.SHIPMENT_ID,TC.NAME AS PICKED_UP_BY, (L1.STREET_ADDRESS||', '||L1.CITY|| ', '||L1.COUNTRY) AS PICKED_UP_FROM,(S.DEPARTURE_DATE) AS PICKED_UP_ON,(S.DEPARTURE_TIME) AS PICKED_UP_AT,(L2.STREET_ADDRESS||', '||L2.CITY|| ', '||L2.COUNTRY) AS RECEIVED_AT, (S.ARRIVAL_DATE) AS RECEIVED_ON, S.ARRIVAL_TIME AS RECEIVED_AT_TIME, S.VEHICLE_NO AS VEHICLE_USED, S.CURRENT_LOCATION
            FROM SHIPMENTS S 
                JOIN TRANSPORT_COMPANIES TC ON TC.COMPANY_ID=S.TRANSPORT_COMPANY_ID
                JOIN LOCATIONS L1 ON S.START_LOCATION=L1.LOCATION_ID
                JOIN LOCATIONS L2 ON S.DESTINATION=L2.LOCATION_ID
            ) SI USING(SHIPMENT_ID)`,
        [supplierId, orderId] 
        // Use bind variables to prevent SQL injection
    );
    const result2 = await req.db.execute(
        `SELECT P.PRODUCT_NAME,P.PRICE AS PRICE_EACH,POP.QUANTITY, (POP.QUANTITY*P.PRICE) AS TOTAL_DUE
        FROM PURCHASE_ORDER_PRODUCTS POP 
            JOIN PRODUCTS P ON POP.PRODUCT_ID=P.PRODUCT_ID
        WHERE POP.ORDER_ID=:orderId`,
        [orderId] 
        // Use bind variables to prevent SQL injection
    );

    res.render('POdetails', { 'details': result.rows, 'purchaseList': result2.rows });
})




///need to change when the schema is final////later/////////////////////////////////////////////////////////
//when the form is submitted with post method 
supplierRoute.post("/submit",async (req,res)=>{     
    //needed to give the tags name="" to access these here
    const { name, city, country, email, phone_no, url } = req.body;
    const query = `
            INSERT INTO suppliers (supplier_id,name, city, country, email, phone_no, url)
            VALUES (11,:name, :city, :country, :email, :phone_no, :url)
        `;//here i am hardcoding and sending supplier id//use sequence instead
    const binds = {
        name,
        city,
        country,
        email,
        phone_no,
        url
    };
    try{
        const result = await req.db.execute(query, binds, { autoCommit: true });
        //goes back to the supplier page
        res.redirect('/supplier');
    }catch(error){
        console.error('Error inserting into the database:', error);
    }
    
})

module.exports=supplierRoute;