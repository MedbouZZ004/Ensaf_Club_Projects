import expres from 'express'
import dotenv from 'dotenv';
import './db/connectDB.js'
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import clubsRoutes from './routes/clubs.routes.js';
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
server.use("/api/user",userRoutes);
server.use("/api/clubs",clubsRoutes);

server.listen(PORT , ()=>{
    console.log(`Listen at ${PORT}`);
})