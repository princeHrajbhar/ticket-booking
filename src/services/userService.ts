import { prisma } from '../../lib/prisma.js';
import logger from '../../lib/logger.js';
import { CreateUserInput, UpdateUserInput } from '../validators/userValidator.js';

export const userService = {
  async createUser(data: CreateUserInput) {
    logger.info("Service: Create user", { data });

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
    logger.info("Service: Update user", { id, data });

    return prisma.user.update({
      where: { id },
      data
    });
  },

  async deleteUser(id: number) {
    logger.info("Service: Delete user", { id });

    return prisma.user.delete({
      where: { id }
    });
  }
};