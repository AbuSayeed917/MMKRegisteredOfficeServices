import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output for Docker / Railway deployment
  output: "standalone",

  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: true,
  },
};

export default nextConfig;
