/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // swcMinify is always on in Next.js 15
  images: {
    domains: ['cdn.jsdelivr.net'], // 允许从 CDN 加载字体
  },
  outputFileTracingRoot: __dirname,
};

module.exports = nextConfig; 