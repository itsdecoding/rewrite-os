/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: '/studio', destination: '/home' },
      { source: '/studio/home', destination: '/home' },
      { source: '/studio/content', destination: '/content' },
      { source: '/studio/content/:id*', destination: '/content/:id*' },
      { source: '/studio/tasks', destination: '/tasks' },
      { source: '/studio/calendar', destination: '/calendar' },
      { source: '/studio/discover', destination: '/discover' },
      { source: '/studio/insights', destination: '/insights' },
      { source: '/studio/settings', destination: '/settings' },
      { source: '/studio/api/:path*', destination: '/api/:path*' },
    ];
  },
  async redirects() {
    return [
      { source: '/home', destination: '/studio/home', permanent: false },
      { source: '/content', destination: '/studio/content', permanent: false },
      { source: '/tasks', destination: '/studio/tasks', permanent: false },
      { source: '/calendar', destination: '/studio/calendar', permanent: false },
      { source: '/discover', destination: '/studio/discover', permanent: false },
      { source: '/insights', destination: '/studio/insights', permanent: false },
      { source: '/settings', destination: '/studio/settings', permanent: false },
    ];
  },
};

export default nextConfig;
