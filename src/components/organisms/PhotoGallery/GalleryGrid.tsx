"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import type { FlickrPhoto } from "@/lib/flickr";
import styles from "./PhotoGallery.module.scss";
import Lightbox from "./Lightbox";

type GalleryGridProps = {
  photos: FlickrPhoto[];
};

// Matches the masonry column counts: 3 columns on Medium and up (~33vw each),
// 1 column on Small (100vw). Capped by the 1520px container.
const GALLERY_SIZES = "(min-width: 768px) 33vw, 100vw";

export default function GalleryGrid({ photos }: GalleryGridProps) {
  // null = closed; otherwise the index of the open photo.
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const close = useCallback(() => setOpenIndex(null), []);

  return (
    <>
      <div className={styles.masonry}>
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            type="button"
            className={styles.photo}
            onClick={() => setOpenIndex(i)}
            aria-label={`Open photo: ${photo.alt}`}
          >
            {/* FlickrPhoto carries real width/height, so intrinsic sizing
                preserves each photo's aspect ratio in the masonry. */}
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes={GALLERY_SIZES}
              className={styles.img}
            />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <Lightbox
          photos={photos}
          index={openIndex}
          onClose={close}
          onNavigate={setOpenIndex}
        />
      )}
    </>
  );
}
