const express=require('express');
const oracledb=require('oracledb');
const supplierRoute=require("../route/supplier.js");
const app=express();
app.set("view engine","ejs");
const port=3000;
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

//Basically, global akta connection object rakhsi, jokhon "get" call hoy, tokhon middleware "use" age check kore je connection load 
//korse kina, na korle load kore fale, tarpor ei global connection object bibhinno file e send kora jabe

let connection;

const mypw="123testermyfoot";

async function connectToDatabase() {
  try {
    connection = await oracledb.getConnection({
      user: 'testdb1231996',
      password: mypw,
      connectString: 'localhost/ORCL'
    });

    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    throw error;
  }
}

app.use(async (req, res, next) => {      
  try {                                  
    // Check if the database connection exists; if not, establish it
    if (!connection) {
      await connectToDatabase();
    }

    next();
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

app.get('/', async (req, res) => {

  const result=await qResult(connection,'SELECT * FROM SUPPLIERS');    //query arektu easier korar jonno qResult akta function banay dekhsilam
  console.log(result.rows);                                            // But eita na dileo hoy, khub beshi simplify kore na
  
  res.render("home.ejs",{dbConnection: connection}); //eikhane aar connection object send kora lagbe na, just query result deyar lagbe
 
});

app.use("/supplier", (req, res, next) => {
  // Pass the connection object to the supplierRouter middleware
  req.db = connection;
  next();
},supplierRoute);    // handover supplier route

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });

  async function qResult(db,query){
    try {

      console.log("Inside query function");
    const result = await db.execute(query);
    return result;

  } catch (error) {
    console.error('Error executing query:', error.message);
  }
}


/* try {       //This was inside app.get
    // Access the database connection from the request object
    const connection = req.db;

    // Example query using the connection
    const result = await connection.execute('SELECT * FROM SUPPLIERS');

    // Process the query result as needed
   console.log(result.rows);
   console.log(connection.username);

  
    /* const rows = result.rows;

    res.json(rows);
  } catch (error) {
    console.error('Error executing query:', error.message);
    res.status(500).send('Internal Server Error');
  }*/