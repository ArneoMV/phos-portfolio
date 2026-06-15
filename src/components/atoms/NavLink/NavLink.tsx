import Link from "next/link";
import styles from "./NavLink.module.scss";

type NavLinkProps = {
  href: string;
  label: string;
  /** When active, the label is wrapped in [ ] brackets. */
  active?: boolean;
};

export default function NavLink({ href, label, active = false }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={[styles.navLink, active ? styles.active : null]
        .filter(Boolean)
        .join(" ")}
      aria-current={active ? "page" : undefined}
    >
      {active ? `[ ${label} ]` : label}
    </Link>
  );
}
