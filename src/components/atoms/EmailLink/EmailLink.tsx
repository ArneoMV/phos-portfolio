import styles from "./EmailLink.module.scss";

type EmailLinkProps = {
  email: string;
  className?: string;
};

export default function EmailLink({ email, className }: EmailLinkProps) {
  return (
    <a
      href={`mailto:${email}`}
      className={[styles.emailLink, className].filter(Boolean).join(" ")}
    >
      {email}
    </a>
  );
}
