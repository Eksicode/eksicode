/** @type {import('next').NextConfig} */
const nextConfig = {
  staticPageGenerationTimeout: 180,
  images: {
    unoptimized: true,
    domains: ['eksicode-images.s3.eu-central-1.amazonaws.com'],
  },
  experimental: {
    workerThreads: true,
    cpus: 4  // Adjust based on your system
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false
  }
};

export default nextConfig;