// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // For subdomain routing in production
  async rewrites() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "(?<subdomain>.*)\\.localhost:3000",
          },
        ],
        destination: "/preview?site=:subdomain&page=:path*",
      },
    ];
  },
};

module.exports = nextConfig;
