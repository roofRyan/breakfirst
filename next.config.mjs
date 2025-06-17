/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true,
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com",
      },
      {
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "uloovevsxexvvyxpsjni.supabase.co",
      },
    ],
  },
};

export default nextConfig;
