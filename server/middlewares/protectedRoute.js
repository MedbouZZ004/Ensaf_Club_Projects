import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import pool from "../db/connectDB.js";

export const protectRoute = async (req, res, next) => {
  try {
    // Récupérer le token depuis le cookie 
    // console.log('Cookies:', req.cookies); // ✅ pour debug
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided, please login again..." });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // MySQL query with ? placeholder instead of $1
    const [rows] = await pool.query(
      `SELECT user_id, full_name, email, major
       FROM users
       WHERE user_id = ?`,
      [decoded.user_id]
    );

    // Check if user exists (MySQL returns empty array if no results)
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Injecter l'utilisateur dans la requête
    req.user = rows[0];
    next();
  } catch (err) {
    console.error(`Error -> ${err.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default protectRoute;