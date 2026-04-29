/** @type {import('next').NextConfig} */

const BHAT_OVERSEAS_URL =
  process.env.BHAT_OVERSEAS_URL || 'https://bhat-overseas-system.vercel.app';

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'],
  },

  async rewrites() {
    return [
      { source: '/bhat',           destination: `${BHAT_OVERSEAS_URL}/` },
      { source: '/bhat/:path*',    destination: `${BHAT_OVERSEAS_URL}/:path*` },
      { source: '/turkey',         destination: `${BHAT_OVERSEAS_URL}/login?country=TR` },
      { source: '/turkey/:path*',  destination: `${BHAT_OVERSEAS_URL}/:path*` },
      { source: '/romania',        destination: `${BHAT_OVERSEAS_URL}/login?country=RO` },
      { source: '/romania/:path*', destination: `${BHAT_OVERSEAS_URL}/:path*` },
      { source: '/static/:path*',  destination: `${BHAT_OVERSEAS_URL}/static/:path*` },
    ];
  },
};

module.exports = nextConfig;
