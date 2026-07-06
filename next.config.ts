import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
      // Add your real image host(s) here, e.g. Supabase storage or Cloudinary.
    ],
  },
};

export default nextConfig;
