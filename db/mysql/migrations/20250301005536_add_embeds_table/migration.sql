-- CreateTable
CREATE TABLE `Embed` (
    `id` VARCHAR(19) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `createdAt` BIGINT NOT NULL,
    `updatedAt` BIGINT NOT NULL,
    `createdBy` VARCHAR(19) NOT NULL,
    `embedJson` JSON NOT NULL,

    UNIQUE INDEX `Embed_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
