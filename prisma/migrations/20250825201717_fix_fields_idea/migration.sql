/*
  Warnings:

  - You are about to drop the column `content` on the `Idea` table. All the data in the column will be lost.
  - You are about to drop the column `feedback` on the `Idea` table. All the data in the column will be lost.
  - Added the required column `challenges` to the `Idea` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullText` to the `Idea` table without a default value. This is not possible if the table is not empty.
  - Added the required column `innovation` to the `Idea` table without a default value. This is not possible if the table is not empty.
  - Added the required column `marketPotential` to the `Idea` table without a default value. This is not possible if the table is not empty.
  - Added the required column `suggestions` to the `Idea` table without a default value. This is not possible if the table is not empty.
  - Added the required column `viability` to the `Idea` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Idea` DROP COLUMN `content`,
    DROP COLUMN `feedback`,
    ADD COLUMN `challenges` VARCHAR(191) NOT NULL,
    ADD COLUMN `fullText` VARCHAR(191) NOT NULL,
    ADD COLUMN `innovation` VARCHAR(191) NOT NULL,
    ADD COLUMN `marketPotential` VARCHAR(191) NOT NULL,
    ADD COLUMN `suggestions` VARCHAR(191) NOT NULL,
    ADD COLUMN `viability` VARCHAR(191) NOT NULL;
