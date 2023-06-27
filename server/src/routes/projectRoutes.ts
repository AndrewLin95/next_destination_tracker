import express from 'express';
import { searchLocation, createNewProject, getProjects, getEachProject, updateNote } from '../controller/projectController';

const router = express.Router();

router.post('/newproject', createNewProject)
router.post('/searchlocation', searchLocation)
router.get('/getprojects/:userID', getProjects)
router.get('/geteachproject/:projectID', getEachProject)
router.put('/updatenote', updateNote)

export default router