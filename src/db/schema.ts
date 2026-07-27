import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const negocios = sqliteTable('negocios', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  nombre: text('nombre').notNull(),
});

export const productos = sqliteTable('productos', {
  id: text('id').primaryKey(),
  negocio_id: text('negocio_id').references(() => negocios.id),
  data_json: text('data_json'), // Aquí va todo tu objeto JSON flexible
  activo: integer('activo').default(1),
});