/**
 * Konfigurační soubor pro Next.js aplikaci České spalovny
 * 
 * Obsahuje nastavení pro:
 * - Build optimalizace
 * - External API konfigurace  
 * - Image optimalizace
 * - Performance tuning
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Povolení cross-origin requestů z určitých zdrojů během vývoje
  allowedDevOrigins: [
    '172.22.80.1',
    '192.168.0.80'
  ],

  // Optimalizace pro externí zdroje (mapy, ikony)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.openstreetmap.org',
      }, {
        protocol: 'https',
        hostname: '*.tile.openstreetmap.org',
      },
      {
        protocol: 'https',
        hostname: 'unpkg.com',
      }
    ],
  },

  // Experimentální funkce
  experimental: {
    optimizePackageImports: ['leaflet'],
  },

  // Turbopack konfigurace (nyní stabilní)
  turbopack: {
    // Turbopack specifické nastavení
  },
};

export default nextConfig;
