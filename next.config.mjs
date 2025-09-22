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
};
export default nextConfig;