import { Router } from 'express';
import {
  createBooking,
  getUserBookings,
  markAttendance
} from '../controllers/bookingController.js';

const router = Router();

// CREATE BOOKING
// POST /api/bookings
router.post('/', createBooking);

//  GET USER BOOKINGS
// GET /api/bookings/users/:id/bookings
router.get('/users/:id/bookings', getUserBookings);

// VERIFY ATTENDANCE
// POST /api/bookings/events/:id/attendance
router.post('/events/:id/attendance', markAttendance);

export default router;