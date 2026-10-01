/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "media.gemlightbox.com" },
      { protocol: "https", hostname: "static.cloud.picupmedia.com" },
    ],
  },
  // /catalog used to be the full browse-all grid (now at /shop); the
  // homepage itself has since moved on to the collections view. Keep old
  // links (already shared/bookmarked) working instead of 404ing.
  async redirects() {
    return [
      { source: "/catalog", destination: "/shop", permanent: true },
      { source: "/catalog/product/:slug", destination: "/product/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
