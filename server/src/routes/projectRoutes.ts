import express from 'express';
import { searchLocation, createNewProject } from '../controller/projectController';

const router = express.Router();

router.post('/newproject', createNewProject)
router.get('/searchlocation', searchLocation)

export default router