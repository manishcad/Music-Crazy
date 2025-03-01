/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'i0.wp.com',
        },
        {
          protocol: 'https',
          hostname: 'www7.hiphopkit.com',
        },
        {
          protocol: 'https',
          hostname: 'upload.wikimedia.org',
        }
      ],
    },
  };
  
export default nextConfig;
  