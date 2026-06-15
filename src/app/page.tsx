import ProjectGrid from "@/components/organisms/ProjectGrid/ProjectGrid";
import { getAlbums, type FlickrAlbum } from "@/lib/flickr";
import styles from "./page.module.scss";

// Re-generate hourly to pick up new albums (matches the data layer's ISR).
export const revalidate = 3600;

export default async function Home() {
  let albums: FlickrAlbum[] = [];
  try {
    albums = await getAlbums();
  } catch (err) {
    // Fail gracefully: an empty grid renders its quiet empty state.
    console.error("Failed to load albums for homepage:", err);
  }

  return (
    <main className={styles.main}>
      <ProjectGrid albums={albums} />
    </main>
  );
}
