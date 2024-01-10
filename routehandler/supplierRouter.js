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

supplierRoute.post("/search",(req,res)=>{      //post, since formsubmit korbe ekhane
    //handle searching here  
    //extract search string from request 
    //search in db
    //render page with resultant string
})

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