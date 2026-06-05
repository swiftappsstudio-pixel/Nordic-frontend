const nextConfig = {
  experimental: {
    turbo: undefined,
  },
  images: {
    unoptimized: true,

    remotePatterns: [
      // Local development
      {
        protocol: "http",
        hostname: "localhost",
        port: "3100",
        pathname: "/uploads/**",
      },
      // Production (keep for when deploying live)
      {
        protocol: "https",
        hostname: "papayawhip-leopard-118040.hostingersite.com",
        pathname: "/uploads/**",
      },
    ],
  },
};

module.exports = nextConfig;