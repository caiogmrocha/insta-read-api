/*
  Warnings:

  - You are about to alter the column `pages` on the `books` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedInt`.

*/
-- AlterTable
ALTER TABLE `books` ADD COLUMN `amount` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    MODIFY `pages` INTEGER UNSIGNED NOT NULL;
