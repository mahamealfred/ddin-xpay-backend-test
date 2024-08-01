const mysql =require("mysql2/promise");
const dotenv =require("dotenv");
dotenv.config()

const host = process.env.HOST;
const username=process.env.DB_USER;
const password=process.env.DB_PASS;
const db_name=process.env.DB_NAME;
const db_port=process.env.DB_PORT;

    const dbConnect=  mysql.createPool({
      connectionLimit: 10,
      connectionTimeout: 30000,
      host: host,
      user: username,
      port:db_port,
      password:password,
      database:db_name
      
    });
    dbConnect.getConnection(function (err, connection) {
      if (err) {
          console.log("Connection Error:",err);
      } else {
        console.log("connected to Database.")
        connection.release();
        return connection;
   
      }
      });
   
//  };
  module.exports= dbConnect; 