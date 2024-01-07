const express=require('express');
const oracledb=require('oracledb');
const app=express();
const port=3000;

const mypw="123testermyfoot";
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

  app.get('/',async (req,res)=>{
    const connection = await oracledb.getConnection ({
        user          : "testdb1231996",
        password      : mypw,
        connectString : "localhost/FREEPDB1"
    });

    const result=await connection.execute(
        'select * from suppliers',
    );

    console.log(result.rows);
    await connection.close();
  })

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });