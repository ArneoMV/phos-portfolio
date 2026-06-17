import type { MetadataRoute } from "next";

// Served at /manifest.webmanifest; Next auto-adds <link rel="manifest">.
// The android-chrome icons live in public/images/favicon_io/.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Jeffrey Jemrić — Photography",
    short_name: "Jeffrey",
    icons: [
      {
        src: "/images/favicon_io/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/favicon_io/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    theme_color: "#000000",
    background_color: "#000000",
    display: "standalone",
  };
}
