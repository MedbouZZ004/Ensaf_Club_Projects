import express from 'express'
import dotenv from 'dotenv';
import './db/connectDB.js'
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import clubsRoutes from './routes/clubs.routes.js';
import adminRouter from './routes/admin.routes.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import globalLimiter from './middlewares/rateLimiter.js';
import pool from './db/connectDB.js';


dotenv.config();
const PORT = process.env.PORT || 1000;
const server = express();
server.use(cors({
    origin:['http://localhost:5173'],
    credentials:true
}))
server.use(cookieParser());
server.use(express.json());
// Apply a gentle global rate limiter
server.use(globalLimiter);
// Make the uploads folder accessible via HTTP
server.use(
  "/uploads",
  express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), "uploads"))
);

server.use('/api/auth',authRoutes);
server.use("/api/user",userRoutes);
server.use("/api/clubs",clubsRoutes);
server.use("/api/admin",adminRouter);


//TRACKING HOW MUHC USERS VISITED OUR SITE 
const getClientIP = (req) => {
  let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  return ip.replace("::ffff:", ""); //  IPv4 format
};

// Track Unique Visitors
server.get("/api/visits", (req, res) => {
  const ip = getClientIP(req);
  const insertQuery = "INSERT IGNORE INTO visitors (ip_address) VALUES (?)";
  pool.query(insertQuery, [ip], (err) => {
    if (err) {
      console.error("Error inserting IP:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // Count total unique visitors
    const countQuery = "SELECT COUNT(*) AS total FROM visitors";
    pool.query(countQuery, (err, results) => {
      if (err) {
        console.error("Error fetching count:", err);
        return res.status(500).json({ message: "Database error" });
      }

      res.json({ totalVisitors: results[0].total });
    });
  });
});


server.listen(PORT , ()=>{
    console.log(`Listen at ${PORT}`);
})