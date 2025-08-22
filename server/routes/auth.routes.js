import express from 'express';
import { SignUpFct,LogInFct,LogOutFct,SendverifyEmail,verifyEmail,isAuthenticated,sendResetOtp,resetPassword} from '../controllers/auth.controllers.js';
import protectRoute from '../middlewares/protectedRoute.js';
const router = express.Router();

router.post("/signUp",SignUpFct);
router.post("/logIn",LogInFct);
router.post("/logOut",LogOutFct);
// router.post("/send-verify-otp",protectRoute,SendverifyEmail);
// router.post("/verify-account",protectRoute,verifyEmail); 
router.post("/is-auth",protectRoute,isAuthenticated); //?
router.post("/send-reset-otp",sendResetOtp ); // ?
router.post("/reset-password",resetPassword); // reset password form.
export default router;