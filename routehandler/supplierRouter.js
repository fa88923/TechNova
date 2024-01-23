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
    // console.log(result.rows);
    res.render('supplierDetails', { 'supplierInfo': result.rows });
})



supplierRoute.get("/supplierDetails/productCatalogue",async(req,res)=>{       
    const supplierId=parseInt(req.query.supplierId);
    console.log(supplierId);
    // Execute SQL query to search in the database
    const result = await req.db.execute(
        `SELECT SP.PRODUCT_ID, P.PRODUCT_NAME,P.CATEGORY,P.PRICE,P.WARRANTY,P.MANUFACTURER,P.CENTRAL_STOCK
        FROM SUPPLIER_PRODUCT SP JOIN PRODUCTS P ON SP.PRODUCT_ID=P.PRODUCT_ID
        WHERE SP.SUPPLIER_ID=:supplierId
        ORDER BY SP.PRODUCT_ID`,
        [supplierId] 
        // Use bind variables to prevent SQL injection
    );
    console.log(result.rows);
    res.render('productCatalogue', { 'productCatalogue': result.rows });
})



///need to change////later/////////////////////////////////////////////////////////
//when the form is submitted with post method 
supplierRoute.post("/submit",async (req,res)=>{     
    //needed to give the tags name="" to access these here
    const { name, city, country, email, phone_no, url } = req.body;
    const query = `
            INSERT INTO suppliers (supplier_id,name, city, country, email, phone_no, url)
            VALUES (11,:name, :city, :country, :email, :phone_no, :url)
        `;//here i am hardcoding and sending supplier id
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