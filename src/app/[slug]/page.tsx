import { getRequestContext } from '@cloudflare/next-on-pages';
import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import { negocios } from '@/db/schema'; // Revisa que esta ruta apunte a tu schema

export const runtime = 'edge';

export default async function TenantPage({ params }: { params: Promise<{ slug: string }> }) {
  // 1. En Next.js 15+, params es una promesa
  const { slug } = await params;

  // 2. Obtenemos el entorno de Cloudflare
  const env = getRequestContext().env as { DB?: any; base_catalogos?: any };
  const d1Binding = env.DB || env.base_catalogos;

  if (!d1Binding) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 p-6 text-center">
        <p className="text-red-500 font-medium">
          Error: No se encontró la conexión a la base de datos D1. Revisa tu wrangler.toml.
        </p>
      </div>
    );
  }

  // 3. Nos conectamos a D1
  const db = drizzle(d1Binding);

  // 4. Buscamos el cliente por slug
  const negocio = await db.select().from(negocios).where(eq(negocios.slug, slug)).get();

  if (!negocio) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-medium text-gray-400">Catálogo no encontrado</h1>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafafa] p-6 font-sans sm:p-12">
      <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-10 shadow-sm border border-gray-100 text-center">
        <h1 className="mb-2 text-4xl font-bold tracking-tight text-gray-800">
          {negocio.nombre}
        </h1>
        <p className="mb-10 text-sm font-medium text-gray-400">
          Bienvenido a nuestro catálogo oficial
        </p>

        <div className="rounded-2xl bg-slate-50 p-8 border border-slate-100 border-dashed">
          <p className="text-slate-400 font-medium">
            Pronto cargaremos los productos aquí...
          </p>
        </div>
      </div>
    </main>
  );
}