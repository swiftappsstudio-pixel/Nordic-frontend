const nextConfig = {
  experimental: {
    turbo: undefined,
  },
  images: {
    unoptimized: true,

    remotePatterns: [
      // Local development
{
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3100",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "papayawhip-leopard-118040.hostingersite.com",
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