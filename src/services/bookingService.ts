import { prisma } from '../../lib/prisma.js';

export const bookingService = {

  // ================= CREATE BOOKING =================
  async createBooking(data: { userId: number; eventId: number; quantity: number }) {
    return prisma.$transaction(async (tx) => {

      const { userId, eventId, quantity } = data;
      const MAX_TICKETS = 10;

      // ✅ Check user
      const user = await tx.user.findUnique({
        where: { id: userId }
      });
      if (!user) throw new Error("User not found");

      // ✅ Check event
      const event = await tx.event.findUnique({
        where: { id: eventId }
      });
      if (!event) throw new Error("Event not found");

      // ✅ Check availability
      if (event.remaining_tickets < quantity) {
        throw new Error("Not enough tickets available");
      }

      // ✅ Check existing booking
      const existingBooking = await tx.booking.findUnique({
        where: {
          userId_eventId: { userId, eventId }
        }
      });

      // ================= UPDATE EXISTING =================
      if (existingBooking) {

        const newTotal = existingBooking.quantity + quantity;

        if (newTotal > MAX_TICKETS) {
          throw new Error("Ticket limit exceeded");
        }

        // Deduct tickets
        await tx.event.update({
          where: { id: eventId },
          data: {
            remaining_tickets: {
              decrement: quantity
            }
          }
        });

        // Update booking
        return await tx.booking.update({
          where: {
            userId_eventId: { userId, eventId }
          },
          data: {
            quantity: {
              increment: quantity
            }
          }
        });
      }

      // ================= CREATE NEW =================

      if (quantity > MAX_TICKETS) {
        throw new Error("Ticket limit exceeded");
      }

      // Deduct tickets
      await tx.event.update({
        where: { id: eventId },
        data: {
          remaining_tickets: {
            decrement: quantity
          }
        }
      });

      return await tx.booking.create({
        data: {
          userId,
          eventId,
          quantity
        }
      });
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
      userId: booking.userId,
      quantity: booking.quantity // ✅ added
    };
  }
};