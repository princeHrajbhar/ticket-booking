import { Request, Response } from 'express';
import { z } from 'zod';
import { CreateEventSchema } from '../validators/eventValidator.js';
import { eventService } from '../services/eventService.js';


export const createEvent = async (req: Request, res: Response) => {
  // Log the incoming request to file and console

  try {
    // 1. Validate
    const validatedData = CreateEventSchema.parse(req.body);

    // 2. Service Call
    const newEvent = await eventService.createNewEvent(validatedData);

    // 3. Success Response
    return res.status(201).json(newEvent);

  } catch (error) {
    if (error instanceof z.ZodError) {
      const details = error.flatten().fieldErrors;
      
      // Log validation failures as Warnings in the file
      
      return res.status(400).json({ 
        error: "Validation Failed", 
        details 
      });
    }
    


    return res.status(500).json({ 
      error: "Internal Server Error",
      message: error instanceof Error ? error.message : "Unknown error" 
    });
  }
};
// GET ALL EVENTS
export const getAllEvents = async (req: Request, res: Response) => {

  try {
    const events = await eventService.getAllEvents();
    return res.status(200).json(events);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};




export const markAttendance = async (req: Request, res: Response) => {
  try {
    // Validate params
    const paramSchema = z.object({
      id: z.string().regex(/^\d+$/, "Invalid event ID")
    });

    // Validate body
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

    const result = await eventService.handleAttendance(eventId, bookingId);
console.log("RESULT:", result); // 👈 ADD THIS
    return res.status(200).json(result);

  } catch (error: any) {
    if (error.message === "Invalid booking") {
      return res.status(404).json({ error: error.message });
    }


    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
};

