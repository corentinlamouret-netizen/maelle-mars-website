CREATE TABLE `paypal_payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reservationId` int NOT NULL,
	`paypalTransactionId` varchar(255) NOT NULL,
	`amount` int NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'EUR',
	`paymentStatus` enum('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
	`payerEmail` varchar(320),
	`payerName` varchar(255),
	`webhookData` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `paypal_payments_id` PRIMARY KEY(`id`),
	CONSTRAINT `paypal_payments_paypalTransactionId_unique` UNIQUE(`paypalTransactionId`)
);
