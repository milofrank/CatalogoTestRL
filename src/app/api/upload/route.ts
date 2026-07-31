// src/app/api/upload/route.ts
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function POST(request: Request) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const bucket = env.CATALOGO_IMAGENES;

    if (!bucket) {
      return NextResponse.json({ error: 'R2 Bucket no vinculado' }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No se envió ningún archivo' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de archivo no permitido' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'La imagen no puede superar 5MB' }, { status: 400 });
    }

    const extension = file.name.split('.').pop();
    const imagenKey = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
    const arrayBuffer = await file.arrayBuffer();

    await bucket.put(imagenKey, arrayBuffer, {
      httpMetadata: { contentType: file.type },
    });

    const previewUrl = `${env.R2_PUBLIC_URL}/${imagenKey}`;

    return NextResponse.json({ imagenKey, previewUrl });
  } catch (error) {
    console.error('Error al subir a R2:', error);
    return NextResponse.json({ error: 'Error al procesar la imagen' }, { status: 500 });
  }
}