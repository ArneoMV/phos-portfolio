"use client";

import { usePathname } from "next/navigation";
import styles from "./Footer.module.scss";

export default function Footer() {
  const pathname = usePathname();
  // On the Contact route the bar overlays the bottom of the single-screen page
  // (out of flow) instead of reserving its own height. Every other route keeps
  // the normal in-flow bottom bar.
  const isContact = pathname === "/kontakt";
  // Homepage + project pages cap to 1100px; everything else keeps 1520px.
  const narrow = pathname === "/" || pathname.startsWith("/projekt");

  return (
    <footer
      className={`${styles.footer} ${isContact ? styles.overlay : ""}`.trim()}
    >
      <div className={`container ${narrow ? "container--narrow" : ""} ${styles.bar}`}>
        <span className={styles.copyright}>© 2026 Jeffrey Jemrić</span>
        <span className={styles.copyright}>Created by Arneo MV</span>
      </div>
    </footer>
  );
}
