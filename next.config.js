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
};

module.exports = nextConfig;
