// soft404s = require("./app/soft-404s");

const nextConfig = {
    // output: 'export',
    images: {
      domains: ["lh3.googleusercontent.com"],
    },
    env: {
      WORK_ENV: process.env.WORK_ENV,
    },
    // async redirects() {
    //   return soft404s.map((sourceURL, index) => {
    //     return { source: sourceURL, destination: "/", permanent: true };
    //   });
    // },
  };
  
  module.exports = nextConfig;
  