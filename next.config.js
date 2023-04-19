/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    appDir: true
  },
  compiler: {
    emotion: true
  }
}

module.exports = nextConfig
