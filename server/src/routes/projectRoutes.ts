import express from 'express';
import { 
  searchLocation, 
  createNewProject, 
  getProjects, 
  getEachProject, 
  updateNote, 
  deleteLocation, 
  setScheduleData,
  deleteSchedule,
} from '../controller/projectController';

const router = express.Router();

router.post('/newproject', createNewProject)
router.post('/searchlocation', searchLocation)
router.get('/getprojects/:userID', getProjects)
router.get('/geteachproject/:projectID', getEachProject)
router.put('/updatenote', updateNote)
router.put('/deletelocation/:locationID', deleteLocation)
router.post('/setscheduledata', setScheduleData)
router.put('/deleteschedule/:projectID/:locationID', deleteSchedule)

export default router