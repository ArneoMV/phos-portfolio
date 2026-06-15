import Link from "next/link";
import styles from "./Breadcrumb.module.scss";

type BreadcrumbProps = {
  /** The current project title, shown after "Home >". */
  title: string;
};

// Icons inlined from public/images/icons/*.svg with fill="currentColor" so they
// inherit the breadcrumb's white text color (theme-robust).
function ArrowBackIcon() {
  return (
    <svg
      className={styles.arrowIcon}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M16.6654 9.16665H6.5237L11.182 4.50831L9.9987 3.33331L3.33203 9.99998L9.9987 16.6666L11.1737 15.4916L6.5237 10.8333H16.6654V9.16665Z"
        fill="currentColor"
      />
    </svg>
  );
}

function TriangleIcon() {
  return (
    <svg
      className={styles.triangleIcon}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7.5 6.50888C7.5 5.95207 8.17321 5.67321 8.56694 6.06694L12.0581 9.55806C12.3021 9.80214 12.3021 10.1979 12.0581 10.4419L8.56694 13.9331C8.17321 14.3268 7.5 14.0479 7.5 13.4911L7.5 6.50888Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Breadcrumb({ title }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
      <ol className={styles.list}>
        <li className={styles.item}>
          {/* arrow_back + "Home" together are the back link to "/". */}
          <Link href="/" className={styles.back}>
            <ArrowBackIcon />
            <span className={styles.home}>Home</span>
          </Link>
        </li>
        <li className={styles.item}>
          <TriangleIcon />
          <span className={styles.current} aria-current="page">
            {title}
          </span>
        </li>
      </ol>
    </nav>
  );
}
