const express=require("express");
const branchRoute=express.Router();


branchRoute.get("/", async (req, res) => {
   

    try {
        let branches;
        const searchkey=req.query.searchkey;
        //category wise filtering
        
         if (searchkey) {
            const searchPattern = `%${searchkey.toUpperCase()}%`;
        
            branches = await req.db.execute(
                `SELECT B.BRANCH_ID, O.NAME, B.MANAGER, STREET_ADDRESS||', '||CITY||'-'||POSTAL_CODE BRANCH_ADDRESS FROM
                ORGANIZATIONS O JOIN BRANCHES B ON (O.ORGANIZATION_ID=B.BRANCH_ID)
                LEFT OUTER JOIN LOCATIONS L ON (O.ADDRESS=L.LOCATION_ID)
                WHERE UPPER(NAME) LIKE :searchPattern OR UPPER(STREET_ADDRESS) LIKE :searchPattern 
                OR UPPER(CITY) LIKE :searchPattern
                OR UPPER(COUNTRY) LIKE :searchPattern OR UPPER(MANAGER) LIKE :searchPattern
                ORDER BY O.ORGANIZATION_ID`, { searchPattern }
            );
        }

        else
            {
                branches = await req.db.execute(
                `SELECT B.BRANCH_ID, O.NAME, B.MANAGER, STREET_ADDRESS||', '||CITY||'-'||POSTAL_CODE BRANCH_ADDRESS FROM
                ORGANIZATIONS O JOIN BRANCHES B ON (O.ORGANIZATION_ID=B.BRANCH_ID)
                LEFT OUTER JOIN LOCATIONS L ON (O.ADDRESS=L.LOCATION_ID)
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
        'SELECT B.BRANCH_ID, O.NAME, B.MANAGER,STREET_ADDRESS||\', \'||CITY||\'-\'||POSTAL_CODE ADDRESS,B.SQUARE_FOOTAGE,B.AVG_SHIPPING_DURATION,P.ACCOUNT_NUMBER,P.ACCOUNT_HOLDER,P.BANK_NAME,P.IBAN FROM ORGANIZATIONS O JOIN BRANCHES B ON (O.ORGANIZATION_ID=B.BRANCH_ID) LEFT OUTER JOIN LOCATIONS L ON (O.ADDRESS=L.LOCATION_ID) LEFT OUTER JOIN PAYMENT_INFO P ON (B.BRANCH_ID=P.OWNER_ID) WHERE B.BRANCH_ID=:branchId ORDER BY B.BRANCH_ID',
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

    /*const branchIncome = await req.db.execute(
        'SELECT * FROM BRANCH_INCOME_STATEMENT WHERE BRANCH_ID=:branchId;',
        [branchId]
        // Use bind variables to prevent SQL injection
    );*/

    res.render('./branches/details', { 'branchinfo': branchinfo.rows, 'phone_numbers':branchphone.rows, 'emails':branchmail.rows });
})


module.exports=branchRoute;