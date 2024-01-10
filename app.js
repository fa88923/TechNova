const express = require('express');
const oracledb= require('oracledb');
const supplierRouter=require('./routeHandler/supplierRouter.js');   //path check koro
const app = express();
const port = 3000;

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

//thinks to handle, use function, link change in html

app.set('view engine', 'ejs');
app.use(express.static('public'));    //multiple users er conflict lagte pare

let connection;


//oracle db connection details
const dbConfig = {
    user: 'technova',
    password: '123',
    connectString: "localhost/ORCL",
};

async function connectToDatabase() {
    try {
      connection = await oracledb.getConnection(dbConfig);
  
      console.log('Connected to the database');
    } catch (error) {
      console.error('Error connecting to the database:', error.message);
      throw error;
    }
  }

  app.use(async (req, res, next) => {        //ei functionta ager express.staticer okhane pass in kore deyar lagte pare   
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

  app.use("/supplier", (req, res, next) => {
    // Pass the connection object to the supplierRouter middleware
    req.db = connection;
    next();
  },supplierRouter);    // handover supplier route
  
// Route for the home page
app.get('/', (req, res) => {
    res.render('home');
});

app.use("/supplier", (req, res, next) => {
    // Pass the connection object to the supplierRouter middleware
    req.db = connection;
    next();
  },supplierRouter);    // handover supplier route

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

