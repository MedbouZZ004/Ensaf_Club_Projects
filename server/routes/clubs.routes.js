import express from 'express';
import {getAllClubs,getClubById,likeClub,addViews} from '../controllers/clubs.controllers.js';


const router = express.Router();


router.get("/",getAllClubs);
router.get("/:id",getClubById);
router.put("/like/:id",likeClub);
router.put("/views/:id",addViews);
export default router;