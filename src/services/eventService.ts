import { prisma } from '../lib/prisma.js';
import { CreateEventInput } from '../validators/eventValidator.js';


export const eventService = { 
 async createNewEvent(data: CreateEventInput) {

    // ✅ Check if event already exists (same title)
    const existingEvent = await prisma.event.findFirst({
      where: {
        title: data.title
      }
    });

    if (existingEvent) {
      throw new Error("Event with this title already exists");
    }

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

  return prisma.event.findMany({
    where: {
      date: {
        gte: new Date() // ✅ only future events
      }
    },
    orderBy: { date: 'asc' }
  });
},



  async handleAttendance(eventId: number, bookingId: number) {

    // 1. Check booking exists for this event
    const booking = await prisma.booking.findFirst({
      
      where: {
        id: bookingId,
        eventId
        
      }
    });

    if (!booking) {
      throw new Error("Invalid booking");
    }

    // 2. Count total bookings (tickets) for this event
    const totalBookings = await prisma.booking.count({
      where: {
        eventId
      }
    });

    return {
      message: "Valid ticket",
      bookingId: booking.id,
      userId: booking.userId,
      totalTicketsBooked: totalBookings
    };
  }
};