// src/app/api/productos/route.ts
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { drizzle } from 'drizzle-orm/d1';
import { NextResponse } from 'next/server';
import { productos } from '@/db/schema';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = drizzle(env.DB);

    const body = (await request.json()) as {
      negocioId: number | string;
      nombre: string;
      descripcion?: string;
      precio: number | string;
      categoria?: string;
      imagenKey?: string;
    };

    const { negocioId, nombre, descripcion, precio, categoria, imagenKey } = body;

    if (!negocioId || !nombre || !precio) {
      return NextResponse.json(
        { error: 'negocioId, nombre y precio son obligatorios' },
        { status: 400 }
      );
    }

    const [nuevoProducto] = await db
      .insert(productos)
      .values({
        negocioId: Number(negocioId),
        nombre,
        descripcion: descripcion || null,
        precio: Number(precio),
        categoria: categoria || null,
        imagenKey: imagenKey || null,
      })
      .returning();

    return NextResponse.json({ producto: nuevoProducto }, { status: 201 });
  } catch (error) {
    console.error('Error al crear producto:', error);
    return NextResponse.json({ error: 'Error al guardar el producto' }, { status: 500 });
  }
}