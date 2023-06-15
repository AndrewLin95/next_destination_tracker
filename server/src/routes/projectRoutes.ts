import express from 'express';
import { searchLocation } from '../controller/projectController';

const router = express.Router();

router.post('/searchlocation', searchLocation)



export default router