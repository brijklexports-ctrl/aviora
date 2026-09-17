/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "media.gemlightbox.com" },
      { protocol: "https", hostname: "static.cloud.picupmedia.com" },
    ],
  },
  // The catalog used to live at /catalog before it became the homepage.
  // Keep old links (already shared/bookmarked) working instead of 404ing.
  async redirects() {
    return [
      { source: "/catalog", destination: "/", permanent: true },
      { source: "/catalog/product/:slug", destination: "/product/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
