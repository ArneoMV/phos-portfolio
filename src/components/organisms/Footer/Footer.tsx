import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.bar}`}>
        <span className={styles.copyright}>
          © 2026 Arneo MV All rights reserved
        </span>
      </div>
    </footer>
  );
}
