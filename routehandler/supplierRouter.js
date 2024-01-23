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