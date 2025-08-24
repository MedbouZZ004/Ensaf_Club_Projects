import express from 'express'
import dotenv from 'dotenv';
import './db/connectDB.js'
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import clubsRoutes from './routes/clubs.routes.js';
import formRoutes from './routes/form.routes.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';


dotenv.config();
const PORT = process.env.PORT || 1000;
const server = express();
server.use(cors({
    origin:['http://localhost:5173'],
    credentials:true
}))
server.use(cookieParser());
server.use(express.json());
// Make the uploads folder accessible via HTTP
server.use(
  "/uploads",
  express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), "uploads"))
);

server.use('/api/auth',authRoutes);
server.use("/api/user",userRoutes);
server.use("/api/clubs",clubsRoutes);
server.use("/api/form",formRoutes);

server.listen(PORT , ()=>{
    console.log(`Listen at ${PORT}`);
})