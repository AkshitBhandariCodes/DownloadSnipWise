import type { NextConfig } from "next";
import { downloadUrl } from "./content/site";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // A stable link for the latest Windows installer. Temporary (307) so a new
  // release URL takes effect immediately.
  async redirects() {
    return [{ source: "/download", destination: downloadUrl, permanent: false }];
  },
};

export default nextConfig;
