/* eslint-disable @typescript-eslint/no-var-requires */
const { withSuperjson } = require('next-superjson');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = withSuperjson()(nextConfig);
