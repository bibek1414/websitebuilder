/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Allow loading images from cdn.dummyjson.com
  images: {
    domains: ["cdn.dummyjson.com"],
  },

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
