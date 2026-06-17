import type { Metadata } from "next";
import Image from "next/image";
import styles from "./page.module.scss";

const CONTACT_EMAIL = "tomislavjeffreyjemric@gmail.com";
const INSTAGRAM_URL = "https://www.instagram.com/jeffrey.jemric";
const LINKEDIN_URL =
  "https://www.linkedin.com/in/tomislav-jeffrey-jemric-a10497204/";

export const metadata: Metadata = {
  title: "Contact — Jeffrey Jemrić",
  description:
    "Get in touch with Tomislav Jeffrey Jemrić for business inquiries.",
};

export default function ContactPage() {
  return (
    <main className={styles.main}>
      <div className={`container ${styles.inner}`}>
        {/* Jeffrey's photo — 720px tall, anchored to the very bottom. */}
        <figure className={styles.photoWrap}>
          <Image
            src="/images/jeffrey.png"
            alt="Tomislav Jeffrey Jemrić"
            width={973}
            height={1685}
            sizes="(min-width: 768px) 420px, 80vw"
            className={styles.photo}
            priority
          />
        </figure>

        {/* Email + subtitle, lower-middle beside the photo. */}
        <div className={styles.text}>
          <a className={styles.email} href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          <p className={styles.subtitle}>
            For business inquiries, please contact me at this email.
          </p>

          {/* Social links in the page body (Instagram left, Linkedin right). */}
          <div className={styles.socials}>
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
              Linkedin
            </a>
          </div>
        </div>
      </div>

      {/* TOP layer: translucent red gradient that washes OVER the content
          (photo + copyright). pointer-events:none so links stay clickable. */}
      <div className={styles.redWash} aria-hidden="true" />
    </main>
  );
}
