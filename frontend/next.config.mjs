/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: ['eksicode-images.s3.eu-central-1.amazonaws.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'eksicode-images.s3.eu-central-1.amazonaws.com',
        pathname: '**',
      },
    ],
  },
  
};

export default nextConfig;