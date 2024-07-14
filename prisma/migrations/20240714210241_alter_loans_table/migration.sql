/*
  Warnings:

  - You are about to drop the column `return_date` on the `loans` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `loans` DROP COLUMN `return_date`,
    ADD COLUMN `returned_date` DATETIME(3) NULL;
