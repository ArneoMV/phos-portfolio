import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  experimental: {
    // Enables React's <ViewTransition> integration: Next wraps route
    // navigations in document.startViewTransition so the app/template.tsx
    // transition can animate the routed content (mobile-only slide via CSS).
    viewTransition: true,
  },
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
