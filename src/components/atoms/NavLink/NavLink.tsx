import Link from "next/link";
import styles from "./NavLink.module.scss";

type NavLinkProps = {
  href: string;
  label: string;
  /** When active, four yellow corner brackets frame the label. */
  active?: boolean;
};

// Four L-shaped corner brackets. Inlined from public/images/icons/*.svg with
// stroke="currentColor" so they inherit the active link's (yellow) color.
const CORNERS = [
  { cls: "cornerTL", d: "M0.5 4.5L0.5 0.5L4.5 0.5" }, // upper-Left
  { cls: "cornerTR", d: "M0.5 0.5H4.5V4.5" }, // Upper-Right
  { cls: "cornerBL", d: "M4.5 4.5L0.5 4.5L0.5 0.5" }, // Bottom-Left
  { cls: "cornerBR", d: "M4.5 0.5L4.5 4.5L0.5 4.5" }, // Bottom-Right
] as const;

export default function NavLink({ href, label, active = false }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={[styles.navLink, active ? styles.active : null]
        .filter(Boolean)
        .join(" ")}
      aria-current={active ? "page" : undefined}
    >
      {label}
      {active &&
        CORNERS.map(({ cls, d }) => (
          <svg
            key={cls}
            className={`${styles.corner} ${styles[cls]}`}
            viewBox="0 0 5 5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d={d} />
          </svg>
        ))}
    </Link>
  );
}
