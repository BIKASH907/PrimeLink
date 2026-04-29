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
};

module.exports = nextConfig;
