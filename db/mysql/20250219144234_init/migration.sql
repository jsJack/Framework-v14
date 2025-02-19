-- CreateTable
CREATE TABLE `blacklists` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identifier` VARCHAR(191) NOT NULL,
    `reason` VARCHAR(191) NULL,
    `commands` JSON NOT NULL,
    `createdAt` BIGINT NOT NULL,
    `expiresAt` BIGINT NOT NULL,

    UNIQUE INDEX `blacklists_identifier_key`(`identifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
