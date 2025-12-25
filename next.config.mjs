/**
 * @format
 * @type {import('next').NextConfig}
 */

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "192.168.10.18",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.akamai.steamstatic.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "69.62.70.69",
        port: "5005",
        pathname: "/**",
      },
    ],
  },
  // Proxy API requests to bypass Mixed Content errors
  async rewrites() {
    const backendUrl = process.env.BACKEND_API_URL;

    // Only add rewrite if BACKEND_API_URL is defined
    if (!backendUrl) {
      return [];
    }

    return [
      {
        source: "/api/backend/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
