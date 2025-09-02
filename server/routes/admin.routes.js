import express from 'express';
import { logAsAdmin, logOutAdmin ,signUpAdmin,getStatistics,getClubActivities,getClubBoardMembers} from '../controllers/admin.controllers.js';
import {protectedAdminRoute} from '../middlewares/protectedAdmin.js'

const router = express.Router();

router.post('/login', logAsAdmin);
router.post("/signUp",signUpAdmin)
router.post('/logout', logOutAdmin);
router.get("/stats",protectedAdminRoute,getStatistics);
router.get("/activities",protectedAdminRoute,getClubActivities);
router.get("/boardMembers",protectedAdminRoute,getClubBoardMembers);


export default router;