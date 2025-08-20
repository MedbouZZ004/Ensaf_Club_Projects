  
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const generateJwtToken = (user_id,res)=>{
    const token = jwt.sign ({user_id},process.env.JWT_SECRET,{
        expiresIn:"7d",
    });
    res.cookie("token",token,{
        httpOnly:true,
        secure : process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? 'none':"strict",
        maxAge:7*24*60*1000,
        path: "/"
    });
    return token;
}