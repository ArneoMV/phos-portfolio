import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/molecules/Breadcrumb/Breadcrumb";
import PhotoGallery from "@/components/organisms/PhotoGallery/PhotoGallery";
import {
  getAlbums,
  getAlbumBySlug,
  getAlbumPhotos,
  type FlickrPhoto,
} from "@/lib/flickr";
import styles from "./page.module.scss";

// Hourly ISR, same cadence as the homepage and the data layer.
export const revalidate = 3600;

// Pre-build the known album routes. Resilient: if Flickr is unreachable at
// build time, return [] and the pages render on-demand instead.
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const albums = await getAlbums();
    return albums.map((album) => ({ slug: album.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const album = await getAlbumBySlug(slug);
    if (album) {
      return {
        title: album.title,
        description: album.description || undefined,
      };
    }
  } catch {
    // fall through to the default below
  }
  return { title: "Project — Jeffrey Jemrić" };
}

// Next.js 16: params is a Promise and must be awaited.
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // A missing album → 404. (A network failure here propagates to the error
  // boundary; only the photo fetch below degrades to an empty state.)
  const album = await getAlbumBySlug(slug);
  if (!album) notFound();

  let photos: FlickrPhoto[] = [];
  try {
    photos = await getAlbumPhotos(album.id);
  } catch (err) {
    console.error(`Failed to load photos for album ${album.id}:`, err);
  }

  return (
    <main className={styles.main}>
      <div className={`container container--narrow ${styles.head}`}>
        <Breadcrumb title={album.title} />
      </div>
      <PhotoGallery photos={photos} albumTitle={album.title} />
    </main>
  );
}
