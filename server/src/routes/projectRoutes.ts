import express from 'express';
import { searchLocation, createNewProject, getProjects } from '../controller/projectController';

const router = express.Router();

router.post('/newproject', createNewProject)
router.get('/searchlocation', searchLocation)
router.get('/getprojects/:userID', getProjects)

export default router