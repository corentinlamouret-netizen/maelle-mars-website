CREATE TABLE `event_attendees` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventId` int NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`numberOfPlaces` int NOT NULL DEFAULT 1,
	`paymentStatus` enum('pending','completed','failed') NOT NULL DEFAULT 'pending',
	`paymentAmount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `event_attendees_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`location` varchar(255) NOT NULL,
	`latitude` varchar(20),
	`longitude` varchar(20),
	`eventDate` varchar(10) NOT NULL,
	`startTime` varchar(5) NOT NULL,
	`endTime` varchar(5) NOT NULL,
	`maxAttendees` int NOT NULL,
	`currentAttendees` int NOT NULL DEFAULT 0,
	`price` int NOT NULL DEFAULT 0,
	`imageUrl` text,
	`status` enum('upcoming','ongoing','completed','cancelled') NOT NULL DEFAULT 'upcoming',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `events_id` PRIMARY KEY(`id`)
);
