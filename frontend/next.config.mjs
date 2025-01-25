/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ["eksicode-images.s3.eu-central-1.amazonaws.com"],
  },
  // compiler: {
  //   removeConsole:
  //     process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  // },
};

export default nextConfig;
