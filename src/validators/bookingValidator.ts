import { z } from 'zod';

// CREATE
export const CreateBookingSchema = z.object({
  userId: z.number(),
  eventId: z.number()
});

// UPDATE (optional)
export const UpdateBookingSchema = z.object({
  bookingDate: z.string().datetime().optional()
});

// PARAM
export const BookingIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, "Invalid ID")
});

// TYPES
export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;
export type UpdateBookingInput = z.infer<typeof UpdateBookingSchema>;