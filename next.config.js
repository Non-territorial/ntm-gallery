
const VERCEL_BLOB_STORE_ID = process.env.BLOB_READ_WRITE_TOKEN?.match(
  /^vercel_blob_rw_([a-z0-9]+)_[a-z0-9]+$/i,
)?.[1].toLowerCase();
const VERCEL_BLOB_HOSTNAME = 'u8fdpn5uky8lbnzf.public.blob.vercel-storage.com';

const HOSTNAME_VERCEL_BLOB = VERCEL_BLOB_STORE_ID
  ? `${VERCEL_BLOB_STORE_ID}.public.blob.vercel-storage.com`
  : undefined;

const HOSTNAME_CLOUDFLARE_R2 =
  process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_DOMAIN;

const HOSTNAME_AWS_S3 =
  process.env.NEXT_PUBLIC_AWS_S3_BUCKET &&
  process.env.NEXT_PUBLIC_AWS_S3_REGION
    ? `${process.env.NEXT_PUBLIC_AWS_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_S3_REGION}.amazonaws.com`
    : undefined;

const createRemotePattern = (hostname) => hostname
  ? {
    protocol: 'https',
    hostname,
    port: '',
    pathname: '/**',
  }
  : [];

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [VERCEL_BLOB_HOSTNAME],
    imageSizes: [200],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: VERCEL_BLOB_HOSTNAME,
        port: '',
        pathname: '/**',
      },
    ].concat(createRemotePattern(HOSTNAME_CLOUDFLARE_R2))
     .concat(createRemotePattern(HOSTNAME_AWS_S3)),
    minimumCacheTTL: 31536000,
  },
  // Your existing configuration starts here
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ]
  },
  // Any other existing configuration...
};

// Export with conditional bundle analyzer
module.exports = process.env.ANALYZE === 'true'
  ? require('@next/bundle-analyzer')()(nextConfig)
  : nextConfig;