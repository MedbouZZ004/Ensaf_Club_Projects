import express from 'express';
import { logAsAdmin, logOutAdmin ,signUpAdmin,getStatistics, getAdminProfile, updateAdminProfile } from '../controllers/admin.controllers.js';
import {protectedAdminRoute} from '../middlewares/protectedAdmin.js'

const router = express.Router();

router.post('/login', logAsAdmin);
router.post("/signUp",signUpAdmin)
router.post('/logout', logOutAdmin);
router.get("/stats",protectedAdminRoute,getStatistics);
router.get('/profile', protectedAdminRoute, getAdminProfile);
router.put('/profile', protectedAdminRoute, updateAdminProfile);




export default router;