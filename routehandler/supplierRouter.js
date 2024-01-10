const express=require("express");
const supplierRoute=express.Router();
supplierRoute.get("/",async(req,res)=>{
    // Fetch and pass supplier data to the view 
    try{
        //exexute sql query to get supplier info
        const result=await req.db.execute(
            `SELECT supplier_id,name,city,country,email,url
            FROM suppliers
            ORDER BY supplier_id`
        );

        //close the connection
       // await connection.close();
        res.render('supplier',{'suppliers':result.rows});
    }catch(error){
        console.error('error fetching',error);
        res.status(500).send('Internal server error');
    }


})
//let searchValue="";

supplierRoute.get(`/search`, async (req, res) => {
    try {
        // Extract the search string from the request
        const searchString = req.query.query ||''; // Assuming the client sends the search query in the request body
        console.log(searchString);
        // Execute SQL query to search in the database
        const result = await req.db.execute(
            `SELECT supplier_id, name, city, country, email, url
            FROM suppliers
            WHERE UPPER(name) LIKE UPPER(:searchString)
            OR UPPER(city) LIKE UPPER(:searchString)
            OR UPPER(country) LIKE UPPER(:searchString)`,
            [ `%${searchString}%` , `%${searchString}%`, `%${searchString}%` ] // Use bind variables to prevent SQL injection
        );
        console.log(result.rows);

        // Render the page with the search results
        res.render('supplier', { 'suppliers': result.rows });
        //res.json({ 'suppliers': result.rows });
    } catch (error) {
        console.error('Error searching:', error);
        res.status(500).send('Internal server error');
    }
});


supplierRoute.get("/add",(req,res)=>{   
    //handle adding here    
    //just render page
    res.render('addSupplier');
})

supplierRoute.post("/submit",async (req,res)=>{     
    console.log(req.body.name);  
    const { name, street,postal_code,city, country, email, phone_no, url } = req.body;
    const query = `
            INSERT INTO suppliers (supplier_id,name, city, country, email, phone_no, url)
            VALUES (10,:name, :city, :country, :email, :phone_no, :url)
        `;
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

        console.log('Rows inserted:', result.rowsAffected);
        res.redirect('/supplier');
    }catch(error){
        console.error('Error inserting into the database:', error);
    }
    
})

module.exports=supplierRoute;