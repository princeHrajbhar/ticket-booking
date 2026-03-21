import { Router } from 'express';
import { 
  createEvent, 
  getAllEvents, 
  getEventById, 
  updateEvent, 
  deleteEvent 
} from '../controllers/eventController.js';

const router = Router();

// CREATE
router.post('/', createEvent);

// READ
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// UPDATE
router.put('/:id', updateEvent);

// DELETE
router.delete('/:id', deleteEvent);

export default router;