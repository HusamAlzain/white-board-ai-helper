/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: [
    '@dnd-kit/core',
    '@dnd-kit/modifiers',
    'framer-motion',
    'lucide-react'
  ],
  images: {
    domains: ['lovable.dev'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
}

module.exports = nextConfig