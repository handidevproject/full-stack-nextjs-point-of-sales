import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },
    devIndicators: false,
    images: {
        domains: ['https://agjsdosiwtwjwmnflgwc.supabase.co'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'agjsdosiwtwjwmnflgwc.supabase.co',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
