const express=require("express");
const productRoute=express.Router();


productRoute.get("/", async (req, res) => {
   

    try {
        let products;

        //category wise filtering
        const category= req.query.category; // check for differnet search queries
        const searchkey=req.query.searchkey;
        const stock=req.query.stock;
        if (category) {
            console.log(category);
            products = await req.db.execute(
                `SELECT *
                FROM products
                WHERE upper(category) = upper(:category)
                ORDER BY product_id`, [category]
            );
        }
        
        else if (searchkey) {
            const searchPattern = `%${searchkey.toUpperCase()}%`;
        
            products = await req.db.execute(
                `SELECT * FROM PRODUCTS P2 WHERE P2.PRODUCT_ID IN
                (SELECT DISTINCT P1.PRODUCT_ID FROM PRODUCTS P1 
                LEFT OUTER JOIN PRODUCT_FEATURES PF ON (P1.PRODUCT_ID = PF.PRODUCT_ID) 
                LEFT OUTER JOIN FEATURE_NAMES FN ON (PF.FEATURE_ID = FN.FEATURE_ID)
                WHERE UPPER(P1.PRODUCT_NAME) LIKE UPPER(:searchPattern) OR UPPER(P1.CATEGORY) LIKE UPPER(:searchPattern) OR UPPER(P1.MANUFACTURER_ID) LIKE UPPER(:searchPattern)
                OR UPPER(PF.VALUE) LIKE UPPER(:searchPattern) OR UPPER(FN.FEATURE_NAME) LIKE UPPER(:searchPattern)
                )
                ORDER BY P2.PRODUCT_ID`, { searchPattern }
            );
        }

        else if(stock)
        {
            if(stock=='in_stock')
            products = await req.db.execute(
                `SELECT *
                FROM products WHERE CENTRAL_STOCK<>0
                ORDER BY product_id`
            );

            else
            products=await req.db.execute(
                `SELECT *
                FROM products WHERE CENTRAL_STOCK=0
                ORDER BY product_id`
            );
        }

        else {
            products = await req.db.execute(
                `SELECT *
                FROM products
                ORDER BY product_id`
            );
        }

        const categories = await req.db.execute(
            `SELECT DISTINCT CATEGORY
            FROM products
            ORDER BY CATEGORY`
        );

        res.render('./products/product', {
            'products': products.rows,
            'categories': categories.rows
        });
    } catch (error) {
        console.error('error fetching', error);
        res.status(500).send('Internal server error');
    }
});

productRoute.get("/details",async(req,res)=>{       
    //just render the addSupplier page
    const productId=parseInt(req.query.productId);
    // Execute SQL query to search in the database
    const productinfo = await req.db.execute(
        'SELECT * FROM PRODUCTS WHERE PRODUCT_ID=:productId',
        [productId] 
        // Use bind variables to prevent SQL injection
    );
    
    const suppliers = await req.db.execute(
        'SELECT SP.SUPPLIER_ID SUPPLIER_ID, O.NAME SUPPLIER_NAME,SP.WHOLESALE_PRICE OFFERING_PRICE, S.AVG_DELIVERY_TIME AVG_DELIVERY_TIME FROM  SUPPLIER_PRODUCT SP  JOIN ORGANIZATIONS O ON (SP.SUPPLIER_ID=O.ORGANIZATION_ID) JOIN SUPPLIERS S ON (O.ORGANIZATION_ID=S.SUPPLIER_ID) WHERE SP.PRODUCT_ID=:productId',
        [productId] 
        // Use bind variables to prevent SQL injection
    );
    

    const features = await req.db.execute(
        'SELECT * FROM PRODUCT_FEATURES PF JOIN FEATURE_NAMES FN ON (PF.FEATURE_ID=FN.FEATURE_ID) WHERE PF.PRODUCT_ID=:productId',
        [productId] 
        // Use bind variables to prevent SQL injection
    );

    res.render('./products/productDetails', { 'productinfo': productinfo.rows , 'features':features.rows, 'suppliers':suppliers.rows });
})


module.exports=productRoute;