import { prisma } from '../../lib/prisma.js';

export const bookingService = {

  // ================= CREATE BOOKING =================
  async createBooking(data: { userId: number; eventId: number }) {
    return prisma.$transaction(async (tx) => {

      const event = await tx.event.findUnique({
        where: { id: data.eventId }
      });

      if (!event) throw new Error("Event not found");

      if (event.remaining_tickets <= 0) {
        throw new Error("No tickets available");
      }

      await tx.event.update({
        where: { id: data.eventId },
        data: {
          remaining_tickets: {
            decrement: 1
          }
        }
      });

      const booking = await tx.booking.create({
        data: {
          userId: data.userId,
          eventId: data.eventId
        }
      });

      return booking;
    });
  },

  // ================= GET BOOKINGS BY USER =================
  async getBookingsByUser(userId: number) {
    return prisma.booking.findMany({
      where: { userId },
      include: {
        event: true
      }
    });
  },

  // ================= VERIFY ATTENDANCE =================
  async verifyAttendance(eventId: number, bookingId: number) {
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        eventId
      }
    });

    if (!booking) {
      throw new Error("Invalid booking");
    }

    return {
      message: "Valid ticket",
      bookingId: booking.id,
      userId: booking.userId
    };
  }
};