//import { Pool } from 'pg';
import dotenv from 'dotenv';
import mysql from "mysql2/promise";
dotenv.config();
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  database: process.env.MYSQL_DB,
  user: process.env.MYSQL_USER,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
pool.getConnection().then(()=>{
   console.log('Connected to mysql successfully');
}).catch(err=>{
  console.error('Connection error', err.stack);
})

export default pool;