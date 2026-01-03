/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["http://172.24.217.41:3000", "http://localhost:3000"],
  // Fix lockfile warning:
  turbopack: {
    root: __dirname, // or '/home/jojou/frontend/mealstore/meal-store'
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.themealdb.com",
        pathname: "/images/**",
      },
    ],
  },
};

module.exports = nextConfig;
