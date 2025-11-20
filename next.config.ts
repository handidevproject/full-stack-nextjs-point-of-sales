import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },
    devIndicators: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'agjsdosiwtwjwmnflgwc.supabase.co',
                pathname: '/storage/v1/object/public/**',
            },
            {
                protocol: 'https',
                hostname: 'www.eatingbirdfood.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'www.shutterstock.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'www.forkinthekitchen.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'syruvia.com',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
