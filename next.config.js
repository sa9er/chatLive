/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  reactStrictMode: true,
  env: {
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
    secret: process.env.NEXTAUTH_SECRET
  },
  images: {
    domains: ['lh3.googleusercontent.com']
  }
}

module.exports = nextConfig
