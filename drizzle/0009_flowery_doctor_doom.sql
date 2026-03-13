CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`consultationCount` int NOT NULL DEFAULT 0,
	`wantUpdates` int NOT NULL DEFAULT 0,
	`wantConferences` int NOT NULL DEFAULT 0,
	`lastConsultationDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`),
	CONSTRAINT `clients_email_unique` UNIQUE(`email`)
);
