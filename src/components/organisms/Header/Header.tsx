"use client";

import { useEffect, useRef, useState } from "react";
import Logo from "@/components/atoms/Logo/Logo";
import styles from "./Header.module.scss";

// TODO: the rest of the site (cards) may show a different address; reconcile
// site-wide later. Contact copies info@jeffrey.hr per spec.
const CONTACT_EMAIL = "info@jeffrey.hr";
const INSTAGRAM_URL = "https://www.instagram.com/jeffrey.jemric";
const LINKEDIN_URL =
  "https://www.linkedin.com/in/tomislav-jeffrey-jemric-a10497204/";

/** Last-resort copy for insecure origins where navigator.clipboard is absent. */
function fallbackCopy(text: string): void {
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  } catch {
    // Ignore — the popover still shows the address for manual copying.
  }
}

/** Best-effort clipboard copy; never throws. */
function copyEmail(text: string): void {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
      return;
    }
  } catch {
    // fall through to the textarea fallback
  }
  fallbackCopy(text);
}

/**
 * "Contact" — looks like a nav link but copies the email and shows a
 * confirmation popover under it (auto-dismiss ~2.5s).
 */
function ContactCopy() {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  function handleClick() {
    copyEmail(CONTACT_EMAIL);
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className={styles.contact}>
      <button
        type="button"
        className={styles.contactButton}
        onClick={handleClick}
        aria-label="Copy email address"
      >
        Contact
      </button>
      {copied && (
        <span
          className={`${styles.popover} ${styles.popoverRight}`}
          role="status"
          aria-live="polite"
        >
          Email copied: {CONTACT_EMAIL}
        </span>
      )}
    </div>
  );
}

export default function Header() {
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

        {/* RIGHT: Contact copy-to-clipboard. */}
        <div className={styles.right}>
          <ContactCopy />
        </div>
      </div>
    </header>
  );
}
