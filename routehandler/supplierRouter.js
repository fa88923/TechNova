const express=require("express");
const supplierRoute=express.Router();
supplierRoute.get("/",async(req,res)=>{
    // Fetch and pass supplier data to the view 
    try{
        //exexute sql query to get supplier info
        const result=await req.db.execute(
            `SELECT supplier_id,name,city,country,email,url
            FROM suppliers`
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

supplierRoute.post("/add/submit",(req,res)=>{     
    //handle submitting a new information here
    //Insert function called on database
    //render the submit page with the related message
    //the html file should have a go back to supplier list option
})

module.exports=supplierRoute;