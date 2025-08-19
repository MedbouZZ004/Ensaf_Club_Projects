import express from 'express';
import protectRoute from '../middlewares/protectedRoute.js';
import {getUserProfil} from '../controllers/user.controller.js'
const router = express.Router();

router.get("/me",protectRoute,getUserProfil);
export default router;