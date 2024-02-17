const express=require("express");
const transportRoute=express.Router();


transportRoute.get("/", async (req, res) => {
   

    try {
        let transports;
        const searchkey=req.query.searchkey;
        //category wise filtering
        
        if (searchkey) {
            const searchPattern = `%${searchkey.toUpperCase()}%`;
        
              transports = await req.db.execute(
                `SELECT T.COMPANY_ID, O.NAME, O.URL, STREET_ADDRESS||', '||CITY||'-'||POSTAL_CODE ADDRESS,T.CAPACITY FROM
                ORGANIZATIONS O JOIN TRANSPORT_COMPANIES T ON (O.ORGANIZATION_ID=T.COMPANY_ID)
                LEFT OUTER JOIN LOCATIONS L ON (O.ADDRESS=L.LOCATION_ID)
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
                LEFT OUTER JOIN LOCATIONS L ON (O.ADDRESS=L.LOCATION_ID)
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
    const clientId=parseInt(req.query.clientId);
    // Execute SQL query to search in the database
    const clientinfo = await req.db.execute(
        'SELECT C.CLIENT_ID, O.NAME, O.URL, C.TYPE,STREET_ADDRESS||\', \'||CITY||\'-\'||POSTAL_CODE ADDRESS,P.ACCOUNT_NUMBER,P.ACCOUNT_HOLDER,P.BANK_NAME,P.IBAN FROM ORGANIZATIONS O JOIN CLIENT_COMPANIES C ON (O.ORGANIZATION_ID=C.CLIENT_ID) LEFT OUTER JOIN LOCATIONS L ON (O.ADDRESS=L.LOCATION_ID)  LEFT OUTER JOIN PAYMENT_INFO P ON (C.CLIENT_ID=P.OWNER_ID) WHERE C.CLIENT_ID=:clientId ORDER BY O.ORGANIZATION_ID', [clientId] 
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



module.exports=transportRoute;