import express from 'express';
import {getAllClubsForHomePage,getClubById,addActivity,updateActivity,deleteClub,addViews,likeClub,getClubActivities,deleteAnActivity,deleteAnBoardMember, getClubBoardMembers,addReview,deleteReview, submitForm ,addClub, updateBoardMember, updateClub, getClubStatistics} from '../controllers/clubs.controllers.js';
import upload from '../middlewares/upload.js';
import protectRoute from '../middlewares/protectedRoute.js';
import attachUserIfAny from '../middlewares/attachUserIfAny.js';
import { formLimiter } from '../middlewares/rateLimiter.js';
import protectedAdminRoute from '../middlewares/protectedAdmin.js';
const router = express.Router();


router.get("/", attachUserIfAny, getAllClubsForHomePage);
// More specific GET routes must come before the dynamic '/:id' route
router.get("/activities", protectedAdminRoute, getClubActivities);
router.get("/boardMembers", protectedAdminRoute, getClubBoardMembers); 
// Admin-scoped statistics (uses req.admin)
router.get('/stats', protectedAdminRoute, getClubStatistics);
router.delete("/activities/:id",protectedAdminRoute,deleteAnActivity);
router.delete("/boardMembers/:id",protectedAdminRoute,deleteAnBoardMember);
router.post('/activity', protectedAdminRoute, upload.any(), addActivity);
router.put('/activities/:id', protectedAdminRoute, upload.any(), updateActivity);
// Create a board member
import { addBoardMember } from '../controllers/clubs.controllers.js';
router.post('/boardMembers', protectedAdminRoute, upload.any(), addBoardMember);
router.put('/boardMembers/:id', protectedAdminRoute, upload.any(), updateBoardMember);


// A voir wach ndirou protectedRoute or not
router.post("/like/:id",protectRoute,likeClub);
router.post("/views/:id",protectRoute,addViews);
router.post("/reviews/:id",protectRoute,addReview);
router.delete("/reviews/:id",protectRoute,deleteReview);
router.post('/message', protectRoute, formLimiter, submitForm);
// Dynamic GET by id should be after specific GET routes
router.get("/:id", attachUserIfAny, getClubById);
router.delete('/:id', protectedAdminRoute, deleteClub);
router.post(
	"/",
	protectedAdminRoute,
	upload.fields([
		{ name: 'clubLogo', maxCount: 1 },
		{ name: 'clubMainImages', maxCount: 10 },
		{ name: 'clubVideo', maxCount: 1 }
	]),
	addClub
);

router.put(
	"/:id",
	protectedAdminRoute,
	upload.fields([
		{ name: 'clubLogo', maxCount: 1 },
		{ name: 'clubMainImages', maxCount: 10 },
		{ name: 'clubVideo', maxCount: 1 }
	]),
	updateClub
);


export default router;