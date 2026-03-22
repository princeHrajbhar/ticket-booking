/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[title]` on the table `Event` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Post` DROP FOREIGN KEY `Post_authorId_fkey`;

-- AlterTable
ALTER TABLE `Booking` ADD COLUMN `quantity` INTEGER NOT NULL DEFAULT 1;

-- DropTable
DROP TABLE `Post`;

-- CreateIndex
CREATE UNIQUE INDEX `Event_title_key` ON `Event`(`title`);
