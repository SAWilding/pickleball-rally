/** @type {import('next').NextConfig} */
const nextConfig = {
  publicRuntimeConfig: {
    MAPS_API_KEY: process.env.MAPS_API_KEY,
  },
};

module.exports = nextConfig;
