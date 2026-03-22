import { Request, Response } from 'express';
import logger from '../../lib/logger.js';
import { z } from 'zod';
import { bookingService } from '../services/bookingTestService.js';

// ================= CREATE BOOKING =================
export const createBooking = async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      userId: z.number(),
      eventId: z.number()
    });

    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Validation Failed",
        details: parsed.error.flatten()
      });
    }

    const booking = await bookingService.createBooking(parsed.data);

    return res.status(201).json({
      message: "Booking successful",
      bookingId: booking.id
    });

  } catch (error: any) {
    if (error.message === "No tickets available") {
      return res.status(400).json({ error: error.message });
    }

    if (error.message === "Event not found") {
      return res.status(404).json({ error: error.message });
    }

    logger.error("Create booking error", { error });

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// ================= GET USER BOOKINGS =================
export const getUserBookings = async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      id: z.string().regex(/^\d+$/)
    });

    const parsed = schema.safeParse(req.params);

    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const userId = Number(parsed.data.id);

    const bookings = await bookingService.getBookingsByUser(userId);

    return res.status(200).json(bookings);

  } catch (error) {
    logger.error("Get user bookings error", { error });

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// ================= ATTENDANCE =================
export const markAttendance = async (req: Request, res: Response) => {
  try {
    const paramSchema = z.object({
      id: z.string().regex(/^\d+$/)
    });

    const bodySchema = z.object({
      bookingId: z.number()
    });

    const paramParsed = paramSchema.safeParse(req.params);
    const bodyParsed = bodySchema.safeParse(req.body);

    if (!paramParsed.success) {
      return res.status(400).json({ error: "Invalid event ID" });
    }

    if (!bodyParsed.success) {
      return res.status(400).json({
        error: "Validation Failed",
        details: bodyParsed.error.flatten()
      });
    }

    const eventId = Number(paramParsed.data.id);
    const bookingId = bodyParsed.data.bookingId;

    const result = await bookingService.verifyAttendance(eventId, bookingId);

    return res.status(200).json(result);

  } catch (error: any) {
    if (error.message === "Invalid booking") {
      return res.status(404).json({ error: error.message });
    }

    logger.error("Attendance error", { error });

    return res.status(500).json({ error: "Internal Server Error" });
  }
};