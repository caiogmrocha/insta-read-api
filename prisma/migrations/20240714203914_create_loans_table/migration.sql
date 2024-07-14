-- CreateTable
CREATE TABLE `loans` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `readers_id` INTEGER NOT NULL,
    `books_id` INTEGER NOT NULL,
    `loan_date` DATETIME(3) NOT NULL,
    `return_date` DATETIME(3) NULL,
    `expected_return_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `loans` ADD CONSTRAINT `loans_readers_id_fkey` FOREIGN KEY (`readers_id`) REFERENCES `readers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `loans` ADD CONSTRAINT `loans_books_id_fkey` FOREIGN KEY (`books_id`) REFERENCES `books`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
