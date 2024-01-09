const express = require('express');
const oracledb= require('oracledb');
const app = express();
const port = 3000;

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

app.set('view engine', 'ejs');
app.use(express.static('public'));


//oracle db connection details
const dbConfig = {
    user: 'technova',
    password: '123',
    connectString: "localhost/ORCL",
};

// Route for the home page
app.get('/', (req, res) => {
    res.render('home');
});

// Route for the supplier page
app.get('/supplier', async(req, res) => {
  // Fetch and pass supplier data to the view 
    try{
        const connection= await oracledb.getConnection(dbConfig);
        //exexute sql query to get supplier info
        const result=await connection.execute(
            `SELECT supplier_id,name,city,country,email
            FROM suppliers`
        );

        //close the connection
        await connection.close();
        res.render('supplier',{'suppliers':result.rows});
    }catch(error){
        console.error('error fetching',error);
        res.status(500).send('Internal server error');
    }
    
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

