import jwt from 'jsonwebtoken';

// Soft-auth: attaches req.user if a valid token exists; does not error on missing/invalid
export default function attachUserIfAny(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) return next();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded && decoded.user_id) {
      req.user = { user_id: decoded.user_id };
    }
    return next();
  } catch (e) {
    // Ignore invalid token and continue as anonymous
    return next();
  }
}
