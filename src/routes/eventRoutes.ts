import { Router } from 'express';
import { 
  createEvent, 
  getAllEvents, 

  
} from '../controllers/eventController.js';
import { markAttendance } from '../controllers/eventController.js';

const router = Router();

// CREATE
router.post('/', createEvent);

// READ
router.get('/', getAllEvents);


router.post('/:id/attendance', markAttendance);

export default router;