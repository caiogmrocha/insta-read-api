-- AlterTable
ALTER TABLE `readers` ADD COLUMN `archived` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `archived_at` DATETIME(3) NULL;
