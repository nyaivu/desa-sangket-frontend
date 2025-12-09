import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://owhpeptduszdqxcrfpqw.supabase.co/**")],
  },
};

export default nextConfig;
