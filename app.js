const express = require('express');
const oracledb= require('oracledb');
const bodyParser = require('body-parser');

const supplierRouter=require('./routehandler/supplierRouter.js');
const productRouter=require('./routehandler/productRouter.js');
const branchRouter=require('./routehandler/branchRouter.js');
const clientRouter=require('./routehandler/clientRouter.js');
const transportRouter=require('./routehandler/transportRouter.js');
const app = express();
const port = 3000;

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

//for parsing the info from the form
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.set('view engine', 'ejs');
app.use(express.static('public')); 

//multiple users er conflict lagte pare

let connection;


//oracle db connection details
/*const dbConfig = {
    user: 'testdb1231996',
    password: '123testermyfoot',
    connectString: "localhost/ORCL",
};*/

const dbConfig = {
  user: 'technova',
  password: '123',
  connectString: "localhost/ORCL",
};

// const dbConfig = {
//   user: 'newtechnova',
//   password: '123',
//   connectString: "localhost/ORCL",
// };

async function connectToDatabase() {
    try {
      connection = await oracledb.getConnection(dbConfig);
  
      console.log('Connected to the database');
    } catch (error) {
      console.error('Error connecting to the database:', error.message);
      throw error;
    }
  }

  app.use(async (req, res, next) => {        
    //ei functionta ager express.staticer okhane pass in kore deyar lagte pare   
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

  
// Route for the home page
app.get('/', (req, res) => {
    res.render('home');
});
   
app.use("/suppliers", (req, res, next) => {
    // Pass the connection object to the supplierRouter middleware
    req.db = connection;
    next();
  },supplierRouter);    // handover supplier route

  app.use("/products", (req, res, next) => {
    // Pass the connection object to the supplierRouter middleware
    req.db = connection;
    next();
  },productRouter);    // handover supplier route

  app.use("/branches", (req, res, next) => {
    // Pass the connection object to the supplierRouter middleware
    req.db = connection;
    next();
  },branchRouter);    // handover supplier route*/

  app.use("/clients", (req, res, next) => {
    // Pass the connection object to the supplierRouter middleware
    req.db = connection;
    next();
  },clientRouter); 

  app.use("/transports", (req, res, next) => {
    // Pass the connection object to the supplierRouter middleware
    req.db = connection;
    next();
  },transportRouter); 

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

