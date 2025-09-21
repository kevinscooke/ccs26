/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
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