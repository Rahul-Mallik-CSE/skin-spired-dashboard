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
};

export default nextConfig;
