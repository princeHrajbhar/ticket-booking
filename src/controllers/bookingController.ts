import { Request, Response } from 'express';
import logger from '../../lib/logger.js';

import {
  CreateBookingSchema,
  UpdateBookingSchema,
  BookingIdParamSchema
} from '../validators/bookingValidator.js';

import { bookingService } from '../services/bookingService.js';

// CREATE
export const createBooking = async (req: Request, res: Response) => {
  try {
    const parsed = CreateBookingSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Validation Failed",
        details: parsed.error.flatten()
      });
    }

    const booking = await bookingService.createBooking(parsed.data);

    return res.status(201).json(booking);

  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        error: "User already booked this event"
      });
    }

    logger.error("Create booking error", { error });

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET ALL
export const getAllBookings = async (_req: Request, res: Response) => {
  try {
    const data = await bookingService.getAllBookings();
    return res.status(200).json(data);

  } catch (error) {
    logger.error("Get bookings error", { error });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET BY ID
export const getBookingById = async (req: Request, res: Response) => {
  try {
    const parsed = BookingIdParamSchema.safeParse(req.params);

    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const booking = await bookingService.getBookingById(
      Number(parsed.data.id)
    );

    if (!booking) {
      return res.status(404).json({ error: "Not found" });
    }

    return res.status(200).json(booking);

  } catch (error) {
    logger.error("Get booking error", { error });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// UPDATE
export const updateBooking = async (req: Request, res: Response) => {
  try {
    const param = BookingIdParamSchema.safeParse(req.params);
    const body = UpdateBookingSchema.safeParse(req.body);

    if (!param.success) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    if (!body.success) {
      return res.status(400).json({
        error: "Validation Failed",
        details: body.error.flatten()
      });
    }

    const updated = await bookingService.updateBooking(
      Number(param.data.id),
      body.data
    );

    return res.status(200).json(updated);

  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Not found" });
    }

    logger.error("Update booking error", { error });

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// DELETE
export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const parsed = BookingIdParamSchema.safeParse(req.params);

    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    await bookingService.deleteBooking(Number(parsed.data.id));

    return res.status(200).json({
      message: "Deleted successfully"
    });

  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Not found" });
    }

    logger.error("Delete booking error", { error });

    return res.status(500).json({ error: "Internal Server Error" });
  }
};