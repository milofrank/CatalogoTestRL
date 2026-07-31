'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ImageUploader from '@/components/ImageUploader';

function FormularioProducto() {
  const searchParams = useSearchParams();
  const negocioId = searchParams.get('negocioId') || '';

  const [imagenKey, setImagenKey] = useState<string | null>(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');
    setErrorMsg('');

    try {
      const res = await fetch('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ negocioId, nombre, descripcion, precio, categoria, imagenKey }),
      });

      const data = (await res.json()) as { error?: string; producto?: unknown };

      if (!res.ok) {
        setStatus('error');
        setErrorMsg(data.error || 'Ocurrió un error al guardar');
        return;
      }

      setStatus('success');
      setNombre('');
      setDescripcion('');
      setPrecio('');
      setCategoria('');
      setImagenKey(null);
    } catch {
      setStatus('error');
      setErrorMsg('Error de red, revisá tu conexión');
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500">
          Panel de negocio
        </p>
        <h1 className="mt-1 text-3xl font-bold text-slate-800">Nuevo producto</h1>
        <p className="mt-2 text-sm text-slate-400">
          Se agregará al catálogo público en cuanto lo guardes.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm"
      >
        <ImageUploader onImageUploaded={setImagenKey} />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500">Nombre</label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Café de grano 500g"
            required
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Breve descripción del producto"
            rows={3}
            className="resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500">Precio</label>
            <input
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              placeholder="15000"
              type="number"
              required
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500">Categoría</label>
            <input
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              placeholder="Bebidas"
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={status === 'saving'}
          className="mt-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
        >
          {status === 'saving' ? 'Guardando...' : 'Guardar producto'}
        </button>

        {status === 'success' && (
          <p className="rounded-xl bg-emerald-50 px-4 py-3 text-center text-sm font-medium text-emerald-600">
            Producto guardado correctamente.
          </p>
        )}

        {status === 'error' && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-500">
            {errorMsg}
          </p>
        )}
      </form>
    </div>
  );
}

export default function NuevoProductoPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 sm:px-12">
      <Suspense fallback={<div className="text-center text-slate-400">Cargando...</div>}>
        <FormularioProducto />
      </Suspense>
    </main>
  );
}