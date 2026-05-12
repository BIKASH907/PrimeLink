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
  // Bilingual routing: English is the default (served at /), Romanian at /ro.
  // localeDetection is disabled so the URL is the single source of truth —
  // visitors land on the English site unless they explicitly navigate to /ro.
  i18n: {
    locales: ['en', 'ro'],
    defaultLocale: 'en',
    localeDetection: false,
  },
};

module.exports = nextConfig;
