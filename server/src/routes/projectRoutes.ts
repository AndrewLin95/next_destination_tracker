import express from 'express';
import { 
  searchLocation, 
  createNewProject, 
  updateProject,
  getProjects, 
  getEachProject, 
  updateNote, 
  deleteLocation, 
  setScheduleData,
  deleteSchedule,
  updateScheduleSettings,
} from '../controller/projectController';

const router = express.Router();

router.post('/newproject', createNewProject)
router.put('/updateproject', updateProject)
router.post('/searchlocation', searchLocation)
router.get('/getprojects/:userID', getProjects)
router.get('/geteachproject/:projectID', getEachProject)
router.put('/updatenote', updateNote)
router.put('/deletelocation/:projectID/:locationID', deleteLocation)
router.post('/setscheduledata', setScheduleData)
router.put('/deleteschedule/:projectID/:locationID', deleteSchedule)
router.put('/updateschedulesettings', updateScheduleSettings)

export default router