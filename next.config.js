/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    domains: ['res.cloudinary.com'],
  },
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: '10mb',
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || `https://${process.env.VERCEL_URL}`,
  },
  trailingSlash: false,
};

module.exports = nextConfig;
