import dotenv from 'dotenv';
import pool from '../db/connectDB.js';
import {generateJWTAdmin } from "../utils/generateJWTToken.js";
import bcrypt from 'bcryptjs';
export const signUpAdmin = async (req,res)=>{
    try {
        const {full_name,email,password,role}=req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if(!full_name || !password || !email){
            return res.status(400).json({message:"Please provide full name and email"});
        } 
        if (!emailRegex.test(email)) {
             return res.status(400).json({ error: "Invalid email format" });
         }
        if (!passwordRegex.test(password)) {
          return res.status(400).json({ error: "Invalid password format, it must be at least 8 characters long and contain at least one letter and one number." });
             }
        // Check if the user exists
        const [rows]=await pool.query('SELECT * FROM admins WHERE email=?',[email]);
        if(rows.length > 0){
            return res.status(409).json({message:"Admin already exists"});
        }  

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert the new user into the database
        const [result]=await pool.query('INSERT INTO admins (full_name,email,password,role) VALUES (?,?,?,?)',
        [full_name,email,hashedPassword,role || 'admin']);
        
        // Create a JWT token
            generateJWTAdmin(result.insertId, res);
             res.status(201).json({
               message: "Admin created successfully",
               user: {
               adminId: result.insertId,
               fullname: full_name,
                email: email,
                role: role || 'admin'
                    },
               });
    }
    catch (err) {
    console.error("SignUp:", err.message);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: "An admin with this email already exists." });
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
export const logAsAdmin = async (req,res)=>{
    try {
        const {email,password}=req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if(!password || !email){
            return res.status(400).json({
              success:false,
              message:"Please provide full name and email"});
        } 
        if (!emailRegex.test(email)) {
             return res.status(400).json({ 
              success:false,
              message: "Invalid email format" });
         }
         if (!passwordRegex.test(password)) {
          return res.status(400).json({ 
            success:false,
            message: "Invalid password format, it must be at least 8 characters long and contain at least one letter and one number." });
             }
        // Check if the user exists
        const [rows]=await pool.query('SELECT * FROM admins WHERE email=?',[email]);
        if(rows.length === 0){
            return res.status(404).json({
              success:false,
              message:"Admin not found"});
        }  

        const admin = rows[0];
        // Create a JWT token
         const isMatching = await bcrypt.compare(password, admin.password);
            if (!isMatching) {
              return res.status(401).json({ 
                success: false,
                message: "Invalid password" });
            }
        
            generateJWTAdmin(admin.admin_id, res);
             res.status(200).json({
              success:true,
               message: "LoggedIn successfully as admin",
               user: {
               adminId: admin.admin_id,
               fullname: admin.full_name,
                email: admin.email,
                role: admin.role
                  },
               });
    }
    catch (err) {
    console.error("LogIn:", err.message);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        success:false,
        message: "An admin with this email already exists." });
    }
    res.status(500).json({ 
      success:false,
      message: "Internal server error" });
  }
} 

export const logOutAdmin = (req, res) => {
  try {
    res.clearCookie("token_admin", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? 'none' : "strict",
      maxAge: 7 * 24 * 60 * 1000,
    })
    return res.json({ 
      success:true,
      message: "Logged Out Successfully" });
  } catch (err) {
    console.error("LogOut error:", err.message);
    res.status(500).json({ 
      success:false,
      message: "Internal server error" });
  }
};  


export const getStatistics = async(req,res)=>{
   try { 
    const admin_id = req.admin.admin_id;
    // Now let's get aggregated statistics for this admin across all their clubs
    const [rows] = await pool.query(
      `SELECT 
          a.admin_id,
          a.full_name,
          COUNT(DISTINCT cl.club_id) AS total_clubs,
          COALESCE(SUM(cl.views), 0) AS total_views,
          COALESCE(SUM(cl.likes), 0) AS total_likes,
          COALESCE(COUNT(DISTINCT r.user_id), 0) AS total_reviews
       FROM admins a
       LEFT JOIN clubs cl ON a.admin_id = cl.admin_id
       LEFT JOIN reviews r ON cl.club_id = r.club_id
       WHERE a.admin_id = ?
       GROUP BY a.admin_id, a.full_name`, [admin_id]
    );

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error("Error fetching admin stats:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}
