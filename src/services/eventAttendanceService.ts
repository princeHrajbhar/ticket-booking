import { prisma } from '../../lib/prisma.js';
import logger from '../../lib/logger.js';

export const eventAttendanceService = {
  async createAttendance(data: { userId: number; entryTime: string }) {
    logger.info("Service: Create attendance", { data });

    return prisma.eventAttendance.create({
      data: {
        userId: data.userId,
        entryTime: new Date(data.entryTime)
      }
    });
  },

  async getAllAttendance() {
    return prisma.eventAttendance.findMany({
      orderBy: { id: 'asc' },
      include: { user: true } // relation (if exists)
    });
  },

  async getAttendanceById(id: number) {
    return prisma.eventAttendance.findUnique({
      where: { id },
      include: { user: true }
    });
  },

  async updateAttendance(id: number, data: { entryTime?: string }) {
    logger.info("Service: Update attendance", { id, data });

    return prisma.eventAttendance.update({
      where: { id },
      data: {
        entryTime: data.entryTime
          ? new Date(data.entryTime)
          : undefined
      }
    });
  },

  async deleteAttendance(id: number) {
    logger.info("Service: Delete attendance", { id });

    return prisma.eventAttendance.delete({
      where: { id }
    });
  }
};