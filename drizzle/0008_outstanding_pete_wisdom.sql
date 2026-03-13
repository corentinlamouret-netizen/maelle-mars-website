CREATE TABLE `testimonials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientName` varchar(100) NOT NULL,
	`clientEmail` varchar(320) NOT NULL,
	`clientPhone` varchar(20),
	`content` text NOT NULL,
	`rating` int NOT NULL DEFAULT 5,
	`consultationType` varchar(50),
	`status` enum('pending','published','private','rejected') NOT NULL DEFAULT 'pending',
	`adminNotes` text,
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `testimonials_id` PRIMARY KEY(`id`)
);
