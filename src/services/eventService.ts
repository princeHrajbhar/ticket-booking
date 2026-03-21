import { prisma } from '../../lib/prisma';
import { CreateEventInput } from '../validators/eventValidator.js';
import logger from '../../lib/logger.js';

// export const eventService = {
//   async createNewEvent(data: CreateEventInput) {
//     try {
//       logger.info("Service: Attempting to save event to DB", { eventData: data });

//       const result = await prisma.event.create({
//         data: {
//           title: data.title,
//           description: data.description,
//           date: new Date(data.date),
//           total_capacity: data.total_capacity,
//           remaining_tickets: data.remaining_tickets,
//         },
//       });

//       logger.info("Service: DB Save Successful", { generatedId: result.id });
//       return result;

//     } catch (error) {
//       logger.error("Service Error (Prisma)", { 
//         error: error instanceof Error ? error.message : "Database connection failed",
//         stack: error instanceof Error ? error.stack : undefined
//       });
//       throw error;
//     }
//   },

//   async getAllEvents() {
//     try {
//       logger.info("Service: Fetching all events from DB");
      
//       const events = await prisma.event.findMany({
//         orderBy: {
//           date: 'asc' // Optional: Order by date
//         }
//       });
      
//       logger.info("Service: Successfully fetched events", { count: events.length });
//       return events;
//     } catch (error) {
//       logger.error("Service Error fetching all events", {
//         error: error instanceof Error ? error.message : "Database error",
//         stack: error instanceof Error ? error.stack : undefined
//       });
//       throw error;
//     }
//   },

//   async getEventById(id: string) {
//     try {
//       logger.info("Service: Fetching event by ID from DB", { eventId: id });
      
//       const event = await prisma.event.findUnique({
//         where: { id: parseInt(id) } // Assuming id is numeric, adjust if it's string
//       });
      
//       if (event) {
//         logger.info("Service: Successfully fetched event", { eventId: id });
//       } else {
//         logger.info("Service: Event not found", { eventId: id });
//       }
      
//       return event;
//     } catch (error) {
//       logger.error("Service Error fetching event by ID", {
//         eventId: id,
//         error: error instanceof Error ? error.message : "Database error",
//         stack: error instanceof Error ? error.stack : undefined
//       });
//       throw error;
//     }
//   },

//   async updateEvent(id: string, data: UpdateEventInput) {
//     try {
//       logger.info("Service: Attempting to update event in DB", { eventId: id, updateData: data });

//       // First check if event exists
//       const existingEvent = await prisma.event.findUnique({
//         where: { id: parseInt(id) }
//       });

//       if (!existingEvent) {
//         logger.info("Service: Event not found for update", { eventId: id });
//         return null;
//       }

//       // Prepare update data (only include fields that are provided)
//       const updateData: any = {};
//       if (data.title !== undefined) updateData.title = data.title;
//       if (data.description !== undefined) updateData.description = data.description;
//       if (data.date !== undefined) updateData.date = new Date(data.date);
//       if (data.total_capacity !== undefined) updateData.total_capacity = data.total_capacity;
//       if (data.remaining_tickets !== undefined) updateData.remaining_tickets = data.remaining_tickets;

//       const updatedEvent = await prisma.event.update({
//         where: { id: parseInt(id) },
//         data: updateData
//       });

//       logger.info("Service: DB Update Successful", { eventId: id });
//       return updatedEvent;

//     } catch (error) {
//       logger.error("Service Error updating event", {
//         eventId: id,
//         error: error instanceof Error ? error.message : "Database error",
//         stack: error instanceof Error ? error.stack : undefined
//       });
//       throw error;
//     }
//   },

//   async deleteEvent(id: string) {
//     try {
//       logger.info("Service: Attempting to delete event from DB", { eventId: id });

//       // First check if event exists
//       const existingEvent = await prisma.event.findUnique({
//         where: { id: parseInt(id) }
//       });

//       if (!existingEvent) {
//         logger.info("Service: Event not found for deletion", { eventId: id });
//         return null;
//       }

//       const deletedEvent = await prisma.event.delete({
//         where: { id: parseInt(id) }
//       });

//       logger.info("Service: DB Delete Successful", { eventId: id });
//       return deletedEvent;

//     } catch (error) {
//       logger.error("Service Error deleting event", {
//         eventId: id,
//         error: error instanceof Error ? error.message : "Database error",
//         stack: error instanceof Error ? error.stack : undefined
//       });
//       throw error;
//     }
//   }
// };

export const eventService = {
  async createNewEvent(data: CreateEventInput) {
    logger.info("Service: Creating event", { data });

    return prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        total_capacity: data.total_capacity,
        remaining_tickets: data.remaining_tickets,
      },
    });
  },

  async getAllEvents() {
    logger.info("Service: Fetching all events");

    return prisma.event.findMany({
      orderBy: { date: 'asc' }
    });
  },

  async getEventById(id: number) {
    logger.info("Service: Fetching event by ID", { id });

    return prisma.event.findUnique({
      where: { id }
    });
  },

  async updateEvent(id: number, data: Partial<CreateEventInput>) {
    logger.info("Service: Updating event", { id, data });

    return prisma.event.update({
      where: { id },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
      },
    });
  },

  async deleteEvent(id: number) {
    logger.info("Service: Deleting event", { id });

    return prisma.event.delete({
      where: { id }
    });
  }
};