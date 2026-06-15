import { Nunito_Sans } from "next/font/google";
import localFont from "next/font/local";

// latin-ext is required for Croatian diacritics (e.g. the ć in "Jemrić").
export const nunitoSans = Nunito_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "600", "700", "800", "900"],
  // Load the true italic faces too — the card titles use 900 italic, so without
  // this the browser would have to fake the slant.
  style: ["normal", "italic"],
  variable: "--font-nunito",
  display: "swap",
});

// Spray display font for the "Jeffrey" wordmark (header logo) only.
export const aerosoldier = localFont({
  src: "../../public/font/AerosoldierSpray.woff2",
  variable: "--font-aerosoldier",
  display: "swap",
});
