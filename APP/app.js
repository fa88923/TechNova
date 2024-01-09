const express=require('express');
const oracledb=require('oracledb');
const app=express();
app.set("view engine","ejs");
const port=3000;

const sender={};

const mypw="123testermyfoot";
async function con()
{
     const c= sender.connection = await oracledb.getConnection ({
      user          : "testdb1231996",
      password      : mypw,
      connectString : "localhost/ORCL"
  });

  const result= c.execute("SELECT * FROM SUPPLIERS");
  console.log(result.rows);
}

async function term()
{
  await sender.connection.close();
}
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

  app.get('/',async (req,res)=>{
    res.render("home");
  })
   
  con();
  
  app.use(express.static("../route",{
    setHeaders: (res, path) => {
      if (path.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
      }
    }
  }));
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });