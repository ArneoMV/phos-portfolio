import ProjectCard from "@/components/molecules/ProjectCard/ProjectCard";
import type { FlickrAlbum } from "@/lib/flickr";
import styles from "./ProjectGrid.module.scss";

type ProjectGridProps = {
  albums: FlickrAlbum[];
};

export default function ProjectGrid({ albums }: ProjectGridProps) {
  return (
    <section className={styles.section}>
      <div className="container container--narrow">
        {albums.length === 0 ? (
          <p className={styles.empty}>No projects yet.</p>
        ) : (
          <ul className={styles.grid}>
            {albums.map((album) => (
              <li key={album.id} className={styles.item}>
                <ProjectCard album={album} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
