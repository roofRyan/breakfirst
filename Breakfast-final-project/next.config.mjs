/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        reactCompiler: true,
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
                hostname: "unkcufuczwcoyuuxwqli.supabase.co",
            },
        ],
    },
};

export default nextConfig;
