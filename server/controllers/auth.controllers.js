import pool from "../db/connectDB.js";
import bcrypt from 'bcryptjs';
import {generateVerificationCode} from '../utils/generateVerificationCode.js';
import { generateJwtToken } from "../utils/generateJWTToken.js";
import transporter from "../config/nodemailer.config.js";
import {VERIFICATION_EMAIL_TEMPLATE,RESETING_PASSWORD_OTP} from '../utils/emailTemplates.js';
export const SignUpFct = async (req, res) => {
  const { email, password, fullname , major } = req.body;
  const emailRegex= /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
  if (!email || !password || !fullname || !major) {
    return res.status(400).json({ error: "Please provide all fields" });
  }
  if(!emailRegex.test(email)){
    return res.status(400).json({error:"Invalid email format"});
} 

  try {
    const userAlreadyExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userAlreadyExists.rowCount > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    /*const verificationToken = generateVerificationCode();
    const verificationTokenExpireAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours*/

    const result = await pool.query(
      'INSERT INTO users (email, password, full_name , major) VALUES ($1, $2, $3,$4) RETURNING user_id, email, full_name,major',
      [email, hashedPassword, fullname , major]
    );

    const newUser = result.rows[0];

    // Assuming this function generates and sets a JWT cookie
    generateJwtToken(newUser.user_id, res); 

    //sending welcome email
    const  mailOptions = {
      from : process.env.SENDER_EMAIL,
      to: email,
      subject : 'Welcome to ENSAF CLUBS',
      text : `Welcome to ENSAF CLUBS , Your account has been created whith email ${email}`
    };
  await transporter.sendMail(mailOptions);
    res.status(201).json({
      message: "User created successfully. .",
      user: {
        userId: newUser.user_id,
        email: newUser.email,
        fullname: newUser.full_name,
        major:newUser.major
      },
    });
    

  } catch (err) {
    console.error("Signup error:", err.message);
    // You might want to check for specific error codes here, e.g., unique constraint violation
    if (err.code === '23505') { // PostgreSQL unique constraint violation error code
        return res.status(400).json({ message: "A user with this email already exists." });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const LogInFct = async (req,res)=>{
  const {email, password}=req.body;
  const emailRegex= /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
  if (!email || !password ) {
    return res.status(400).json({ error: "Please provide all fields" });
  } 
   if(!emailRegex.test(email)){
    return res.status(400).json({error:"Invalid email format"});
} 
  try {
  const user = await pool.query('SELECT * FROM users WHERE email=$1',[email]);
  if(user.rowCount==0){
    return res.status(404).json({ error: "User Not found " });
  } 
  const isMatching = await bcrypt.compare(password,user.rows[0].password);
  if(!isMatching){
     return res.status(401).json({ error: "Invalid password" });
  } 
  generateJwtToken(user.rows[0].user_id , res);
  res.status(200).json(
    {message:"LoggedIn succesfuy", 
    user :{
    userId: user.rows[0].user_id,
    fullname : user.rows[0].full_name,
    email : user.rows[0].email ,
    major:user.rows[0].major
  },}
);
  }catch(err){
  console.error("LogIn error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const LogOutFct = async (req,res)=>{
  try {
   res.clearCookie("token",{
        httpOnly:true,
        secure : process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? 'none':"strict",
        maxAge:7*24*60*1000,
   }) 
   return res.json({message:"LoggedOut :c "});
  }catch(err){
     console.error("LogOut error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
}; 
//hadi send it 
export const SendverifyEmail = async (req,res)=>{ 
  const userId = req.user?.user_id;
  try {
    const user = await pool.query('SELECT * FROM users WHERE user_id=$1',[userId]);
    if(user.rowCount==0){
      return res.status(404).json({message:"User not found"});
    }
    if(user.rows[0].isaccountverified  ){
      return res.json({message:"Account already verified"});
    }  
    // Generate verifyOtp token 
    const OtpToken = generateVerificationCode();
    const verificationTokenExpireAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
   await pool.query('UPDATE users SET verifyotp = $1, verifyotpexpireat = $2 WHERE user_id = $3', [OtpToken, verificationTokenExpireAt, userId]);
     const  mailOptions = {
      from : process.env.SENDER_EMAIL,
      to: user.rows[0].email,
      subject : 'Account verification OTP',
      text : VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", OtpToken)
    };
  await transporter.sendMail(mailOptions);
    res.json({
      message: "Verification Otp sent .",
    });


  }catch(err){
   console.error("SEND EMAIL  VERIFY error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
} 

export const verifyEmail = async (req,res)=>{
  const { otp }=req.body;
  const userId = req.user?.user_id;
  if(!otp || !userId){
    return res.status(400).json({ error: "Please provide all fields" });
  } 
  try {
     const user = await pool.query('SELECT * FROM users WHERE user_id=$1',[userId]);
     if(user.rowCount === 0){
      return res.status(404).json({error:"User not found"});
     } 
     const storedOtp = user.rows[0].verifyotp;
     if(!storedOtp || storedOtp !== otp){
      return res.status(400).json({error:"Invalid OTP"});
     } 
     const expirationDate = new Date(user.rows[0].verifyotpexpireat);
     expirationDate.setHours(23, 59, 59, 999);
     if(expirationDate < new Date()){
        return res.status(400).json({error:"OTP expired"});
     } 
     await pool.query('UPDATE users SET isaccountverified = $1, verifyotp = $2, verifyotpexpireat = $3 WHERE user_id = $4', [true, null, null, userId]);

      return res.status(200).json({message:"Email verified :)"});
  }catch(err){
    console.error("VERIFY EMAIL error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
} 

//once the midlleware is exectuted this controller is called
export const isAuthenticated = async (req,res)=>{
  try{
   return res.json({message:"user is authenticated"});
  }catch(err){
    console.error("isAUthenticated error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
}  

//send password reset OTP  
export const sendResetOtp = async (req,res)=>{
  const {email}=req.body;
  if(!email){
    return res.status(401).json({message:"Please fill all fields"});
  }
  try {
   const user = await pool.query('SELECT * FROM users WHERE email=$1',[email]);
   if(user.rowCount==0){
    return res.status(404).json({message:"User not found"}); 
   }  
    const OtpResetToken = generateVerificationCode();
    const ResetTokenExpireAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await pool.query('UPDATE users SET resetotp = $1,  resetotpexpireat = $2 WHERE email = $3', [OtpResetToken, ResetTokenExpireAt, email]);

     const  mailOptions = {
      from : process.env.SENDER_EMAIL,
      to: email,
      subject : 'Password Reset Otp',
      text : RESETING_PASSWORD_OTP.replace("{verificationCode}", OtpResetToken)
    };
  await transporter.sendMail(mailOptions);
    res.json({
      message: "Reset  Otp sent .",
    });
  }catch(err){
    console.error("SEND RESET OTP    error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
} 

export const resetPassword = async (req,res)=>{
  const {email , otp , newPassword}=req.body;
  if(!email || !otp || !newPassword){
    return res.status(400).json({message:"Please enter all fields"})
  } 

  try {
    const user = await pool.query('SELECT * FROM users WHERE email=$1',[email]);
    if(user.rows.length === 0){ // It's better to check for the row count
      return res.status(404).json({message:"User not found"});
    } 
    
    const userData = user.rows[0];

    if(userData.resetotp === "" || userData.resetotp !== otp){
      return res.status(400).json({error:"Invalid OTP"});
    } 
    
    const expirationDate = new Date(userData.resetotpexpireat);
    // There is no need to set the time again if it's already a timestamp from the database. Just compare the dates directly.
    if(expirationDate < new Date()){
      return res.status(400).json({error:"OTP expired"});
    } 

    const hashedNewPassword = await bcrypt.hash(newPassword,10);

    // Corrected UPDATE query with SET and WHERE clauses
    await pool.query('UPDATE users SET password=$1 , resetotpexpireat=$2 , resetotp=$3 WHERE email=$4',[hashedNewPassword, null, null, email]);
    
    return res.status(200).json({message:"Password reseted succesfuly :)"});
  } catch(err){
    console.error("RESET PASSWORD error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
}