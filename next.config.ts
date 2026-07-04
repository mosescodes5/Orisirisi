import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      // Add your real image host(s) here, e.g. Supabase storage or Cloudinary.
    ],
  },
};

export default nextConfig;
