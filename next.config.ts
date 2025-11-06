import { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload'
import { RemotePattern } from 'next/dist/shared/lib/image-config';


const nextConfig: NextConfig = {
  // Your Next.js config here
  experimental: {
    reactCompiler: false,
  },
  turbopack: {
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/account123/**',
      },
      {
        protocol: 'https',
        hostname: '**.another-domain.org',
        pathname: '/images/**',
      },
    ] as (URL | RemotePattern)[],
  },
};

export default withPayload(nextConfig);