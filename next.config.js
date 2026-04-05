// const dotenv = require('dotenv');
// dotenv.config({ path: '.env.github' });

const nextConfig = {
  // output: 'export',
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  env: {
    WORK_ENV: process.env.NODE_ENV,
  },
  webpack: (config, { isServer }) => {
    // Ignore optional AWS dependencies that aren't needed for self-hosted MongoDB
    config.resolve.fallback = {
      ...config.resolve.fallback,
      aws4: false,
      '@aws-sdk/credential-providers': false,
    };

    return config;
  },
  async redirects() {
    return [
      {
        source: "/define/24/7",
        destination: "/",
        permanent: true,
      },
      {
        source: "/define/s/n",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
