import type { NextConfig } from 'next';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

// Inicializa el entorno local de Cloudflare para Next dev
if (process.env.NODE_ENV === 'development') {
  initOpenNextCloudflareForDev();
}

const nextConfig: NextConfig = {
  /* opciones de Next.js si necesitas */
};

export default nextConfig;