import { Request, Response } from 'express';
import logger from '../../lib/logger.js';

import {
  CreateAttendanceSchema,
  UpdateAttendanceSchema,
  AttendanceIdParamSchema
} from '../validators/eventAttendanceValidator.js';

import { eventAttendanceService } from '../services/eventAttendanceService.js';

// CREATE
export const createAttendance = async (req: Request, res: Response) => {
  try {
    const parsed = CreateAttendanceSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Validation Failed",
        details: parsed.error.flatten()
      });
    }

    const attendance = await eventAttendanceService.createAttendance(parsed.data);

    return res.status(201).json(attendance);

  } catch (error) {
    logger.error("Create attendance error", { error });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET ALL
export const getAllAttendance = async (_req: Request, res: Response) => {
  try {
    const data = await eventAttendanceService.getAllAttendance();
    return res.status(200).json(data);

  } catch (error) {
    logger.error("Get attendance error", { error });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET BY ID
export const getAttendanceById = async (req: Request, res: Response) => {
  try {
    const parsed = AttendanceIdParamSchema.safeParse(req.params);

    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const attendance = await eventAttendanceService.getAttendanceById(
      Number(parsed.data.id)
    );

    if (!attendance) {
      return res.status(404).json({ error: "Not found" });
    }

    return res.status(200).json(attendance);

  } catch (error) {
    logger.error("Get attendance by id error", { error });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// UPDATE
export const updateAttendance = async (req: Request, res: Response) => {
  try {
    const param = AttendanceIdParamSchema.safeParse(req.params);
    const body = UpdateAttendanceSchema.safeParse(req.body);

    if (!param.success) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    if (!body.success) {
      return res.status(400).json({
        error: "Validation Failed",
        details: body.error.flatten()
      });
    }

    const updated = await eventAttendanceService.updateAttendance(
      Number(param.data.id),
      body.data
    );

    return res.status(200).json(updated);

  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Not found" });
    }

    logger.error("Update attendance error", { error });

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// DELETE
export const deleteAttendance = async (req: Request, res: Response) => {
  try {
    const parsed = AttendanceIdParamSchema.safeParse(req.params);

    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    await eventAttendanceService.deleteAttendance(
      Number(parsed.data.id)
    );

    return res.status(200).json({
      message: "Deleted successfully"
    });

  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Not found" });
    }

    logger.error("Delete attendance error", { error });

    return res.status(500).json({ error: "Internal Server Error" });
  }
};