import express from 'express';
import { searchLocation } from '../controller/projectController';

const router = express.Router();

router.get('/searchlocation', searchLocation)

export default router