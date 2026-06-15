import Link from "next/link";
import styles from "./Logo.module.scss";

type LogoProps = {
  className?: string;
};

export default function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      className={[styles.logo, className].filter(Boolean).join(" ")}
      aria-label="Jeffrey — home"
    >
      Jeffrey
    </Link>
  );
}
