// const dotenv = require('dotenv');
// dotenv.config({ path: '.env.github' });

const nextConfig = {
  // output: 'export',
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  env: {
    WORK_ENV: process.env.WORK_ENV,
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
