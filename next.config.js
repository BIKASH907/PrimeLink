/** @type {import('next').NextConfig} */

// =====================================================
// BHAT OVERSEAS is now native Next.js inside this project.
// All BHAT pages live under /pages/bhat/* and /pages/api/bhat/*.
// /turkey and /romania are convenience redirect pages.
// =====================================================

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'],
  },
  // Bilingual routing: Romanian is the default (served at /), English at /en.
  // localeDetection is disabled so the URL is the single source of truth —
  // visitors land on the Romanian site unless they explicitly navigate to /en.
  i18n: {
    locales: ['ro', 'en'],
    defaultLocale: 'ro',
    localeDetection: false,
  },
};

module.exports = nextConfig;
