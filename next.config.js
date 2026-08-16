/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['localhost:3000', '127.0.0.1:3000', '10.170.130.189:3000', 'localhost', '127.0.0.1'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'pestcontrolbengaluru.in',
      },
    ],
  },
  async redirects() {
    return [
      // 301 permanent redirect: /blogs/:slug → /:slug
      {
        source: '/blogs/:slug',
        destination: '/:slug',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
