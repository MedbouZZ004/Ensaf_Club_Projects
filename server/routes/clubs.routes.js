import express from 'express';
import {getAllClubs} from '../controllers/clubs.controllers.js';
const router = express.Router();

router.get("/",getAllClubs);
export default router;