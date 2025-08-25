/*
  Warnings:

  - You are about to drop the column `fullText` on the `Idea` table. All the data in the column will be lost.
  - Added the required column `idea` to the `Idea` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Idea` DROP COLUMN `fullText`,
    ADD COLUMN `idea` VARCHAR(191) NOT NULL,
    MODIFY `viability` VARCHAR(400) NOT NULL;
