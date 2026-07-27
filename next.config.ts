import type { NextConfig } from 'next';
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

// Envolvemos el await para evitar el error de top-level await en CJS
if (process.env.NODE_ENV === 'development') {
  (async () => {
    await setupDevPlatform();
  })();
}

const nextConfig: NextConfig = {
  /* opciones de configuración de Next.js si las necesitas */
};

export default nextConfig;