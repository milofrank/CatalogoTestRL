// 1. Cambiamos la importación antigua por la nueva de OpenNext
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import { negocios, productos } from '@/db/schema';

export const runtime = 'edge';

export default async function TenantPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // 2. Usamos el nuevo método asíncrono para obtener el entorno de Cloudflare
  const { env } = await getCloudflareContext();
  const d1Binding = (env as any).DB || (env as any).base_catalogos;

  if (!d1Binding) {
    return (
      <div className="flex h-screen items-center justify-center p-6 text-center text-red-500">
        Error: No se encontró la conexión a la base de datos D1. Revisa tu wrangler.toml.
      </div>
    );
  }

  // 3. Inicializamos Drizzle con el binding
  const db = drizzle(d1Binding);

  // Buscar el negocio
  const negocio = await db.select().from(negocios).where(eq(negocios.slug, slug)).get();

  if (!negocio) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-medium text-gray-400">Catálogo no encontrado</h1>
      </div>
    );
  }

  // Buscar los productos
  const listaProductos = await db.select().from(productos).where(eq(productos.negocioId, negocio.id));

  return (
    <main className="min-h-screen bg-slate-50 p-6 font-sans sm:p-12">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 rounded-3xl bg-white p-8 text-center shadow-sm border border-slate-100">
          <h1 className="text-4xl font-bold text-slate-800">{negocio.nombre}</h1>
          <p className="mt-2 text-sm text-slate-400">Menú & Catálogo Digital</p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {listaProductos.length === 0 ? (
            <p className="col-span-full text-center text-slate-400">No hay productos disponibles por ahora.</p>
          ) : (
            listaProductos.map((prod) => (
              <div key={prod.id} className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500">{prod.categoria}</span>
                  <h3 className="mt-1 text-xl font-bold text-slate-800">{prod.nombre}</h3>
                  <p className="mt-2 text-sm text-slate-500">{prod.descripcion}</p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4">
                  <span className="text-lg font-bold text-slate-900">${prod.precio.toLocaleString()}</span>
                  <button className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-slate-800">
                    Ordenar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}