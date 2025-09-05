/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ['@supabase/supabase-js'],
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Handle locale routing without i18n config to prevent build issues
  async rewrites() {
    return [
      {
        source: '/:locale(en|hi|ta|te|bn|mr|ur)/blog/:slug',
        destination: '/blog/:slug?locale=:locale',
      },
      {
        source: '/:locale(en|hi|ta|te|bn|mr|ur)/blog',
        destination: '/blog?locale=:locale',
      },
    ]
  },
}

module.exports = nextConfig