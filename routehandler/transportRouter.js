const express=require("express");
const transportRoute=express.Router();
const oracledb=require("oracledb");


transportRoute.get("/", async (req, res) => {
   

    try {
        let transports;
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
        
              transports = await req.db.execute(
                `SELECT T.COMPANY_ID, O.NAME, O.URL, STREET_ADDRESS||', '||CITY||'-'||POSTAL_CODE ADDRESS,T.CAPACITY FROM
                ORGANIZATIONS O JOIN TRANSPORT_COMPANIES T ON (O.ORGANIZATION_ID=T.COMPANY_ID)
                LEFT OUTER JOIN LOCATIONS L ON (O.ORGANIZATION_ID=L.ORGANIZATION_ID)
                WHERE UPPER(O.NAME) LIKE :searchPattern OR UPPER(STREET_ADDRESS) LIKE :searchPattern OR UPPER(CITY) LIKE :searchPattern
                OR UPPER(POSTAL_CODE) LIKE :searchPattern
                OR UPPER(COUNTRY) LIKE :searchPattern
                OR UPPER(CITY) LIKE :searchPattern
                OR UPPER(URL) LIKE :searchPattern
                ORDER BY O.ORGANIZATION_ID`, { searchPattern }
            );
        }

        else
            {
                transports = await req.db.execute(
                `SELECT T.COMPANY_ID, O.NAME, O.URL, STREET_ADDRESS||', '||CITY||'-'||POSTAL_CODE ADDRESS,T.CAPACITY FROM
                ORGANIZATIONS O JOIN TRANSPORT_COMPANIES T ON (O.ORGANIZATION_ID=T.COMPANY_ID)
                LEFT OUTER JOIN LOCATIONS L ON (O.ORGANIZATION_ID=L.ORGANIZATION_ID)
                ORDER BY O.ORGANIZATION_ID`
            );
            }

       

        res.render('./transports/transport', {
            'transporters': transports.rows
        });
    } catch (error) {
        console.error('error fetching', error);
        res.status(500).send('Internal server error');
    }
});

transportRoute.get("/details",async(req,res)=>{       
    //just render the addSupplier page
    const companyId=parseInt(req.query.companyId);
    // Execute SQL query to search in the database
    const companyinfo = await req.db.execute(
        'SELECT T.COMPANY_ID,O.NAME, STREET_ADDRESS||\', \'||CITY||\'-\'||POSTAL_CODE ADDRESS,T.CAPACITY,P.ACCOUNT_NUMBER,P.ACCOUNT_HOLDER,P.BANK_NAME,P.IBAN FROM ORGANIZATIONS O JOIN TRANSPORT_COMPANIES T ON (O.ORGANIZATION_ID=T.COMPANY_ID) LEFT OUTER JOIN LOCATIONS L ON (O.ORGANIZATION_ID=L.ORGANIZATION_ID) LEFT OUTER JOIN PAYMENT_INFO P ON (T.COMPANY_ID=P.OWNER_ID) WHERE T.COMPANY_ID=:companyId ORDER BY T.COMPANY_ID', [companyId] 
        // Use bind variables to prevent SQL injection
    );


    const phone = await req.db.execute(
        'SELECT * FROM CONTACTS WHERE OWNER_ID = :companyId AND UPPER(TYPE) = \'PHONE_NUMBER\' ORDER BY VALUE',
        [companyId]
        // Use bind variables to prevent SQL injection
    );

    const mail = await req.db.execute(
        'SELECT * FROM CONTACTS WHERE OWNER_ID = :companyId AND UPPER(TYPE) = \'EMAIL\' ORDER BY VALUE',
        [companyId]
        // Use bind variables to prevent SQL injection
    );

    res.render('./transports/details', { 'companyinfo': companyinfo.rows, 'phone_numbers':phone.rows, 'emails':mail.rows });
})

transportRoute.get("/details/edit",async(req,res)=>{    
    const companyId=parseInt(req.query.companyId);
    const companyinfo = await req.db.execute(
        'SELECT T.COMPANY_ID,O.URL,O.NAME,STREET_ADDRESS,CITY,POSTAL_CODE,COUNTRY,T.CAPACITY,P.ACCOUNT_NUMBER,P.ACCOUNT_HOLDER,P.BANK_NAME,P.IBAN FROM ORGANIZATIONS O JOIN TRANSPORT_COMPANIES T ON (O.ORGANIZATION_ID=T.COMPANY_ID) LEFT OUTER JOIN LOCATIONS L ON (O.ORGANIZATION_ID=L.ORGANIZATION_ID) LEFT OUTER JOIN PAYMENT_INFO P ON (T.COMPANY_ID=P.OWNER_ID) WHERE T.COMPANY_ID=:companyId ORDER BY T.COMPANY_ID',
        [companyId] 
        // Use bind variables to prevent SQL injection
    );

    const phone = await req.db.execute(
        'SELECT * FROM CONTACTS WHERE OWNER_ID = :companyId AND UPPER(TYPE) = \'PHONE_NUMBER\' ORDER BY VALUE',
        [companyId]
        // Use bind variables to prevent SQL injection
    );

    const mail = await req.db.execute(
        'SELECT * FROM CONTACTS WHERE OWNER_ID = :companyId AND UPPER(TYPE) = \'EMAIL\' ORDER BY VALUE',
        [companyId]
        // Use bind variables to prevent SQL injection
    );


    res.render('./transports/edit', { 'companyinfo': companyinfo.rows, 'phone_numbers':phone.rows, 'emails':mail.rows });
})


transportRoute.post("/edit/submit", async (req, res) => {
    try {
        // Extract form data from request body
        let errorflag=0;
        const companyId=req.query.companyId;
        const { name,street_address,url,postal_code,city,country,capacity, account_number, account_holder, bank, iban } = req.body;
        
        // Initialize error message
        let message = "";

        // Start a database transaction
        try {
            // Call the PL/SQL function to insert into BRANCHES
              await req.db.execute(
                `BEGIN UPDATE_TRANSPORT_COMPANY(:companyId,:name,:url,:capacity); END;`,
                {   
                    companyId,
                    name,
                    url,
                    capacity
                }
            );
            
             

            // Call the PL/SQL procedure to insert into LOCATIONS
        
            try {
                await req.db.execute(
                    `BEGIN UPDATE_LOCATION(:street_address, :postal_code, :city, :state_province, :country, :organization_id,:type); END;`,
                    {
                        street_address,
                        postal_code,
                        city,
                        state_province: '', // Replace with the actual value if available
                        country,
                        organization_id: companyId,
                        type: 'ADDRESS' // Replace with the actual type
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
                        organization_id: companyId,
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
                        organization_id: companyId,
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
                        owner_id: companyId,
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
            await req.db.execute(" INSERT INTO LOGS (TIMESTAMP_COL, LOG_MESSAGE,TYPE) VALUES (CURRENT_TIMESTAMP,  'TRANSPORT COMPANY '||:companyId ||' '|| :name || ' UPDATED','UPDATE')",{companyId,name});
            await req.db.execute("COMMIT");
            res.redirect(`/transports/details?companyId=${companyId}`);
           }
            
        else
            {
                await req.db.execute("ROLLBACK");
                await req.db.execute(" INSERT INTO LOGS (TIMESTAMP_COL, LOG_MESSAGE,TYPE) VALUES (CURRENT_TIMESTAMP,  'TRANSPORT COMPANY '||:companyId ||' '|| :name || ' UPDATE FAILED','UPDATE')",{companyId,name});
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
            await req.db.execute(" INSERT INTO LOGS (TIMESTAMP_COL, LOG_MESSAGE,TYPE) VALUES (CURRENT_TIMESTAMP,  'TRANSPORT COMPANY '||:companyId ||' '|| :name || ' UPDATE FAILED','UPDATE')",{companyId,name});
            await req.db.execute("COMMIT");
            // Send an error response
            res.status(500).send(message);
        } 
    } catch (error) {
        console.error(error);
    }
});

transportRoute.get("/add",(req,res)=>{       
    //just render the addSupplier page
    res.render('./transports/addCompany');
});

transportRoute.post("/submit", async (req, res) => {
    try {
        // Extract form data from request body
        const { name, street_address, postal_code, city, country,url,capacity, account_number, account_holder, bank, iban } = req.body;
        
        // Initialize error message
        let message = "";
        let errorflag=0;

        // Start a database transaction
        try {
            // Call the PL/SQL function to insert into BRANCHES
            const result = await req.db.execute(
                `BEGIN :company_id := INSERT_TRANSPORT_COMPANY(:name,:url,:capacity); END;`,
                {
                    name,
                    url,
                    capacity,
                    company_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
                }
            );
            

            const companyId = result.outBinds.company_id;

            // Call the PL/SQL procedure to insert into LOCATIONS
        
            try {
                await req.db.execute(
                    `BEGIN INSERT_LOCATION(:street_address, :postal_code, :city, :state_province, :country, :organization_id, :type); END;`,
                    {
                        street_address,
                        postal_code,
                        city,
                        state_province: '', // Replace with the actual value if available
                        country,
                        organization_id: companyId,
                        type: 'ADDRESS' // Replace with the actual type
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
                        organization_id: companyId,
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
                        organization_id: companyId,
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
                        owner_id: companyId,
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
            await req.db.execute("COMMIT");
             res.redirect(`/transports/details?companyId=${companyId}`);
            }
             
         else
             {
                 await req.db.execute("ROLLBACK");
                 await req.db.execute(" INSERT INTO LOGS (TIMESTAMP_COL, LOG_MESSAGE,TYPE,ACTION,OUTCOME) VALUES (CURRENT_TIMESTAMP,  'SHIPPING COMPANY '|| :name || ' INSERT FAILED','ORGANIZATION','INSERT','FAILED)",[name]);
                 await req.db.execute("COMMIT");
                 res.status(500).send(message);
             }

            console.log(message);
           
        } catch (error) {
            // Rollback the transaction in case of an error

            // Capture the error message
            message += ` Internal Server Error: ${error.message}`;
            
            await req.db.execute("ROLLBACK");
            await req.db.execute(" INSERT INTO LOGS (TIMESTAMP_COL, LOG_MESSAGE, TYPE, ACTION, OUTCOME) VALUES (CURRENT_TIMESTAMP, 'SHIPPING COMPANY ' || :name || ' INSERT FAILED', 'ORGANIZATION', 'INSERT', 'FAILED')", { name });
            await req.db.execute("COMMIT");

            // Send an error response
            res.status(500).send(message);
        } 
    } catch (error) {
        console.error(error);
        res.status(500).send('INTERNAL SERVER ERROR');
    }
});



module.exports=transportRoute;