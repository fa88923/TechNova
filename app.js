const express = require('express');
const oracledb= require('oracledb');
const app = express();
const port = 3000;

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

app.set('view engine', 'ejs');
app.use(express.static('public'));


//oracle db connection details
const dbConfig = {
    user: 'hr',
    password: 'hr',
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
            `SELECT manager_id,department_id,department_name
            FROM departments`
        );

        //close the connection
        await connection.close();
        console.log(result.rows);
        res.render('supplier',{'suppliers':result.rows});
        //console.log(result.rows);
    }catch(error){
        console.error('error fetching',error);
        res.status(500).send('Internal server error');
    }
    
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

