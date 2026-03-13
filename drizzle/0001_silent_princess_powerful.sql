CREATE TABLE `reservations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`address` text NOT NULL,
	`consultationType` enum('question','30min','1hour') NOT NULL,
	`selectedTime` varchar(50) NOT NULL,
	`wantsUpdates` int NOT NULL DEFAULT 0,
	`acceptedTerms` int NOT NULL DEFAULT 0,
	`emailSent` int NOT NULL DEFAULT 0,
	`smsSent` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reservations_id` PRIMARY KEY(`id`)
);
