/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'destinationtracker.s3.amazonaws.com',
        port: '',
        pathname: '/**'
      }
    ]
  }
}

module.exports = nextConfig
