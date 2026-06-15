import type { Metadata } from "next";
import AboutIntro from "@/components/organisms/AboutIntro/AboutIntro";
import styles from "./page.module.scss";

export const metadata: Metadata = {
  title: "About — Jeffrey Jemrić",
};

export default function AboutPage() {
  return (
    <main className={styles.main}>
      <AboutIntro />
    </main>
  );
}
