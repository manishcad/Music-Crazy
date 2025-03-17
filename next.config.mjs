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
        },
        {
          protocol: 'https',
          hostname: 'lh3.googleusercontent.com',
        },
        {
          protocol: 'https',
          hostname: 'assets.audiomack.com',
        },
        {
          protocol: 'https',
          hostname: '**', // Allows images from any HTTPS source
        },
      ],
    },
  };
  
export default nextConfig;
  