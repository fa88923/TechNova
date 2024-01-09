const express=require("express");
const supplierRoute=express.Router();
supplierRoute.get("/",async(req,res)=>{
    const result=await req.db.execute("Select name from suppliers");
    console.log(result.rows);
    //supplier Information dashboard here
    //extract supplierinfo from db
    //render supplier.ejs with the info

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
})

supplierRoute.post("/add/submit",(req,res)=>{     
    //handle submitting a new information here
    //Insert function called on database
    //render the submit page with the related message
    //the html file should have a go back to supplier list option
})

module.exports=supplierRoute;