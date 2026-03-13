CREATE TABLE `blockedTimeSlots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` varchar(10) NOT NULL,
	`startTime` varchar(5) NOT NULL,
	`endTime` varchar(5) NOT NULL,
	`reason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blockedTimeSlots_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reservations_v2` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`address` text NOT NULL,
	`consultationType` enum('question','30min','1hour') NOT NULL,
	`reservationDate` varchar(10) NOT NULL,
	`startTime` varchar(5) NOT NULL,
	`endTime` varchar(5) NOT NULL,
	`wantsUpdates` int NOT NULL DEFAULT 0,
	`acceptedTerms` int NOT NULL DEFAULT 0,
	`emailSent` int NOT NULL DEFAULT 0,
	`smsSent` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reservations_v2_id` PRIMARY KEY(`id`)
);
