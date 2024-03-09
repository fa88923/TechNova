const express=require("express");
const clientRoute=express.Router();


clientRoute.get("/", async (req, res) => {
   

    try {
        let clients;
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
        
              clients = await req.db.execute(
                `SELECT C.CLIENT_ID, O.NAME, O.URL, STREET_ADDRESS||', '||CITY||'-'||POSTAL_CODE ADDRESS FROM
                ORGANIZATIONS O JOIN CLIENT_COMPANIES C ON (O.ORGANIZATION_ID=C.CLIENT_ID)
                LEFT OUTER JOIN LOCATIONS L ON (O.ORGANIZATION_ID=L.ORGANIZATION_ID)
                WHERE UPPER(NAME) LIKE :searchPattern OR UPPER(STREET_ADDRESS) LIKE :searchPattern OR 
                UPPER(POSTAL_CODE) LIKE :searchPattern 
                OR UPPER(CITY) LIKE :searchPattern
                OR UPPER(COUNTRY) LIKE :searchPattern OR UPPER(C.TYPE) LIKE :searchPattern
                OR UPPER(URL) LIKE :searchPattern
                OR UPPER(C.TYPE) LIKE :searchPattern
                ORDER BY O.ORGANIZATION_ID`, { searchPattern }
            );
        }

        else
            {
                clients = await req.db.execute(
                `SELECT C.CLIENT_ID, O.NAME, O.URL, STREET_ADDRESS||', '||CITY||'-'||POSTAL_CODE ADDRESS FROM
                ORGANIZATIONS O JOIN CLIENT_COMPANIES C ON (O.ORGANIZATION_ID=C.CLIENT_ID)
                LEFT OUTER JOIN LOCATIONS L ON (O.ORGANIZATION_ID=L.ORGANIZATION_ID)
                ORDER BY O.ORGANIZATION_ID`
            );
            }

       

        res.render('./clients/client', {
            'clients': clients.rows
        });
    } catch (error) {
        console.error('error fetching', error);
        res.status(500).send('Internal server error');
    }
});

clientRoute.get("/details",async(req,res)=>{       
    //just render the addSupplier page
    const clientId=parseInt(req.query.clientId);
    // Execute SQL query to search in the database
    const clientinfo = await req.db.execute(
        'SELECT C.CLIENT_ID, O.NAME, O.URL, C.TYPE,STREET_ADDRESS||\', \'||CITY||\'-\'||POSTAL_CODE ADDRESS,P.ACCOUNT_NUMBER,P.ACCOUNT_HOLDER,P.BANK_NAME,P.IBAN FROM ORGANIZATIONS O JOIN CLIENT_COMPANIES C ON (O.ORGANIZATION_ID=C.CLIENT_ID) LEFT OUTER JOIN LOCATIONS L ON (O.ORGANIZATION_ID=L.ORGANIZATION_ID)  LEFT OUTER JOIN PAYMENT_INFO P ON (C.CLIENT_ID=P.OWNER_ID) WHERE C.CLIENT_ID=:clientId ORDER BY O.ORGANIZATION_ID', [clientId] 
        // Use bind variables to prevent SQL injection
    );


    const clientphone = await req.db.execute(
        'SELECT * FROM CONTACTS WHERE OWNER_ID = :clientId AND UPPER(TYPE) = \'PHONE_NUMBER\' ORDER BY VALUE',
        [clientId]
        // Use bind variables to prevent SQL injection
    );

    const clientmail = await req.db.execute(
        'SELECT * FROM CONTACTS WHERE OWNER_ID = :clientId AND UPPER(TYPE) = \'EMAIL\' ORDER BY VALUE',
        [clientId]
        // Use bind variables to prevent SQL injection
    );

    res.render('./clients/details', { 'clientinfo': clientinfo.rows, 'phone_numbers':clientphone.rows, 'emails':clientmail.rows });
})

clientRoute.get("/details/edit",async(req,res)=>{    
    const clientId=parseInt(req.query.clientId);
    const clientinfo = await req.db.execute(
        'SELECT C.CLIENT_ID, O.NAME, O.URL,STREET_ADDRESS,CITY,POSTAL_CODE,COUNTRY,P.ACCOUNT_NUMBER,P.ACCOUNT_HOLDER,P.BANK_NAME,P.IBAN FROM ORGANIZATIONS O JOIN CLIENT_COMPANIES C ON (O.ORGANIZATION_ID=C.CLIENT_ID) LEFT OUTER JOIN LOCATIONS L ON (O.ORGANIZATION_ID=L.ORGANIZATION_ID)  LEFT OUTER JOIN PAYMENT_INFO P ON (C.CLIENT_ID=P.OWNER_ID) WHERE C.CLIENT_ID=:clientId ORDER BY O.ORGANIZATION_ID',
        [clientId] 
        // Use bind variables to prevent SQL injection
    );

    const clientphone = await req.db.execute(
        'SELECT * FROM CONTACTS WHERE OWNER_ID = :clientId AND UPPER(TYPE) = \'PHONE_NUMBER\' ORDER BY VALUE',
        [clientId]
        // Use bind variables to prevent SQL injection
    );

    const clientmail = await req.db.execute(
        'SELECT * FROM CONTACTS WHERE OWNER_ID = :clientId AND UPPER(TYPE) = \'EMAIL\' ORDER BY VALUE',
        [clientId]
        // Use bind variables to prevent SQL injection
    );


    res.render('./clients/edit', { 'clientinfo': clientinfo.rows, 'phone_numbers':clientphone.rows, 'emails':clientmail.rows });
})

clientRoute.post("/edit/submit", async (req, res) => {
    try {
        // Extract form data from request body
        let errorflag=0;
        const clientId=req.query.clientId;
        const { name, street_address,url,postal_code,city,country,account_number, account_holder, bank, iban } = req.body;
    
        // Initialize error message
        let message = "";

        // Start a database transaction
        try {
            // Call the PL/SQL function to insert into BRANCHES
              await req.db.execute(
                `BEGIN UPDATE_ORGANIZATION(:clientId,:name,:url); END;`,
                {   
                    clientId,
                    name,
                    url
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
                        organization_id: clientId,
                        type: 'DUAL' // Replace with the actual type
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
                        organization_id: clientId,
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
                        organization_id: clientId,
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
                        owner_id: clientId,
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
            res.redirect(`/clients/details?clientId=${clientId}`);
           }
            
        else
            {
                await req.db.execute("ROLLBACK");
            await req.db.execute(" INSERT INTO LOGS (TIMESTAMP_COL, LOG_MESSAGE, TYPE, ACTION, OUTCOME) VALUES (CURRENT_TIMESTAMP, 'CLIENT' ||:clientId|| ' '|| :name || ' UPDATE FAILED', 'ORGANIZATION', 'UPDATE', 'FAILED')", [name,clientId ]);
            await req.db.execute("COMMIT");
                res.status(500).send(message);
            }

            console.log(message);
            // Send a success response
        } catch (error) {
            // Rollback the transaction in case of an error

            // Capture the error message
            message = ` Internal Server Error: ${error.message}`;
            
            await req.db.execute("ROLLBACK");
            await req.db.execute(" INSERT INTO LOGS (TIMESTAMP_COL, LOG_MESSAGE, TYPE, ACTION, OUTCOME) VALUES (CURRENT_TIMESTAMP, 'CLIENT' ||:clientId|| ' '|| :name || ' UPDATE FAILED', 'ORGANIZATION', 'UPDATE', 'FAILED')", [name,clientId ]);
            await req.db.execute("COMMIT");
            // Send an error response
            res.status(500).send(message);
        } 
    } catch (error) {
        console.error(error);
        res.status(500).send('INTERNAL SERVER ERROR');
    }
});

module.exports=clientRoute;