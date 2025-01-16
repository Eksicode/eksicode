/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  staticPageGenerationTimeout: 180,
  generateEtags: false,
  webSocketTimeout: 30000,
  images: {
    unoptimized: true,
    domains: ['eksicode-images.s3.eu-central-1.amazonaws.com'],
  },
  experimental: {
    serverActions: true,
    workerThreads: true,
    cpus: 4  // Adjust based on your system
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false
  }
};

export default nextConfig;