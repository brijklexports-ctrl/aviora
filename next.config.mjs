/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "media.gemlightbox.com" },
      { protocol: "https", hostname: "static.cloud.picupmedia.com" },
    ],
  },
};

export default nextConfig;
