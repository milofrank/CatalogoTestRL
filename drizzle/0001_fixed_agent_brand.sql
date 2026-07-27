PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_negocios` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`slug` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_negocios`("id", "nombre", "slug") SELECT "id", "nombre", "slug" FROM `negocios`;--> statement-breakpoint
DROP TABLE `negocios`;--> statement-breakpoint
ALTER TABLE `__new_negocios` RENAME TO `negocios`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `negocios_slug_unique` ON `negocios` (`slug`);--> statement-breakpoint
CREATE TABLE `__new_productos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`negocio_id` integer NOT NULL,
	`nombre` text NOT NULL,
	`descripcion` text,
	`precio` integer NOT NULL,
	`categoria` text,
	FOREIGN KEY (`negocio_id`) REFERENCES `negocios`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_productos`("id", "negocio_id", "nombre", "descripcion", "precio", "categoria") SELECT "id", "negocio_id", "nombre", "descripcion", "precio", "categoria" FROM `productos`;--> statement-breakpoint
DROP TABLE `productos`;--> statement-breakpoint
ALTER TABLE `__new_productos` RENAME TO `productos`;