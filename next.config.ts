import type { NextConfig } from "next";

// GitHub Pages serves the site from /<repo>/, so production builds need that prefix.
// Set NEXT_PUBLIC_BASE_PATH="" for a custom domain or a <user>.github.io repo.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? (process.env.NODE_ENV === "production" ? "/TheAffair" : "");

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
