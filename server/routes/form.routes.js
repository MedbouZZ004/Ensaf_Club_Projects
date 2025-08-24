import express from 'express';
import protectRoute from '../middlewares/protectedRoute.js';
import { submitForm } from '../controllers/form.controllers.js';
const router = express.Router();

router.post("/",protectRoute,submitForm);
export default router;