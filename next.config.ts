import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
      // Supabase Storage — where product photos uploaded from /admin live.
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
