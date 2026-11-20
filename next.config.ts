const nextConfig = {

  images: {
    formats: ["image/avif", "image/webp"],

    remotePatterns: [
      // Local development
{
        protocol: "https",
        hostname: "**.s3.**.amazonaws.com",
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
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  // Retired promotional campaign pages → their regular service pages.
  async redirects() {
    return [
      { source: "/world-physiotherapy-day", destination: "/physiotherapy", permanent: true },
      { source: "/world-first-aid-day", destination: "/blood-test", permanent: true },
      { source: "/world-patient-safety-day", destination: "/elderly-care", permanent: true },
      { source: "/iv-glutathione", destination: "/iv-therapy", permanent: true },
      { source: "/back-to-school-sale", destination: "/blood-test", permanent: true },
      { source: "/back-to-school-sale/:path*", destination: "/blood-test", permanent: true },
      { source: "/offers", destination: "/services", permanent: true },
    ];
  },

  async headers() {
    return [
      {
        // Static images/video/icons shipped from /public. Not content-hashed,
        // so keep the window short enough that a redeploy is visible within a day
        // while still saving repeat-visit round trips for these large media files.
        source: "/:type(images|video)/:rest*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
