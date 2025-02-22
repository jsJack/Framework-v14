-- CreateTable
CREATE TABLE `Blacklist` (
    `id` VARCHAR(19) NOT NULL,
    `executorId` VARCHAR(19) NOT NULL,
    `reason` LONGTEXT NULL,
    `commands` JSON NOT NULL,
    `createdAt` BIGINT NOT NULL,
    `expiresAt` BIGINT NOT NULL,

    UNIQUE INDEX `Blacklist_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
