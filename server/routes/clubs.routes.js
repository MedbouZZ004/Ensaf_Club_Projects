import express from 'express';
import {getAllClubsForHomePage,getClubById,deleteClub,addViews,likeClub,addReview,deleteReview, submitForm ,addClub } from '../controllers/clubs.controllers.js';
import upload from '../middlewares/upload.js';
import protectRoute from '../middlewares/protectedRoute.js';
import attachUserIfAny from '../middlewares/attachUserIfAny.js';
import { formLimiter } from '../middlewares/rateLimiter.js';
import protectedAdminRoute from '../middlewares/protectedAdmin.js';
const router = express.Router();


router.get("/", attachUserIfAny, getAllClubsForHomePage);
router.get("/:id", attachUserIfAny, getClubById); 
//router.create("/",upload.array("media",10),createClub);

// A voir wach ndirou protectedRoute or not 
router.post("/like/:id",protectRoute,likeClub);
router.post("/views/:id",protectRoute,addViews);
router.post("/reviews/:id",protectRoute,addReview);
router.delete("/reviews/:id",protectRoute,deleteReview);
router.post('/message', protectRoute, formLimiter, submitForm);
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
export default router;