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
                hostname: 'agjsdosiwtwjwmnflgwc.storage.supabase.co',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'www.eatingbirdfood.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'www.shutterstock.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'www.forkinthekitchen.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'syruvia.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
