import express from 'express';
import {getAllClubsForHomePage,getClubById,addViews,likeClub,addReview,deleteReview } from '../controllers/clubs.controllers.js';
//import upload from '../middlewares/upload.js';
import protectRoute from '../middlewares/protectedRoute.js';
const router = express.Router();


router.get("/",getAllClubsForHomePage);
router.get("/:id",getClubById); 
//router.create("/",upload.array("media",10),createClub);

// A voir wach ndirou protectedRoute or not 
router.post("/like/:id",protectRoute,likeClub);
router.post("/views/:id",protectRoute,addViews);
router.post("/reviews/:id",protectRoute,addReview);
router.delete("/reviews/:id",protectRoute,deleteReview);
export default router;