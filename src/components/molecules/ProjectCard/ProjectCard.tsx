import Link from "next/link";
import Image from "next/image";
import type { FlickrAlbum } from "@/lib/flickr";
import styles from "./ProjectCard.module.scss";

type ProjectCardProps = {
  album: FlickrAlbum;
};

// Matches the responsive column counts: 2-up on medium+ (~50vw), 1-up on small
// (100vw). The 1520px container cap makes 50vw a slight over-estimate on very
// wide screens — close enough for srcset selection.
const CARD_SIZES = "(min-width: 768px) 50vw, 100vw";

export default function ProjectCard({ album }: ProjectCardProps) {
  return (
    <Link href={`/projekt/${album.slug}`} className={styles.card}>
      <div className={styles.image}>
        {album.cover ? (
          // Deterministic cover URLs have no reliable width/height, so use
          // `fill` inside the aspect-ratio wrapper with object-fit: cover.
          <Image
            src={album.cover.src}
            alt={album.title}
            fill
            sizes={CARD_SIZES}
            className={styles.imageEl}
          />
        ) : (
          <div className={styles.placeholder} aria-hidden="true" />
        )}
        {/* Flat 13% black overlay between the image and the title. */}
        <span className={styles.overlay} aria-hidden="true" />
        <span className={styles.title}>{album.title}</span>
      </div>
    </Link>
  );
}
