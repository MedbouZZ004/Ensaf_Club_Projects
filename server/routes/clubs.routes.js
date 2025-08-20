import express from 'express';
import {getAllClubs,getClubById,likeClub,addViews} from '../controllers/clubs.controllers.js';

import protectRoute from '../middlewares/protectedRoute.js';
const router = express.Router();


router.get("/",getAllClubs);
router.get("/:id",getClubById);
router.put("/like/:id",protectRoute,likeClub);
router.put("/views/:id",addViews);
export default router;