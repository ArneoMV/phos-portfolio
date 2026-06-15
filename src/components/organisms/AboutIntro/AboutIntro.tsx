import styles from "./AboutIntro.module.scss";

export default function AboutIntro() {
  return (
    <>
      {/* Dark hero: portrait placeholder + big overlapping heading. */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.portrait} aria-hidden="true" />
          <p className={styles.heroIntro}>
            {/* TODO: real intro copy. */}
            Placeholder intro line — a short sentence about who Jeffrey is and
            the kind of stories he likes to tell through a lens.
          </p>
          <h1 className={styles.heroHeading}>ABOUT JEFFREY</h1>
        </div>
      </section>

      {/* Light body section. */}
      <section className={styles.body}>
        <div className={`container ${styles.bodyInner}`}>
          <div className={styles.row}>
            <p className={styles.paragraph}>
              {/* TODO: real bio paragraph 1. */}
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco.
            </p>
            <div className={styles.portraitLight} aria-hidden="true" />
          </div>

          <div className={styles.row}>
            <div className={styles.camera} aria-hidden="true" />
            <p className={styles.paragraph}>
              {/* TODO: real bio paragraph 2. */}
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
