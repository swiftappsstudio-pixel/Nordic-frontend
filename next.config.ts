/** @type {import('next').NextConfig} */
const nextConfig = {
  // `output: "export"` was removed — static export requires every dynamic route
  // (e.g. /services/[id]) to enumerate its IDs at build time via
  // generateStaticParams(), which doesn't suit an admin/booking app whose IDs
  // come from a separate API at runtime. Deploy with `next start` (Node server)
  // or to Vercel/etc., and dynamic routes work as expected.

  images: {
    unoptimized: true,

    remotePatterns: [
      {
        protocol: "https",
        hostname: "papayawhip-leopard-118040.hostingersite.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
