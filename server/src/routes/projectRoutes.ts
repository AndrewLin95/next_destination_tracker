import express from 'express';
import { searchLocation, createNewProject, getProjects, getEachProject } from '../controller/projectController';

const router = express.Router();

router.post('/newproject', createNewProject)
router.get('/searchlocation', searchLocation)
router.get('/getprojects/:userID', getProjects)
router.get('/geteachproject/:projectID', getEachProject)

export default router