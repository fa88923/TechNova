const express=require("express");
const oracledb=require("oracledb");
const branchRoute=express.Router();


branchRoute.get("/", async (req, res) => {
   

    try {
        let branches;
        const searchkey=req.query.searchkey;
        //category wise filtering

        const deletekey=req.query.delete;

        if(deletekey)
        {
        
            branches = await req.db.execute(
                `DELETE FROM ORGANIZATIONS WHERE ORGANIZATION_ID=:deletekey`, { deletekey }
            );

            branches = await req.db.execute(
                `COMMIT`
            );
        }
        
         if (searchkey) {
            const searchPattern = `%${searchkey.toUpperCase()}%`;
        
            branches = await req.db.execute(
                `SELECT B.BRANCH_ID, O.NAME, B.MANAGER, STREET_ADDRESS||', '||CITY||'-'||POSTAL_CODE BRANCH_ADDRESS FROM
                ORGANIZATIONS O JOIN BRANCHES B ON (O.ORGANIZATION_ID=B.BRANCH_ID)
                LEFT OUTER JOIN LOCATIONS L ON (O.ORGANIZATION_ID=L.ORGANIZATION_ID)
                WHERE UPPER(NAME) LIKE :searchPattern OR UPPER(STREET_ADDRESS) LIKE :searchPattern 
                OR UPPER(CITY) LIKE :searchPattern
                OR UPPER(POSTAL_CODE) LIKE :searchPattern 
                OR UPPER(COUNTRY) LIKE :searchPattern OR UPPER(MANAGER) LIKE :searchPattern
                ORDER BY O.ORGANIZATION_ID`, { searchPattern }
            );
        }

        else
            {
                branches = await req.db.execute(
                `SELECT B.BRANCH_ID, O.NAME, B.MANAGER, STREET_ADDRESS||', '||CITY||'-'||POSTAL_CODE BRANCH_ADDRESS,LOG.ACTION|| ' on ' ||LOG.TIMESTAMP_COL L_MSG
                FROM
                ORGANIZATIONS O JOIN BRANCHES B ON (O.ORGANIZATION_ID=B.BRANCH_ID)
                LEFT OUTER JOIN LOCATIONS L ON (O.ORGANIZATION_ID=L.ORGANIZATION_ID)
								LEFT OUTER JOIN(SELECT * FROM LOGS LO LEFT OUTER JOIN ORGANIZATION_LOGS OLO ON (LO.LOG_ID=OLO.LOG_ID)
								WHERE LO.TIMESTAMP_COL>=ALL(SELECT TIMESTAMP_COL FROM  LOGS LO1 LEFT OUTER JOIN ORGANIZATION_LOGS OLO1 ON (LO1.LOG_ID=OLO1.LOG_ID) 								WHERE OLO1.ORGANIZATION_ID=OLO.ORGANIZATION_ID))LOG ON (B.BRANCH_ID=LOG.ORGANIZATION_ID)
                ORDER BY O.ORGANIZATION_ID`
            );
            }

       

        res.render('./branches/branch', {
            'branches': branches.rows
        });
    } catch (error) {
        console.error('error fetching', error);
        res.status(500).send('Internal server error');
    }
});



branchRoute.get("/details",async(req,res)=>{       
    //just render the addSupplier page
    const branchId=parseInt(req.query.branchId);
    // Execute SQL query to search in the database
    const branchinfo = await req.db.execute(
        'SELECT B.BRANCH_ID,O.NAME, B.MANAGER,STREET_ADDRESS||\', \'||CITY||\'-\'||POSTAL_CODE ADDRESS,B.SQUARE_FOOTAGE,B.AVG_SHIPPING_DURATION,P.ACCOUNT_NUMBER,P.ACCOUNT_HOLDER,P.BANK_NAME,P.IBAN FROM ORGANIZATIONS O JOIN BRANCHES B ON (O.ORGANIZATION_ID=B.BRANCH_ID) LEFT OUTER JOIN LOCATIONS L ON (O.ORGANIZATION_ID=L.ORGANIZATION_ID) LEFT OUTER JOIN PAYMENT_INFO P ON (B.BRANCH_ID=P.OWNER_ID) WHERE B.BRANCH_ID=:branchId ORDER BY B.BRANCH_ID',
        [branchId] 
        // Use bind variables to prevent SQL injection
    );


    const branchphone = await req.db.execute(
        'SELECT * FROM CONTACTS WHERE OWNER_ID = :branchId AND UPPER(TYPE) = \'PHONE_NUMBER\' ORDER BY VALUE',
        [branchId]
        // Use bind variables to prevent SQL injection
    );

    const branchmail = await req.db.execute(
        'SELECT * FROM CONTACTS WHERE OWNER_ID = :branchId AND UPPER(TYPE) = \'EMAIL\' ORDER BY VALUE',
        [branchId]
        // Use bind variables to prevent SQL injection
    );


    res.render('./branches/details', { 'branchinfo': branchinfo.rows, 'phone_numbers':branchphone.rows, 'emails':branchmail.rows });
})

branchRoute.get("/details/incomeStatement",async(req,res)=>{       
    //just render the addSupplier page
    const branchId=parseInt(req.query.branchId);
    const month=parseInt(req.query.month);
    const year=parseInt(req.query.year);
    // Execute SQL query to search in the database
    const branchinfo = await req.db.execute(
        'SELECT O.NAME,B.BRANCH_ID FROM ORGANIZATIONS O JOIN BRANCHES B ON (O.ORGANIZATION_ID=B.BRANCH_ID) WHERE B.BRANCH_ID=:branchId',[branchId]
        // Use bind variables to prevent SQL injection
    );
    let branchIncome;
    if(month)
    {
        branchIncome = await req.db.execute(
        'SELECT * FROM BRANCH_INCOME_STATEMENT WHERE EXTRACT(MONTH FROM START_DATE) = :month AND EXTRACT(YEAR FROM START_DATE) = :year AND BRANCH_ID = :branchId',
        [month, year, branchId]  // Pass an array of bind variables in the correct order
    );
    }
    else if(year)
    {
        branchIncome = await req.db.execute(
            'SELECT * FROM BRANCH_INCOME_STATEMENT where  EXTRACT(YEAR FROM START_DATE)=:year AND BRANCH_ID=:branchId',[year,branchId]
            // Use bind variables to prevent SQL injection
        );
    }
    else
    {
        branchIncome = await req.db.execute(
        'SELECT * FROM BRANCH_INCOME_STATEMENT WHERE BRANCH_ID=:branchId',[branchId]
        // Use bind variables to prevent SQL injection
    );
    }
    res.render('./branches/income', { 'branchinfo': branchinfo.rows, 'income':branchIncome.rows});
})

branchRoute.get("/details/edit",async(req,res)=>{       
    //just render the addSupplier page
    const branchId=parseInt(req.query.branchId);
    // Execute SQL query to search in the database
    const branchinfo = await req.db.execute(
        'SELECT B.BRANCH_ID,O.NAME, B.MANAGER,STREET_ADDRESS,CITY,POSTAL_CODE,COUNTRY,B.SQUARE_FOOTAGE,B.AVG_SHIPPING_DURATION,P.ACCOUNT_NUMBER,P.ACCOUNT_HOLDER,P.BANK_NAME,P.IBAN FROM ORGANIZATIONS O JOIN BRANCHES B ON (O.ORGANIZATION_ID=B.BRANCH_ID) LEFT OUTER JOIN LOCATIONS L ON (O.ORGANIZATION_ID=L.ORGANIZATION_ID) LEFT OUTER JOIN PAYMENT_INFO P ON (B.BRANCH_ID=P.OWNER_ID) WHERE B.BRANCH_ID=:branchId ORDER BY B.BRANCH_ID',
        [branchId] 
        // Use bind variables to prevent SQL injection
    );


    const branchphone = await req.db.execute(
        'SELECT * FROM CONTACTS WHERE OWNER_ID = :branchId AND UPPER(TYPE) = \'PHONE_NUMBER\' ORDER BY VALUE',
        [branchId]
        // Use bind variables to prevent SQL injection
    );

    const branchmail = await req.db.execute(
        'SELECT * FROM CONTACTS WHERE OWNER_ID = :branchId AND UPPER(TYPE) = \'EMAIL\' ORDER BY VALUE',
        [branchId]
        // Use bind variables to prevent SQL injection
    );


    res.render('./branches/edit', { 'branchinfo': branchinfo.rows, 'phone_numbers':branchphone.rows, 'emails':branchmail.rows });
})

branchRoute.post("/edit/submit", async (req, res) => {
    try {
        // Extract form data from request body
        let errorflag=0;
        const branchId=req.query.branchId;
        const { name, street, postal_code, city, country, manager, square_footage, avg_shipping_duration, account_number, account_holder, bank, iban } = req.body;
        
        // Initialize error message
        let message = "";

        // Start a database transaction
        try {
            // Call the PL/SQL function to insert into BRANCHES

            try {
              await req.db.execute(
                `BEGIN UPDATE_BRANCH(:branchId,:name,:url,:manager, :square_footage, :avg_shipping_duration); END;`,
                {   
                    branchId,
                    name,
                    url: '',
                    manager,
                    square_footage,
                    avg_shipping_duration
                }
            );

        } catch (error) {
            errorflag=1;
            message += ` Location Error: ${error.message};`;
        }
            
             

            // Call the PL/SQL procedure to insert into LOCATIONS
        
            try {
                await req.db.execute(
                    `BEGIN UPDATE_LOCATION(:street_address, :postal_code, :city, :state_province, :country, :organization_id,:type); END;`,
                    {
                        street_address: street,
                        postal_code,
                        city,
                        state_province: '', // Replace with the actual value if available
                        country,
                        organization_id: branchId,
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
                        organization_id: branchId,
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
                        organization_id: branchId,
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
                        owner_id: branchId,
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
            res.redirect(`/branches/details?branchId=${branchId}`);
           }
            
        else
            {
                await req.db.execute("ROLLBACK");
                await req.db.execute(" INSERT INTO LOGS (TIMESTAMP_COL, LOG_MESSAGE, TYPE, ACTION, OUTCOME) VALUES (CURRENT_TIMESTAMP, 'BRANCH' ||:branchId|| ' '|| :name || ' UPDATE FAILED', 'ORGANIZATION', 'UPDATE', 'FAILED')", [name,branchId ]);
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
            await req.db.execute(" INSERT INTO LOGS (TIMESTAMP_COL, LOG_MESSAGE, TYPE, ACTION, OUTCOME) VALUES (CURRENT_TIMESTAMP, 'BRANCH' ||:branchId|| ' '|| :name || ' UPDATE FAILED', 'ORGANIZATION', 'UPDATE', 'FAILED')", [name,branchId ]);
            await req.db.execute("COMMIT");
            // Send an error response
            res.status(500).send(message);
        } 
    } catch (error) {
        console.error(error);
        res.status(500).send('INTERNAL SERVER ERROR');
        // Send an error response
    }
});

branchRoute.get("/add",(req,res)=>{       
    //just render the addSupplier page
    res.render('./branches/addBranch');
})

branchRoute.post("/submit", async (req, res) => {
    try {
        // Extract form data from request body
        const { name, street, postal_code, city, country, manager, square_footage, avg_shipping_duration, account_number, account_holder, bank, iban } = req.body;
        
        // Initialize error message
        let message = "";
        let errorflag=0;

        // Start a database transaction
        try {
            // Call the PL/SQL function to insert into BRANCHES
           
           
           const result = await req.db.execute(
                `BEGIN :branch_id := INSERT_BRANCH(:name,:url, :manager, :square_footage, :avg_shipping_duration); END;`,
                {
                    name,
                    url: '',
                    manager,
                    square_footage,
                    avg_shipping_duration,
                    branch_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
                }
            );
            
            

            const branchId = result.outBinds.branch_id;

            // Call the PL/SQL procedure to insert into LOCATIONS
        
            try {
                await req.db.execute(
                    `BEGIN INSERT_LOCATION(:street_address, :postal_code, :city, :state_province, :country, :organization_id, :type); END;`,
                    {
                        street_address: street,
                        postal_code,
                        city,
                        state_province: '', // Replace with the actual value if available
                        country,
                        organization_id: branchId,
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
                        organization_id: branchId,
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
                        organization_id: branchId,
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
                        owner_id: branchId,
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
             res.redirect(`/branches/details?branchId=${branchId}`);
            }
             
         else
             {
                await req.db.execute("ROLLBACK");
                await req.db.execute(" INSERT INTO LOGS (TIMESTAMP_COL, LOG_MESSAGE, TYPE, ACTION, OUTCOME) VALUES (CURRENT_TIMESTAMP, 'BRANCH ' || :name || ' INSERT FAILED', 'ORGANIZATION', 'INSERT', 'FAILED')", { name });
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
            await req.db.execute(" INSERT INTO LOGS (TIMESTAMP_COL, LOG_MESSAGE, TYPE, ACTION, OUTCOME) VALUES (CURRENT_TIMESTAMP, 'BRANCH ' || :name || ' INSERT FAILED', 'ORGANIZATION', 'INSERT', 'FAILED')", { name });
            await req.db.execute("COMMIT");

            // Send an error response
            res.status(500).send(message);
        } 
    } catch (error) {
        console.error(error);
        // Send an error response
    }
});


module.exports=branchRoute;