const express=require("express");
const oracledb=require("oracledb");
const poRoute=express.Router();


poRoute.get("/", async (req, res) => {
    try 
    {
        let purchase_orders;
        const searchkey=req.query.searchkey;
        //category wise filtering

        
        if (searchkey) {
            const searchPattern = `%${searchkey.toUpperCase()}%`;
        
            purchase_orders = await req.db.execute(
                ``, { searchPattern }
            );
        }
        else
            {
                purchase_orders= await req.db.execute(
                ``
            );
            }


        res.render('./purchaseOrder/purchaseOrder', {
            '': purchase_orders.rows
        });
    } catch (error) {
        console.error('error fetching', error);
        res.status(500).send('Internal server error');
    }
});