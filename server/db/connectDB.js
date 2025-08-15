import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USERNAME,
  port: process.env.PG_PORT,
  password: process.env.PG_PASSWORD
});

pool.connect()
  .then(() => {
    console.log('Connected to postgresql successfully');
  })
  .catch(err => {
    console.error('Connection error', err.stack);
  });

export default pool;