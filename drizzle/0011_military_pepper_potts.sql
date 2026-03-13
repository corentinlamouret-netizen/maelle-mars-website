ALTER TABLE `testimonials` ADD `manusSynced` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `testimonials` ADD `manusId` varchar(100);--> statement-breakpoint
ALTER TABLE `testimonials` ADD `manusError` text;--> statement-breakpoint
ALTER TABLE `testimonials` ADD `manusLastSyncAt` timestamp;