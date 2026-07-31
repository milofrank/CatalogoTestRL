'use client';

import { useState } from 'react';

interface ImageUploaderProps {
  onImageUploaded: (imagenKey: string) => void; // 👈 ahora manda la key, no una url
}

export default function ImageUploader({ onImageUploaded }: ImageUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
     const data = (await res.json()) as { imagenKey?: string; previewUrl?: string; error?: string };
      
      if (data.imagenKey) {
         setPreviewUrl(data.previewUrl ?? null);
         onImageUploaded(data.imagenKey);
     }else {
            alert('Error al subir la imagen: ' + (data.error || 'Desconocido'));
        }
    } catch (err) {
      console.error(err);
      alert('Error de red al intentar subir la imagen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-slate-300 p-6 bg-slate-50">
      {previewUrl ? (
        <div className="relative h-40 w-40 overflow-hidden rounded-lg border">
          <img src={previewUrl} alt="Vista previa" className="h-full w-full object-cover" />
        </div>
      ) : (
        <p className="text-sm text-slate-500">Subir imagen del producto (PNG, JPG)</p>
      )}
      <label className="cursor-pointer rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
        {loading ? 'Subiendo a R2...' : previewUrl ? 'Cambiar imagen' : 'Seleccionar archivo'}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={loading}
        />
      </label>
    </div>
  );
}