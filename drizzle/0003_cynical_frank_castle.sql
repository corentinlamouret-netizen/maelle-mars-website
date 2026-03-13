CREATE TABLE `pageVisits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` varchar(10) NOT NULL,
	`visitCount` int NOT NULL DEFAULT 1,
	`uniqueVisitors` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pageVisits_id` PRIMARY KEY(`id`)
);
