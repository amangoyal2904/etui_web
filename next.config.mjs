/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: "/etnextweball",
  rewrites() {
    return [
      {
        source: "/etnextweball/:path*",
        destination: "/:path*"
      }
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=14400, must-revalidate, stale-while-revalidate=28800"
          },
          {
            key: "Expires",
            value: new Date(Date.now() + 14400 * 1000).toUTCString()
          }
        ]
      },
      {
        source: "/etnextweball/_next/static/chunks/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, s-maxage=31536000, immutable"
          }
        ]
      }
    ];
  },
  compress: false,
  images: {
    domains: ["img.etimg.com", "economictimes.indiatimes.com"]
  }
};

export default nextConfig;
