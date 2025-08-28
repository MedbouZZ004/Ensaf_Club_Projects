import express from 'express';
import { logAsAdmin, logOutAdmin ,signUpAdmin,getStatistics} from '../controllers/admin.controllers.js';
import {protectedAdminRoute} from '../middlewares/protectedAdmin.js'

const router = express.Router();

router.post('/login', logAsAdmin);
router.post("/signUp",signUpAdmin)
router.post('/logout', logOutAdmin);
router.get("/stats",protectedAdminRoute,getStatistics);



export default router;