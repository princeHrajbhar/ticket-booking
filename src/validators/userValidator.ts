import { z } from 'zod';

// CREATE
export const CreateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email")
});

// UPDATE
export const UpdateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional()
});

// PARAM
export const UserIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, "Invalid ID")
});

// TYPES
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;