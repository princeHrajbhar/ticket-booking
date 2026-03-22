import { prisma } from '../../lib/prisma.js';
import logger from '../../lib/logger.js';

export const bookingService = {
  async createBooking(data: { userId: number; eventId: number }) {
    logger.info("Service: Create booking", { data });

    return prisma.booking.create({
      data
    });
  },

  async getAllBookings() {
    return prisma.booking.findMany({
      include: {
        user: true,
        event: true
      },
      orderBy: { id: 'asc' }
    });
  },

  async getBookingById(id: number) {
    return prisma.booking.findUnique({
      where: { id },
      include: {
        user: true,
        event: true
      }
    });
  },

  async updateBooking(id: number, data: { bookingDate?: string }) {
    logger.info("Service: Update booking", { id, data });

    return prisma.booking.update({
      where: { id },
      data: {
        bookingDate: data.bookingDate
          ? new Date(data.bookingDate)
          : undefined
      }
    });
  },

  async deleteBooking(id: number) {
    logger.info("Service: Delete booking", { id });

    return prisma.booking.delete({
      where: { id }
    });
  }
};