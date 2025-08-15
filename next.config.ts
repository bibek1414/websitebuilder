/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Allow loading images from cdn.dummyjson.com
  images: {
    domains: ["cdn.dummyjson.com","images.unsplash.com"],
  },

  // For subdomain routing
  async rewrites() {
    // Determine if we're in production
    const isProduction = process.env.NODE_ENV === "production";
    const baseDomain = isProduction
      ? process.env.NEXT_PUBLIC_BASE_DOMAIN || "nepdora.com"
      : "localhost:3000";

    const enableSubdomainRouting = isProduction
      ? true
      : process.env.NEXT_PUBLIC_ENABLE_SUBDOMAIN_ROUTING === "true";

    if (!enableSubdomainRouting) {
      return [];
    }

    // Escape dots in domain for regex
    const escapedDomain = baseDomain.replace(/\./g, "\\.");

    return [
      {
        // Handle subdomain requests, but EXCLUDE www and main domain
        source: "/:path*",
        has: [
          {
            type: "host",
            // This regex excludes 'www' and matches only actual subdomains
            value: `(?<subdomain>(?!www)[^.]+)\\.${escapedDomain}`,
          },
        ],
        destination: "/preview?site=:subdomain&path=:path*",
      },
    ];
  },

  // Handle different domains in production
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
