import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { nunitoSans, aerosoldier } from "@/lib/fonts";
import Header from "@/components/organisms/Header/Header";
import Footer from "@/components/organisms/Footer/Footer";
import GridOverlay from "@/components/dev/GridOverlay/GridOverlay";
import "./globals.css";
import "@/styles/utilities.scss";

export const metadata: Metadata = {
  title: "Jeffrey Jemrić — Photography",
  description:
    "Portfolio of Jeffrey Jemrić, independent photographer based in Croatia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${nunitoSans.variable} ${aerosoldier.variable}`}
    >
      <body>
        <Header />
        {children}
        <Footer />
        {process.env.NODE_ENV !== "production" && <GridOverlay />}
        <Analytics />
      </body>
    </html>
  );
}
