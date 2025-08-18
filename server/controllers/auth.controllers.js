import pool from "../db/connectDB.js";
import bcrypt from 'bcryptjs';
import { generateVerificationCode } from '../utils/generateVerificationCode.js';
import { generateJwtToken } from "../utils/generateJWTToken.js";
import transporter from "../config/nodemailer.config.js";
import { VERIFICATION_EMAIL_TEMPLATE, RESETING_PASSWORD_OTP } from '../utils/emailTemplates.js';
import dotenv from 'dotenv';
dotenv.config();
/*** */

// ---------------- SIGN UP ----------------
export const SignUpFct = async (req, res) => {
  const { email, password, fullname, major } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !password || !fullname || !major) {
    return res.status(400).json({ error: "Please provide all fields" });
  }
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    const [userAlreadyExists] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (userAlreadyExists.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (email, password, full_name, major) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, fullname, major]
    );

    const newUser = {
      user_id: result.insertId,
      email,
      full_name: fullname,
      major
    };

    generateJwtToken(newUser.user_id, res);

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Welcome to ENSAF CLUBS',
      text: `Welcome to ENSAF CLUBS , Your account has been created with email ${email}`
    };
    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "User created successfully.",
      user: {
        userId: newUser.user_id,
        email: newUser.email,
        fullname: newUser.full_name,
        major: newUser.major
      },
    });

  } catch (err) {
    console.error("Signup error:", err.message);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: "A user with this email already exists." });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------------- LOGIN ----------------
export const LogInFct = async (req, res) => {
  const { email, password } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !password) {
    return res.status(400).json({ error: "Please provide all fields" });
  }
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "User Not found" });
    }
    const user = rows[0];

    const isMatching = await bcrypt.compare(password, user.password);
    if (!isMatching) {
      return res.status(401).json({ error: "Invalid password" });
    }

    generateJwtToken(user.user_id, res);
    res.status(200).json({
      message: "LoggedIn successfully",
      user: {
        userId: user.user_id,
        fullname: user.full_name,
        email: user.email,
        major: user.major
      },
    });
  } catch (err) {
    console.error("LogIn error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------------- LOGOUT ----------------
export const LogOutFct = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? 'none' : "strict",
      maxAge: 7 * 24 * 60 * 1000,
    })
    return res.json({ message: "LoggedOut :c " });
  } catch (err) {
    console.error("LogOut error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------------- SEND VERIFY EMAIL ----------------
export const SendverifyEmail = async (req, res) => {
  const userId = req.user?.user_id;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = rows[0];
    if (user.isaccountverified) {
      return res.json({ message: "Account already verified" });
    }

    const OtpToken = generateVerificationCode();
    const verificationTokenExpireAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    //const verificationTokenExpireAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    //const verificationTokenExpireAt = new Date(Date.now() + 24 * 60 * 60 * 1000)


    await pool.query(
  'UPDATE users SET verifyotp = ?  , verifyotpexpireat = ?  WHERE user_id = ?',
  [OtpToken, verificationTokenExpireAt, userId]
);

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Account verification OTP',
      text: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", OtpToken)
    };
    await transporter.sendMail(mailOptions);

    res.json({ message: "Verification Otp sent." });

  } catch (err) {
    console.error("SEND EMAIL VERIFY error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------------- VERIFY EMAIL ----------------
export const verifyEmail = async (req, res) => {
  const { otp } = req.body;
  const userId = req.user?.user_id;
  if (!otp || !userId) {
    return res.status(400).json({ error: "Please provide all fields" });
  }
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = rows[0];

    if (!user.verifyotp || user.verifyotp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    const expirationDate = new Date(user.verifyotpexpireat);
    if (expirationDate < new Date()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    await pool.query(
      'UPDATE users SET isaccountverified = ?, verifyotp = ?, verifyotpexpireat = ? WHERE user_id = ?',
      [true, null, null, userId]
    );

    return res.status(200).json({ message: "Email verified :)" });
  } catch (err) {
    console.error("VERIFY EMAIL error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------------- IS AUTHENTICATED ----------------
export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ message: "user is authenticated" });
  } catch (err) {
    console.error("isAuthenticated error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------------- SEND RESET OTP ----------------
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(401).json({ message: "Please fill all fields" });
  }
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const OtpResetToken = generateVerificationCode();
    const ResetTokenExpireAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await pool.query(
      'UPDATE users SET resetotp = ?, resetotpexpireat = ? WHERE email = ?',
      [OtpResetToken, ResetTokenExpireAt, email]
    );

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Password Reset Otp',
      text: RESETING_PASSWORD_OTP.replace("{verificationCode}", OtpResetToken)
    };
    await transporter.sendMail(mailOptions);

    res.json({ message: "Reset Otp sent." });
  } catch (err) {
    console.error("SEND RESET OTP error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------------- RESET PASSWORD ----------------
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: "Please enter all fields" })
  }

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = rows[0];

    if (!userData.resetotp || userData.resetotp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    const expirationDate = new Date(userData.resetotpexpireat);
    if (expirationDate < new Date()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      'UPDATE users SET password = ?, resetotpexpireat = ?, resetotp = ? WHERE email = ?',
      [hashedNewPassword, null, null, email]
    );

    return res.status(200).json({ message: "Password reset successfully :)" });
  } catch (err) {
    console.error("RESET PASSWORD error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
