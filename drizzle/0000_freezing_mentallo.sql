CREATE TABLE `negocios` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`nombre` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `negocios_slug_unique` ON `negocios` (`slug`);--> statement-breakpoint
CREATE TABLE `productos` (
	`id` text PRIMARY KEY NOT NULL,
	`negocio_id` text,
	`data_json` text,
	`activo` integer DEFAULT 1,
	FOREIGN KEY (`negocio_id`) REFERENCES `negocios`(`id`) ON UPDATE no action ON DELETE no action
);
