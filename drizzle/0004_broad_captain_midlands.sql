ALTER TABLE `reservations_v2` ADD `paymentStatus` enum('pending','completed','failed') DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE `reservations_v2` ADD `paymentAmount` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `reservations_v2` ADD `paypalTransactionId` varchar(255);