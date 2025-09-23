/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Ensure pages are exported as directories (e.g. /events/index.html -> /events/)
  trailingSlash: true,
  reactStrictMode: true,
  experimental: {
    serverActions: { allowedOrigins: ['localhost:3000', 'charlottecarshows.com'] },
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'utfs.io' },
      { protocol: 'https', hostname: 'pub-*.supabase.co' },
    ],
  },
  async redirects() {
    return [
      // tribe list/map pages
      { source: '/events/list/:rest*', destination: '/events/', permanent: true },
      { source: '/events/map/:rest*', destination: '/events/', permanent: true },

      // old dated event URLs (both /event/... and /events/...)
      { source: '/event/:slug/:date/:rest*', destination: '/events/', permanent: true },
      { source: '/events/:slug/:date/:rest*', destination: '/events/', permanent: true }
    ];
  },
};
export default nextConfig;