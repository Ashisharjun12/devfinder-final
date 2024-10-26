/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['www.gravatar.com', 'lh3.googleusercontent.com'],
    unoptimized: true
  },
  experimental: {
    serverActions: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        dns: false,
        fs: false,
        net: false,
        tls: false,
        'mongodb-client-encryption': false
      };
    }
    return config;
  },
  output: 'standalone',
}

module.exports = nextConfig
