// TEMPORARY — delete after verifying Flickr data.
//
// NOTE: the on-disk folder is `%5Fflickrtest` (URL-encoded underscore). A plain
// `_flickrtest` folder is a Next.js *private folder* and is excluded from
// routing (would 404). The `%5F` prefix is the documented way to expose a URL
// segment that starts with an underscore, so this serves at `/api/_flickrtest`.
//
// GET /api/_flickrtest            → album count + summary of each album.
// GET /api/_flickrtest?slug=<s>   → also resolves that album and its photos,
//                                   so getAlbumBySlug + getAlbumPhotos can be
//                                   verified end-to-end in a browser.

import { NextResponse } from "next/server";
import {
  getAlbums,
  getAlbumBySlug,
  getAlbumPhotos,
} from "@/lib/flickr";

// TEMPORARY (testing only): always fetch live Flickr state, bypassing ISR.
// Route-level force-dynamic keeps the route from being statically cached, and
// the `{ noStore: true }` opts below force the underlying fetches to no-store.
// The real pages keep the 3600s revalidate from lib/flickr.ts.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const albums = await getAlbums({ noStore: true });

    const summary = {
      albumCount: albums.length,
      albums: albums.map((a) => ({
        slug: a.slug,
        title: a.title,
        photoCount: a.photoCount,
        cover: Boolean(a.cover),
      })),
    };

    const slug = new URL(request.url).searchParams.get("slug");
    if (!slug) {
      return NextResponse.json(summary);
    }

    const album = await getAlbumBySlug(slug, { noStore: true });
    if (!album) {
      return NextResponse.json(
        { ...summary, requestedSlug: slug, found: false },
        { status: 404 },
      );
    }

    const photos = await getAlbumPhotos(album.id, { noStore: true });
    const first = photos[0];

    return NextResponse.json({
      ...summary,
      requestedSlug: slug,
      found: true,
      album: {
        id: album.id,
        slug: album.slug,
        title: album.title,
        photoCount: photos.length,
        firstPhoto: first
          ? { src: first.src, width: first.width, height: first.height }
          : null,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
