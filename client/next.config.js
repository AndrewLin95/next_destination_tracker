/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: `${process.env.API_PATH_SOURCE}`,
        destination: `${process.env.API_PATH_DESTINATION}`,
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
