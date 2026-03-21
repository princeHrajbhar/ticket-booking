import { Request, Response } from 'express';
import { z } from 'zod';
import { CreateEventSchema } from '../validators/eventValidator.js';
import { eventService } from '../services/eventService.js';
import logger from '../../lib/logger.js'; // Import your new logger

export const createEvent = async (req: Request, res: Response) => {
  // Log the incoming request to file and console
  logger.info("Controller: Received Request Body", { body: req.body });

  try {
    // 1. Validate
    const validatedData = CreateEventSchema.parse(req.body);
    logger.info("Controller: Validation Passed");

    // 2. Service Call
    const newEvent = await eventService.createNewEvent(validatedData);

    // 3. Success Response
    logger.info("Controller: Event Created Successfully", { eventId: newEvent.id });
    return res.status(201).json(newEvent);

  } catch (error) {
    if (error instanceof z.ZodError) {
      const details = error.flatten().fieldErrors;
      
      // Log validation failures as Warnings in the file
      logger.warn("Controller: Validation Failed", { details });
      
      return res.status(400).json({ 
        error: "Validation Failed", 
        details 
      });
    }
    
    // Log unexpected crashes as Errors in the file (error.log)
    logger.error("Controller: Unexpected Error during Event Creation", { 
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    });

    return res.status(500).json({ 
      error: "Internal Server Error",
      message: error instanceof Error ? error.message : "Unknown error" 
    });
  }
};
// GET ALL EVENTS
export const getAllEvents = async (req: Request, res: Response) => {
  logger.info("Controller: Fetching all events");

  try {
    const events = await eventService.getAllEvents();
    return res.status(200).json(events);
  } catch (error) {
    logger.error("Controller: Error fetching events", { error });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET EVENT BY ID
export const getEventById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  logger.info("Controller: Fetching event by ID", { id });

  try {
    const event = await eventService.getEventById(id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    return res.status(200).json(event);
  } catch (error) {
    logger.error("Controller: Error fetching event", { error });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// UPDATE EVENT
export const updateEvent = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  logger.info("Controller: Updating event", { id, body: req.body });

  try {
    const updatedEvent = await eventService.updateEvent(id, req.body);

    return res.status(200).json(updatedEvent);
  } catch (error) {
    logger.error("Controller: Error updating event", { error });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// DELETE EVENT
export const deleteEvent = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  logger.info("Controller: Deleting event", { id });

  try {
    await eventService.deleteEvent(id);

    return res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    logger.error("Controller: Error deleting event", { error });
    return res.status(500).json({ error: "Internal Server Error" });
  }
};