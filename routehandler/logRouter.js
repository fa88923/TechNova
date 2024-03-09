const express=require("express");
const logRoute=express.Router();

logRoute.get("/",async(req,res)=>{       
    //just render the addSupplier page
    // Execute SQL query to search in the database
    const organizationinfo = await req.db.execute(
        "SELECT * FROM LOGS LEFT OUTER JOIN ORGANIZATION_LOGS USING(LOG_ID) WHERE LOGS.TYPE = 'ORGANIZATION' ORDER BY TIMESTAMP_COL DESC"
    );


    const transactioninfo = await req.db.execute(
        "SELECT * FROM LOGS LEFT OUTER JOIN TRANSACTION_LOGS USING(LOG_ID) WHERE LOGS.TYPE = 'PRODUCT_TRANSACTION' ORDER BY TIMESTAMP_COL DESC"
        // Use bind variables to prevent SQL injection
    );


    res.render('./logs/log', { 'organizationinfo': organizationinfo.rows, 'transactioninfo': transactioninfo.rows });
})

module.exports=logRoute;