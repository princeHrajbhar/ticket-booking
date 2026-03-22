import { Router } from 'express';
import {
  createBooking,
  getUserBookings,
  markAttendance
} from '../controllers/bookingTestController.js';

const router = Router();

// Create booking
router.post('/', createBooking);

// Get bookings of user
router.get('/users/:id/bookings', getUserBookings);

// Attendance (verify booking using id)
router.post('/events/:id/attendance', markAttendance);

export default router;