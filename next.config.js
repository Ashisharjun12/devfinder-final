/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ⚠️ Warning: Enabling this will allow production builds to complete even with TS errors
    ignoreBuildErrors: true
  },
  experimental: {
    serverActions: true
  },
  output: 'standalone',
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
    unoptimized: true
  }
}

module.exports = nextConfig
