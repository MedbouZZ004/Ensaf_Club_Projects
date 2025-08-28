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

server.listen(PORT , ()=>{
    console.log(`Listen at ${PORT}`);
})