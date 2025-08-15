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
      return res.status(401).json({ message: "Unauthorized: No token" });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }


    const result = await pool.query(
      `SELECT user_id, full_name , email,major
       FROM users
       WHERE user_id = $1`,
      [decoded.user_id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Injecter l'utilisateur dans la requête
    req.user = result.rows[0];
    next();
  } catch (err) {
    console.error(`Error -> ${err.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};
export default protectRoute;