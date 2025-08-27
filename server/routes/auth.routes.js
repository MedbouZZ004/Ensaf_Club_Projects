import express from 'express';
import { SignUpFct,LogInFct,LogOutFct,SendverifyEmail,verifyEmail,isAuthenticated,sendResetOtp,resetPassword} from '../controllers/auth.controllers.js';
import protectRoute from '../middlewares/protectedRoute.js';
import { authLimiter } from '../middlewares/rateLimiter.js';
const router = express.Router();

router.post("/signUp", authLimiter, SignUpFct);
router.post("/logIn", authLimiter, LogInFct);
router.post("/logOut",LogOutFct);
// router.post("/send-verify-otp",protectRoute,SendverifyEmail);
// router.post("/verify-account",protectRoute,verifyEmail); 
router.post("/is-auth",protectRoute,isAuthenticated); //?
router.post("/send-reset-otp",sendResetOtp ); // ?
router.post("/reset-password",resetPassword); // reset password form.
export default router;