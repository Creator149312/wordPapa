/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'export',
    // trailingSlash: true,
    images: {
        domains: ['lh3.googleusercontent.com'],
    },
    env: {
        WORK_ENV: process.env.WORK_ENV,
      },
}

module.exports = nextConfig
