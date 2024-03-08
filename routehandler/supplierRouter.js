const express=require("express");
const oracledb=require("oracledb");
const supplierRoute=express.Router();


supplierRoute.get("/", async (req, res) => {
    try 
    {
        let suppliers;
        const searchkey=req.query.searchkey;
        //category wise filtering

        const deletekey=req.query.delete;

        if(deletekey)
        {
        
            await req.db.execute(
                `DELETE FROM ORGANIZATIONS WHERE ORGANIZATION_ID=:deletekey`, { deletekey }
            );

            await req.db.execute(
                `COMMIT`
            );
        }
        
        if (searchkey) {
            const searchPattern = `%${searchkey.toUpperCase()}%`;
        
            suppliers = await req.db.execute(
                `SELECT S.SUPPLIER_ID, O.NAME, O.URL,S.AVG_DELIVERY_TIME, L1.STREET_ADDRESS||', '||L1.CITY||'-'||L1.POSTAL_CODE||','||L1.COUNTRY ADDRESS,L2.STREET_ADDRESS||', '||L2.CITY||'-'||L2.POSTAL_CODE||','||L2.COUNTRY PICKUP_LOCATION  FROM
                ORGANIZATIONS O JOIN SUPPLIERS S ON (O.ORGANIZATION_ID=S.SUPPLIER_ID)
                LEFT OUTER JOIN LOCATIONS L1 ON (O.ORGANIZATION_ID=L1.ORGANIZATION_ID AND (UPPER(L1.TYPE) IN ('DUAL','ADDRESS')))
                LEFT OUTER JOIN LOCATIONS L2 ON (O.ORGANIZATION_ID=L2.ORGANIZATION_ID AND (UPPER(L2.TYPE) IN ('DUAL','PICKUP')))
                WHERE UPPER(NAME) LIKE :searchPattern OR UPPER(l1.STREET_ADDRESS) LIKE :searchPattern OR 
                UPPER(L1.POSTAL_CODE) LIKE :searchPattern 
                OR UPPER(L1.CITY) LIKE :searchPattern
                OR UPPER(L1.COUNTRY) LIKE :searchPattern
                OR UPPER(l2.STREET_ADDRESS) LIKE :searchPattern OR 
                UPPER(L2.POSTAL_CODE) LIKE :searchPattern 
                OR UPPER(L2.CITY) LIKE :searchPattern
                OR UPPER(L2.COUNTRY) LIKE :searchPattern
                OR UPPER(URL) LIKE :searchPattern
                ORDER BY O.ORGANIZATION_ID`, { searchPattern }
            );
        }

        else
            {
                suppliers = await req.db.execute(
                `SELECT S.SUPPLIER_ID, O.NAME, O.URL,S.AVG_DELIVERY_TIME, L1.STREET_ADDRESS||', '||L1.CITY||'-'||L1.POSTAL_CODE||','||L1.COUNTRY ADDRESS,L2.STREET_ADDRESS||', '||L2.CITY||'-'||L2.POSTAL_CODE||','||L2.COUNTRY PICKUP_LOCATION  FROM
                ORGANIZATIONS O JOIN SUPPLIERS S ON (O.ORGANIZATION_ID=S.SUPPLIER_ID)
                LEFT OUTER JOIN LOCATIONS L1 ON (O.ORGANIZATION_ID=L1.ORGANIZATION_ID AND (UPPER(L1.TYPE) IN ('DUAL','ADDRESS')))
                LEFT OUTER JOIN LOCATIONS L2 ON (O.ORGANIZATION_ID=L2.ORGANIZATION_ID AND (UPPER(L2.TYPE) IN ('DUAL','PICKUP')))
                ORDER BY O.ORGANIZATION_ID`
            );
            }


        res.render('./suppliers/supplier', {
            'suppliers': suppliers.rows
        });
    } catch (error) {
        console.error('error fetching', error);
        res.status(500).send('Internal server error');
    }
});



supplierRoute.get("/details",async(req,res)=>{       
    //just render the addSupplier page
    const supplierId=parseInt(req.query.supplierId);
    // Execute SQL query to search in the database
    const supplierinfo = await req.db.execute(
        'SELECT S.SUPPLIER_ID, O.NAME, O.URL,S.AVG_DELIVERY_TIME, L1.STREET_ADDRESS||\',\'||L1.CITY||\'-\'||L1.POSTAL_CODE||\',\'||L1.COUNTRY ADDRESS,L2.STREET_ADDRESS||\',\'||L2.CITY||\'-\'||L2.POSTAL_CODE||\',\'||L2.COUNTRY PICKUP_LOCATION,P.ACCOUNT_NUMBER,P.ACCOUNT_HOLDER,P.BANK_NAME,P.IBAN  FROM ORGANIZATIONS O JOIN SUPPLIERS S ON (O.ORGANIZATION_ID=S.SUPPLIER_ID) LEFT OUTER JOIN LOCATIONS L1 ON (O.ORGANIZATION_ID=L1.ORGANIZATION_ID AND (UPPER(L1.TYPE) IN (\'DUAL\',\'ADDRESS\'))) LEFT OUTER JOIN LOCATIONS L2 ON (O.ORGANIZATION_ID=L2.ORGANIZATION_ID AND (UPPER(L2.TYPE) IN (\'DUAL\',\'PICKUP\'))) LEFT OUTER JOIN PAYMENT_INFO P ON (S.SUPPLIER_ID=P.OWNER_ID) WHERE S.SUPPLIER_ID=:supplierId ORDER BY S.SUPPLIER_ID',
        [supplierId] 
        // Use bind variables to prevent SQL injection
    );


    const supplierphone = await req.db.execute(
        'SELECT * FROM CONTACTS WHERE OWNER_ID = :supplierId AND UPPER(TYPE) = \'PHONE_NUMBER\' ORDER BY VALUE',
        [supplierId]
        // Use bind variables to prevent SQL injection
    );

    const suppliermail = await req.db.execute(
        'SELECT * FROM CONTACTS WHERE OWNER_ID = :supplierId AND UPPER(TYPE) = \'EMAIL\' ORDER BY VALUE',
        [supplierId]
        // Use bind variables to prevent SQL injection
    );


    res.render('./suppliers/supplierDetails', { 'supplierinfo': supplierinfo.rows, 'phone_numbers':supplierphone.rows, 'emails':suppliermail.rows });
})

supplierRoute.get("/products", async (req, res) => {
   

    try {
        let products;

        //category wise filtering
        const category= req.query.category; // check for differnet search queries
        const searchkey=req.query.searchkey;
        const stock=req.query.stock;
        const supplierId=req.query.supplierId;
        if (category) {
            console.log(category);
            products = await req.db.execute(
                `SELECT * 
                FROM SUPPLIER_PRODUCT SP1 JOIN PRODUCTS P ON (SP1.PRODUCT_ID=P.PRODUCT_ID)  where p.PRODUCT_ID IN (
                SELECT DISTINCT P2.PRODUCT_ID FROM PRODUCTS P2
                WHERE upper(p2.category) = upper(:category)) AND SP1.SUPPLIER_ID=:supplierId
                ORDER BY P.product_id`, [category,supplierId]
            );
        }
        
        else if (searchkey) {
            const searchPattern = `%${searchkey.toUpperCase()}%`;
        
            products = await req.db.execute(
                `SELECT * FROM SUPPLIER_PRODUCT SP2 JOIN PRODUCTS P2 ON (SP2.PRODUCT_ID=P2.PRODUCT_ID) WHERE P2.PRODUCT_ID IN
                (SELECT DISTINCT P1.PRODUCT_ID FROM SUPPLIER_PRODUCT SP1 
                JOIN PRODUCTS P1 ON (SP1.PRODUCT_ID=P1.PRODUCT_ID) 
                LEFT OUTER JOIN PRODUCT_FEATURES PF ON (P1.PRODUCT_ID = PF.PRODUCT_ID) 
                LEFT OUTER JOIN FEATURE_NAMES FN ON (PF.FEATURE_ID = FN.FEATURE_ID)
                WHERE SP1.SUPPLIER_ID=:supplierId AND
                (UPPER(P1.PRODUCT_NAME) LIKE UPPER(:searchPattern) OR UPPER(P1.CATEGORY) LIKE UPPER(:searchPattern) OR UPPER(P1.MANUFACTURER_ID) LIKE UPPER(:searchPattern)
                OR UPPER(PF.VALUE) LIKE UPPER(:searchPattern) OR UPPER(FN.FEATURE_NAME) LIKE UPPER(:searchPattern))
                ) AND SP2.SUPPLIER_ID=:supplierId
    ORDER BY P2.PRODUCT_ID`,  [supplierId, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern,supplierId]
            );

        }

        else if(stock)
        {
            if(stock=='in_stock')
            products = await req.db.execute(
                `SELECT *
                FROM SUPPLIER_PRODUCT SP2 JOIN PRODUCTS P ON (SP2.PRODUCT_ID=P.PRODUCT_ID) where p.PRODUCT_ID IN (
                    SELECT DISTINCT P2.PRODUCT_ID FROM SUPPLIER_PRODUCT SP JOIN PRODUCTS P2 ON (SP.PRODUCT_ID=P2.PRODUCT_ID) 
                WHERE p2.central_stock<>0 AND SP.SUPPLIER_ID=:supplierId) AND SP2.SUPPLIER_ID=:supplierId
                ORDER BY P.product_id`,{supplierId}
            );

            else
            products=await req.db.execute(
                `SELECT *
                FROM SUPPLIER_PRODUCT SP2 JOIN PRODUCTS P ON (SP2.PRODUCT_ID=P.PRODUCT_ID) where p.PRODUCT_ID IN (
                    SELECT DISTINCT P2.PRODUCT_ID FROM SUPPLIER_PRODUCT SP JOIN PRODUCTS P2 ON (SP.PRODUCT_ID=P2.PRODUCT_ID) 
                WHERE p2.central_stock=0 AND SP.SUPPLIER_ID=:supplierId) AND SP2.SUPPLIER_ID=:supplierId
                ORDER BY P.product_id`,{supplierId}
            );
        }

        else {
            products = await req.db.execute(
                `SELECT *
                FROM SUPPLIER_PRODUCT SP JOIN products P ON (SP.PRODUCT_ID=P.PRODUCT_ID) WHERE SP.SUPPLIER_ID=:supplierId
                ORDER BY p.product_id`,{supplierId}
            );
        }

        const categories = await req.db.execute(
            `SELECT DISTINCT CATEGORY
            FROM products
            ORDER BY CATEGORY`
        );

        res.render('./suppliers/productCatalogue', {
            'products': products.rows,
            'categories': categories.rows,
            'supplierId': supplierId

        });
    } catch (error) {
        console.error('error fetching', error);
        res.status(500).send('Internal server error');
    }
});

supplierRoute.get("/products/add", async (req, res) => {
   

    try {
        let products;

        //category wise filtering
        const category= req.query.category; // check for differnet search queries
        const searchkey=req.query.searchkey;
        const supplierId=req.query.supplierId;
        if (category) {
            products = await req.db.execute(
                `SELECT *
                FROM products
                WHERE upper(category) = upper(:category) AND PRODUCT_ID NOT IN (SELECT SP.PRODUCT_ID FROM SUPPLIER_PRODUCT SP WHERE SP.SUPPLIER_ID=:supplierId )
                ORDER BY product_id`, [category,supplierId]
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

        else {
            products = await req.db.execute(
                `SELECT *
                FROM products P WHERE P.PRODUCT_ID NOT IN (SELECT SP.PRODUCT_ID FROM SUPPLIER_PRODUCT SP WHERE SP.SUPPLIER_ID=:supplierId)
                ORDER BY product_id`,{supplierId}
            );
        }

        const categories = await req.db.execute(
            `SELECT DISTINCT CATEGORY
            FROM products
            ORDER BY CATEGORY`
        );

        res.render('./suppliers/addProductCatalogue', {
            'products': products.rows,
            'categories': categories.rows,
            'supplierId': supplierId

        });
    } catch (error) {
        console.error('error fetching', error);
        res.status(500).send('Internal server error');
    }
});

supplierRoute.get("/details/edit",async(req,res)=>{    
    const supplierId=parseInt(req.query.supplierId);
    const supplierinfo = await req.db.execute(
        'SELECT S.SUPPLIER_ID, O.NAME, O.URL,S.AVG_DELIVERY_TIME, L1.STREET_ADDRESS A_STREET_ADDRESS, L1.CITY A_CITY, L1.POSTAL_CODE A_POSTAL_CODE, L1.COUNTRY A_COUNTRY,L2.STREET_ADDRESS P_STREET_ADDRESS, L2.CITY P_CITY,L2.POSTAL_CODE P_POSTAL_CODE,L2.COUNTRY P_COUNTRY,P.ACCOUNT_NUMBER,P.ACCOUNT_HOLDER,P.BANK_NAME,P.IBAN FROM ORGANIZATIONS O JOIN SUPPLIERS S ON (O.ORGANIZATION_ID=S.SUPPLIER_ID) LEFT OUTER JOIN LOCATIONS L1 ON (O.ORGANIZATION_ID=L1.ORGANIZATION_ID AND (UPPER(L1.TYPE) IN (\'DUAL\',\'ADDRESS\'))) LEFT OUTER JOIN LOCATIONS L2 ON (O.ORGANIZATION_ID=L2.ORGANIZATION_ID AND (UPPER(L2.TYPE) IN (\'DUAL\',\'PICKUP\'))) LEFT OUTER JOIN PAYMENT_INFO P ON (P.OWNER_ID=O.ORGANIZATION_ID) WHERE S.SUPPLIER_ID=:supplierId ORDER BY O.ORGANIZATION_ID',
        [supplierId] 
        // Use bind variables to prevent SQL injection
    );

    const supplierphone = await req.db.execute(
        'SELECT * FROM CONTACTS WHERE OWNER_ID = :supplierId AND UPPER(TYPE) = \'PHONE_NUMBER\' ORDER BY VALUE',
        [supplierId]
        // Use bind variables to prevent SQL injection
    );

    const suppliermail = await req.db.execute(
        'SELECT * FROM CONTACTS WHERE OWNER_ID = :supplierId AND UPPER(TYPE) = \'EMAIL\' ORDER BY VALUE',
        [supplierId]
        // Use bind variables to prevent SQL injection
    );


    res.render('./suppliers/edit', { 'supplierinfo': supplierinfo.rows, 'phone_numbers':supplierphone.rows, 'emails':suppliermail.rows });
})

supplierRoute.post("/add/submitProducts", async (req, res) => {
    console.log("oolala");
    res.redirect('/suppliers' );

});

supplierRoute.post("/edit/submit", async (req, res) => {
    try {
        // Extract form data from request body
        let errorflag=0;
        const supplierId=req.query.supplierId;
        const { name, a_street_address,url, a_postal_code, a_city, a_country,p_street_address, p_postal_code, p_city, p_country,  avg_delivery_time, account_number, account_holder, bank, iban } = req.body;
        console.log("url:"+url);
        console.log("avg delivery time:"+avg_delivery_time);
        // Initialize error message
        let message = "";

        // Start a database transaction
        try {
            // Call the PL/SQL function to insert into BRANCHES
              await req.db.execute(
                `BEGIN UPDATE_SUPPLIER(:supplierId,:name,:url,:avg_delivery_time); END;`,
                {   
                    supplierId,
                    name,
                    url,
                    avg_delivery_time
                }
            );
            
             

            // Call the PL/SQL procedure to insert into LOCATIONS
        
            try {
                await req.db.execute(
                    `BEGIN UPDATE_LOCATION(:a_street_address, :a_postal_code, :a_city, :state_province, :a_country, :organization_id,:type); END;`,
                    {
                        a_street_address,
                        a_postal_code,
                        a_city,
                        state_province: '', // Replace with the actual value if available
                        a_country,
                        organization_id: supplierId,
                        type: 'ADDRESS' // Replace with the actual type
                    }
                );

            } catch (locationError) {
                errorflag=1;
                message += ` Location Error: ${locationError.message};`;
            }

            try {
                await req.db.execute(
                    `BEGIN UPDATE_LOCATION(:p_street_address, :p_postal_code, :p_city, :state_province, :p_country, :organization_id,:type); END;`,
                    {
                        p_street_address,
                        p_postal_code,
                        p_city,
                        state_province: '', // Replace with the actual value if available
                        p_country,
                        organization_id: supplierId,
                        type: 'PICKUP' // Replace with the actual type
                    }
                );

            } catch (locationError) {
                errorflag=1;
                message += ` Location Error: ${locationError.message};`;
            }

            const phoneNumbers = req.body.phone_number || [];
        for (const phoneNumber of phoneNumbers) {
            try {
                await req.db.execute(
                    'BEGIN add_contact(:organization_id, :contact_type, :contact_value); END;',
                    {
                        organization_id: supplierId,
                        contact_type: 'PHONE_NUMBER',
                        contact_value: phoneNumber
                    }
                );
            } catch (error) {
                // Handle contact insertion errors
                console.error('Phone Number Insertion Error:', error.message);
                errorflag=1;
                res.status(500).send('Error adding phone numbers.');
            }
        }

        // Call the PL/SQL procedure to add emails
        const emails = req.body.email || [];
        for (const email of emails) {
            try {
                await req.db.execute(
                    'BEGIN add_contact(:organization_id, :contact_type, :contact_value); END;',
                    {
                        organization_id: supplierId,
                        contact_type: 'EMAIL',
                        contact_value: email
                    }
                );
            } catch (error) {
                // Handle contact insertion errors
                console.error('Email Insertion Error:', error.message);
                // Rollback the transaction if needed
                errorflag=1;
                res.status(500).send('Error adding emails.');
            }
        }

            // Call the PL/SQL procedure to insert into PAYMENT_INFO
            if(account_number && bank)
            try {
                await req.db.execute(
                    `BEGIN UPDATE_PAYMENT_INFO(:owner_id, :account_number, :account_holder, :bank_name, :iban); END;`,
                    {
                        owner_id: supplierId,
                        account_number,
                        account_holder,
                        bank_name: bank,
                        iban
                    }
                );

            } catch (paymentInfoError) {
                message += ` Payment Info Error: ${paymentInfoError.message};`;
                errorflag=1;
            }
            
            // Commit the transaction
        if(errorflag===0)
           {
            await req.db.execute(" INSERT INTO LOGS (TIMESTAMP_COL, LOG_MESSAGE,TYPE) VALUES (CURRENT_TIMESTAMP,  'SUPPLIER '||:supplierId ||' '|| :name || ' UPDATED','UPDATE')",{supplierId,name});
            await req.db.execute("COMMIT");
            res.redirect(`/suppliers/details?supplierId=${supplierId}`);
           }
            
        else
            {
                await req.db.execute("ROLLBACK");
                await req.db.execute(" INSERT INTO LOGS (TIMESTAMP_COL, LOG_MESSAGE,TYPE) VALUES (CURRENT_TIMESTAMP,  'SUPPLIER '||:supplierId ||' '|| :name || ' UPDATE FAILED','UPDATE')",{supplierId,name});
                await req.db.execute("COMMIT");
            }

            console.log(message);
            // Send a success response
            res.status(200).send(message);
        } catch (error) {
            // Rollback the transaction in case of an error

            // Capture the error message
            message = ` Internal Server Error: ${error.message}`;
            
            await req.db.execute("ROLLBACK");
            await req.db.execute(" INSERT INTO LOGS (TIMESTAMP_COL, LOG_MESSAGE,TYPE) VALUES (CURRENT_TIMESTAMP,  'SUPPLIER '||:supplierId ||' '|| :name || ' UPDATE FAILED','UPDATE')",{supplierId,name});
            await req.db.execute("COMMIT");
            // Send an error response
            res.status(500).send(message);
        } 
    } catch (error) {
        console.error(error);
    }
});

/////////////////////////////////////////////////////////////add
supplierRoute.get("/add",(req,res)=>{       
    //just render the addSupplier page
    res.render('./suppliers/addSupplier');
})

supplierRoute.post("/submit", async (req, res) => {
    try {
        // Extract form data from request body
        const { name, a_street, a_postal_code, a_city, a_country, p_street, p_postal_code, p_city, p_country,url, avg_shipping_duration, account_number, account_holder, bank, iban } = req.body;
        
        // Initialize error message
        let message = "";
        let errorflag=0;

        // Start a database transaction
        try {
            // Call the PL/SQL function to insert into BRANCHES
            const result = await req.db.execute(
                `BEGIN :supplier_id := INSERT_SUPPLIER(:name,:url,:avg_shipping_duration); END;`,
                {
                    name,
                    url,
                    avg_shipping_duration,
                    supplier_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
                }
            );
            

            const supplierId = result.outBinds.supplier_id;

            // Call the PL/SQL procedure to insert into LOCATIONS
        
            try {
                await req.db.execute(
                    `BEGIN INSERT_LOCATION(:a_street_address, :a_postal_code, :a_city, :a_state_province, :a_country, :organization_id, :type); END;`,
                    {
                        a_street_address:a_street,
                        a_postal_code,
                        a_city,
                        a_state_province: '', // Replace with the actual value if available
                        a_country,
                        organization_id: supplierId,
                        type: 'ADDRESS' // Replace with the actual type
                    }
                );

            } catch (locationError) {
                errorflag=1;
                message += ` Location Error: ${locationError.message};`;
            }

            try {
                await req.db.execute(
                    `BEGIN INSERT_LOCATION(:p_street_address, :p_postal_code, :p_city, :p_state_province, :p_country, :organization_id, :type); END;`,
                    {
                        p_street_address:p_street,
                        p_postal_code,
                        p_city,
                        p_state_province: '', // Replace with the actual value if available
                        p_country,
                        organization_id: supplierId,
                        type: 'PICKUP' // Replace with the actual type
                    }
                );

            } catch (locationError) {
                errorflag=1;
                message += ` Location Error: ${locationError.message};`;
            }

            const phoneNumbers = req.body.phone_number || [];
        for (const phoneNumber of phoneNumbers) {
            try {
                await req.db.execute(
                    'BEGIN add_contact(:organization_id, :contact_type, :contact_value); END;',
                    {
                        organization_id: supplierId,
                        contact_type: 'PHONE_NUMBER',
                        contact_value: phoneNumber
                    }

                );
            } catch (error) {
                // Handle contact insertion errors
                console.error('Phone Number Insertion Error:', error.message);
                // Rollback the transaction if needed
                errorflag=1;
                res.status(500).send('Error adding phone numbers.');
            }
        }

        // Call the PL/SQL procedure to add emails
        const emails = req.body.email || [];
        for (const email of emails) {
            try {
                await req.db.execute(
                    'BEGIN add_contact(:organization_id, :contact_type, :contact_value); END;',
                    {
                        organization_id: supplierId,
                        contact_type: 'EMAIL',
                        contact_value: email
                    }
                );
            } catch (error) {
                // Handle contact insertion errors
                console.error('Email Insertion Error:', error.message);
                errorflag=1;
                res.status(500).send('Error adding emails.');
            }
        }

            // Call the PL/SQL procedure to insert into PAYMENT_INFO
            if(account_number && bank)
            try {
                await req.db.execute(
                    `BEGIN ADD_PAYMENT_INFO(:owner_id, :account_number, :account_holder, :bank_name, :iban); END;`,
                    {
                        owner_id: supplierId,
                        account_number,
                        account_holder,
                        bank_name: bank,
                        iban
                    }
                );

            } catch (paymentInfoError) {
                message += ` Payment Info Error: ${paymentInfoError.message};`;
                errorflag=1;
            }
            console.log(errorflag);
            // Commit the transaction
            if(errorflag===0)
            {
             await req.db.execute("COMMIT");
             res.redirect(`/suppliers/details?supplierId=${supplierId}`);
            }

            
             
         else
             {
                await req.db.execute("ROLLBACK");
                await req.db.execute(" INSERT INTO LOGS (TIMESTAMP_COL, LOG_MESSAGE, TYPE, ACTION, OUTCOME) VALUES (CURRENT_TIMESTAMP, 'SUPPLIER ' || :name || ' INSERT FAILED', 'ORGANIZATION', 'INSERT', 'FAILED')", { name });
                await req.db.execute("COMMIT");
                res.status(500).send(message);
             }

            console.log(message);
           
            // Send a success response
        } catch (error) {
            // Rollback the transaction in case of an error

            // Capture the error message
            message += ` Internal Server Error: ${error.message}`;
            
            await req.db.execute("ROLLBACK");
            await req.db.execute(" INSERT INTO LOGS (TIMESTAMP_COL, LOG_MESSAGE, TYPE, ACTION, OUTCOME) VALUES (CURRENT_TIMESTAMP, 'SUPPLIER ' || :name || ' INSERT FAILED', 'ORGANIZATION', 'INSERT', 'FAILED')", { name });
            await req.db.execute("COMMIT");

            // Send an error response
            res.status(500).send(message);
        } 
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports=supplierRoute;