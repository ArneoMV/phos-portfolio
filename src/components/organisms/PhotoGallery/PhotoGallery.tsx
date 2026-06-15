import type { FlickrPhoto } from "@/lib/flickr";
import styles from "./PhotoGallery.module.scss";
import GalleryGrid from "./GalleryGrid";

type PhotoGalleryProps = {
  photos: FlickrPhoto[];
  albumTitle: string;
};

// Server component: renders the section shell + empty state and delegates the
// interactive masonry (clickable tiles + lightbox) to the GalleryGrid client
// component. This keeps the data fetch on the server and ships only the gallery
// interactivity to the client.
export default function PhotoGallery({
  photos,
  albumTitle,
}: PhotoGalleryProps) {
  return (
    <section
      className={styles.section}
      aria-label={`${albumTitle} — photo gallery`}
    >
      <div className="container">
        {photos.length === 0 ? (
          <p className={styles.empty}>No photos in this project yet.</p>
        ) : (
          <GalleryGrid photos={photos} />
        )}
      </div>
    </section>
  );
}
