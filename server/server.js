import expres from 'express'
import dotenv from 'dotenv';
import './db/connectDB.js'
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
dotenv.config();
const PORT = process.env.PORT || 1000;
const server = expres();
server.use(cors({
    Credential:true
}))
server.use(cookieParser());
server.use(expres.json());


server.use('/api/auth',authRoutes);



server.listen(PORT , ()=>{
    console.log(`Listen at ${PORT}`);
})