import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Disable Edge runtime globally - use Node.js for all routes
  experimental: {
    // Ensure we don't accidentally use Edge features
  },
  // Optimize images to reduce requests
  images: {
    unoptimized: true, // Disable Vercel Image Optimization (uses Edge)
  },
  // Generate static pages where possible
  output: 'standalone',
};

export default nextConfig;
