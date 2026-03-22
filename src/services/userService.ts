import { prisma } from '../lib/prisma.js';
import { CreateUserInput, UpdateUserInput } from '../validators/userValidator.js';

export const userService = {
  async createUser(data: CreateUserInput) {

    return prisma.user.create({
      data
    });
  },

  async getAllUsers() {
    return prisma.user.findMany({
      orderBy: { id: 'asc' }
    });
  },

  async getUserById(id: number) {
    return prisma.user.findUnique({
      where: { id }
    });
  },

  async updateUser(id: number, data: UpdateUserInput) {

    return prisma.user.update({
      where: { id },
      data
    });
  },

  async deleteUser(id: number) {
    return prisma.user.delete({
      where: { id }
    });
  },
 async getUserBookings(userId: number) {
    return prisma.booking.findMany({
      where: {
        userId
      },
      include: {
        event: true // optional but useful
      },
      orderBy: {
        bookingDate: 'desc'
      }
    });
  }
  
};

