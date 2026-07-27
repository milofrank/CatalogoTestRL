import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const negocios = sqliteTable('negocios', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nombre: text('nombre').notNull(),
  slug: text('slug').notNull().unique(),
});

// 2. Tabla de Productos (Relacionada con Negocios)
export const productos = sqliteTable('productos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  negocioId: integer('negocio_id')
    .notNull()
    .references(() => negocios.id), // Enlace con el negocio dueño
  nombre: text('nombre').notNull(),
  descripcion: text('descripcion'),
  precio: integer('precio').notNull(), // Guardamos precios en valores enteros
  categoria: text('categoria'),
});