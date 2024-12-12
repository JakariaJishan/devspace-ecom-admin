/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "same-origin allow-popups",
          },
        ],
      },
    ];
  },
  images: {
    domains: ['localhost'], // Add localhost for next/image support
  },
};

export default nextConfig;