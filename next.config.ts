import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  sassOptions: {
    // Lets any *.module.scss do `@use "mixins"`, `@use "grid"`, etc. without
    // long relative paths back to src/styles.
    loadPaths: [path.join(process.cwd(), "src", "styles")],
  },
  images: {
    // Flickr serves images from live.staticflickr.com and farm hosts.
    remotePatterns: [{ protocol: "https", hostname: "**.staticflickr.com" }],
  },
};

export default nextConfig;
