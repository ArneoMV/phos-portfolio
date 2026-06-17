"use client";

import { usePathname } from "next/navigation";
import Logo from "@/components/atoms/Logo/Logo";
import NavLink from "@/components/atoms/NavLink/NavLink";
import styles from "./Header.module.scss";

const INSTAGRAM_URL = "https://www.instagram.com/jeffrey.jemric";
const LINKEDIN_URL =
  "https://www.linkedin.com/in/tomislav-jeffrey-jemric-a10497204/";
const CONTACT_ROUTE = "/kontakt";

export default function Header() {
  const pathname = usePathname();
  // Active on the contact route (and any nested path under it).
  const contactActive = pathname === CONTACT_ROUTE;

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        {/* LEFT: social links (open in a new tab). */}
        <nav className={styles.left} aria-label="Social">
          <a
            className={styles.socialLink}
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
          <a
            className={styles.socialLink}
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </nav>

        {/* CENTER: "Jeffrey" spray-font wordmark, links home. */}
        <div className={styles.center}>
          <Logo />
        </div>

        {/* RIGHT: Contact — links to the contact page, bracketed when active. */}
        <div className={styles.right}>
          <NavLink
            href={CONTACT_ROUTE}
            label="Contact"
            active={contactActive}
          />
        </div>
      </div>
    </header>
  );
}
