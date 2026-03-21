import { z } from 'zod';

export const CreateEventSchema = z.object({
  title: z.string().min(3, "Title is too short"),
  description: z.string().optional(),
  date: z.string().datetime({ message: "Invalid date format (ISO required: YYYY-MM-DDTHH:mm:ssZ)" }),
  total_capacity: z.number().int().positive(),
  remaining_tickets: z.number().int().nonnegative(),
}).refine((data) => data.remaining_tickets <= data.total_capacity, {
  message: "Remaining tickets cannot exceed total capacity",
  path: ["remaining_tickets"],
});

export type CreateEventInput = z.infer<typeof CreateEventSchema>;