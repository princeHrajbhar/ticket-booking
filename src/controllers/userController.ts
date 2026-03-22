import { Request, Response } from 'express';
import logger from '../../lib/logger.js';

import {
  CreateUserSchema,
  UpdateUserSchema,
  UserIdParamSchema
} from '../validators/userValidator.js';

import { userService } from '../services/userService.js';
import z from 'zod';

// ================= CREATE =================
export const createUser = async (req: Request, res: Response) => {
  try {
    const parsed = CreateUserSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Validation Failed",
        details: parsed.error.flatten()
      });
    }

    const user = await userService.createUser(parsed.data);

    return res.status(201).json(user);

  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: "Email already exists" });
    }

    logger.error("Create user error", { error });

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// ================= GET ALL =================
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json(users);

  } catch (error) {
    logger.error("Get users error", { error });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// ================= GET BY ID =================
export const getUserById = async (req: Request, res: Response) => {
  try {
    const parsed = UserIdParamSchema.safeParse(req.params);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid ID",
        details: parsed.error.flatten()
      });
    }

    const user = await userService.getUserById(Number(parsed.data.id));

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);

  } catch (error) {
    logger.error("Get user error", { error });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// ================= UPDATE =================
export const updateUser = async (req: Request, res: Response) => {
  try {
    const param = UserIdParamSchema.safeParse(req.params);
    const body = UpdateUserSchema.safeParse(req.body);

    if (!param.success) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    if (!body.success) {
      return res.status(400).json({
        error: "Validation Failed",
        details: body.error.flatten()
      });
    }

    const updatedUser = await userService.updateUser(
      Number(param.data.id),
      body.data
    );

    return res.status(200).json(updatedUser);

  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "User not found" });
    }

    if (error.code === 'P2002') {
      return res.status(409).json({ error: "Email already exists" });
    }

    logger.error("Update user error", { error });

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// ================= DELETE =================
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const parsed = UserIdParamSchema.safeParse(req.params);

    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    await userService.deleteUser(Number(parsed.data.id));

    return res.status(200).json({
      message: "User deleted successfully"
    });

  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "User not found" });
    }

    logger.error("Delete user error", { error });

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserBookings = async (req: Request, res: Response) => {
  try {
    // Validate ID
    const schema = z.object({
      id: z.string().regex(/^\d+$/, "Invalid user ID")
    });

    const parsed = schema.safeParse(req.params);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid user ID",
        details: parsed.error.flatten()
      });
    }

    const userId = Number(parsed.data.id);

    const bookings = await userService.getUserBookings(userId);

    return res.status(200).json(bookings);

  } catch (error) {
    logger.error("Get user bookings error", { error });

    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
};