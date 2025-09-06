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
server.use(express.urlencoded({ extended: true }));
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
server.use(async (req, res, next) => {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  // Check if today exists
  const [rows] = await pool.execute("SELECT * FROM visits WHERE visit_date = ?", [today]);

  if (rows.length > 0) {
    await pool.execute("UPDATE visits SET count = count + 1 WHERE visit_date = ?", [today]);
  } else {
    await pool.execute("INSERT INTO visits (visit_date, count) VALUES (?, ?)", [today, 1]);
  }

  next();
});

// Endpoint to get stats
server.get("/api/visits", async (req, res) => {
  const [rows] = await pool.execute("SELECT * FROM visits ORDER BY visit_date DESC");
  res.json(rows);
});


server.listen(PORT , ()=>{
    console.log(`Listen at ${PORT}`);
})