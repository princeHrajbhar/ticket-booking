import { z } from 'zod';

// CREATE
export const CreateAttendanceSchema = z.object({
  userId: z.number(),
  entryTime: z.string().datetime()
});

// UPDATE
export const UpdateAttendanceSchema = z.object({
  entryTime: z.string().datetime().optional()
});

// PARAM
export const AttendanceIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, "Invalid ID")
});

// TYPES
export type CreateAttendanceInput = z.infer<typeof CreateAttendanceSchema>;
export type UpdateAttendanceInput = z.infer<typeof UpdateAttendanceSchema>;