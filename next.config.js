/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  assetPrefix: isProd ? '/openzepplin-payment-splitter' : '',
  reactStrictMode: true,
}

module.exports = nextConfig
