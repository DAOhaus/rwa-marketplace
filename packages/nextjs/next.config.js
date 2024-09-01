/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check
const fs = require("fs");
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  eslint: {
    ignoreDuringBuilds: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  // devServer: devServerConfig => {
  //   devServerConfig.https = {
  //     key: fs.readFileSync(path.join(__dirname, "dev.kinto.xyz+2-key.pem")),
  //     cert: fs.readFileSync(path.join(__dirname, "dev.kinto.xyz+2.pem")),
  //   };
  //   return devServerConfig;
  // },
};

module.exports = nextConfig;
