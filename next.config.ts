/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Allow loading images from cdn.dummyjson.com
  images: {
    domains: ["cdn.dummyjson.com"],
  },

  // For subdomain routing
  async rewrites() {
    const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || "localhost:3000";
    const enableSubdomainRouting =
      process.env.NEXT_PUBLIC_ENABLE_SUBDOMAIN_ROUTING === "true";

    if (!enableSubdomainRouting) {
      return [];
    }

    // Escape dots in domain for regex
    const escapedDomain = baseDomain.replace(/\./g, "\\.");

    return [
      {
        // Handle subdomain requests
        source: "/:path*",
        has: [
          {
            type: "host",
            value: `(?<subdomain>.*)\\.${escapedDomain}`,
          },
        ],
        destination: "/preview?site=:subdomain&path=:path*",
      },
    ];
  },
};

module.exports = nextConfig;
