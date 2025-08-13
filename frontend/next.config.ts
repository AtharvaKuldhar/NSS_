import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [{
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '', // You can leave this empty if there is no port
        pathname: '/dui7k9r52/image/upload/**', // This is the crucial part
      },
    ]
  }
};

export default nextConfig;
