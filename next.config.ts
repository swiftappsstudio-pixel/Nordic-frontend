const nextConfig = {
  output: "export",   // ⭐ IMPORTANT
  images: {
    unoptimized: true, // ⭐ required for static hosting
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3100",
        pathname: "/uploads/**",
      },
    ],
  },
};

module.exports = nextConfig;