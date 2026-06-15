import "server-only";

/**
 * Server-side Flickr data layer.
 *
 * Albums (photosets) map 1:1 to projects. This module reads the server-only
 * FLICKR_API_KEY / FLICKR_USER_ID env vars and talks to the Flickr REST API,
 * using the App Router fetch cache for ISR. It must never be imported into a
 * client component — the `server-only` import above enforces that at build time.
 */

// ---------------------------------------------------------------------------
// Public domain types
// ---------------------------------------------------------------------------

export interface FlickrPhoto {
  id: string;
  title: string;
  src: string; // grid/thumb size URL (Large 1024 `_l`, falling back smaller)
  width: number;
  height: number;
  // Higher-res variant for the fullscreen lightbox so the enlarged image isn't
  // blurry: Large-2048 `_k` → Large-1600 `_h` → Large-1024 `_l`, falling back to
  // `src` when none of those are present.
  large: string;
  largeWidth: number;
  largeHeight: number;
  alt: string;
}

export interface FlickrAlbumCover {
  src: string;
  // Optional: the deterministic static-URL cover has no dimensions; they're
  // only present when Flickr returned a sized primary photo.
  width?: number;
  height?: number;
}

export interface FlickrAlbum {
  id: string; // photoset_id
  slug: string; // derived from title
  title: string;
  description: string;
  photoCount: number;
  cover: FlickrAlbumCover | null; // primary photo of the album
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const REVALIDATE = 3600; // seconds; auto-sync interval. Tune later.

// ---------------------------------------------------------------------------
// Raw Flickr JSON shapes (internal — not exported). Dynamic size fields like
// `url_l` / `width_l` / `height_l` are read via an `unknown` index signature
// and narrowed in `pickSize`.
// ---------------------------------------------------------------------------

interface RawText {
  _content: string;
}

interface FlickrBase {
  stat: string;
  code?: number;
  message?: string;
}

interface RawPhotoset {
  id: string;
  title: RawText;
  description: RawText;
  photos: number | string;
  // Always present — used to build the cover URL deterministically.
  primary?: string;
  secret?: string;
  server?: string | number;
  [key: string]: unknown; // url_l, width_l, height_l, _c / _m variants…
}

interface RawPhoto {
  id: string;
  title: string;
  media?: string;
  [key: string]: unknown; // url_l, width_l, height_l, _c / _m / _o variants…
}

interface GetListResponse {
  photosets?: { photoset?: RawPhotoset[] };
}

interface GetPhotosResponse {
  photoset?: { photo?: RawPhoto[] };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Cache control for a call. Real pages use the default (ISR, REVALIDATE secs);
 * the temporary test route passes `{ noStore: true }` to always see live state.
 */
export interface CacheOpts {
  noStore?: boolean;
}

function requireEnv(name: "FLICKR_API_KEY" | "FLICKR_USER_ID"): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing ${name} environment variable. Add it to .env.local (server-only, no NEXT_PUBLIC prefix).`,
    );
  }
  return value;
}

/**
 * Pick the best available size from a raw Flickr object, trying each suffix in
 * order (e.g. ["l","c","m"] = Large → Medium-800 → Medium-500). Returns the URL
 * with its matching width/height, or null if none of the sizes are present.
 */
function pickSize(
  obj: Record<string, unknown>,
  suffixes: readonly string[],
): { src: string; width: number; height: number } | null {
  for (const suffix of suffixes) {
    const url = obj[`url_${suffix}`];
    if (typeof url === "string" && url.length > 0) {
      const width = Number(obj[`width_${suffix}`]);
      const height = Number(obj[`height_${suffix}`]);
      return {
        src: url,
        width: Number.isFinite(width) ? width : 0,
        height: Number.isFinite(height) ? height : 0,
      };
    }
  }
  return null;
}

/**
 * Build an album cover. Prefers a real sized URL (with dimensions) when Flickr
 * returned one via primary_photo_extras; otherwise derives the URL
 * DETERMINISTICALLY from server/primary/secret, which are always present on a
 * photoset. Returns null only if those base fields are somehow missing — so in
 * practice every album gets a cover and none is dropped for lack of one.
 */
function buildCover(set: RawPhotoset): FlickrAlbumCover | null {
  const sized = pickSize(set, ["l", "c", "m"]);
  if (sized) return sized;

  const { primary, secret, server } = set;
  if (
    typeof primary === "string" &&
    primary.length > 0 &&
    typeof secret === "string" &&
    secret.length > 0 &&
    server != null &&
    String(server).length > 0
  ) {
    // `_b` = 1024px on the long edge — good for cards.
    return {
      src: `https://live.staticflickr.com/${server}/${primary}_${secret}_b.jpg`,
    };
  }
  return null;
}

const DIACRITICS: Record<string, string> = {
  č: "c",
  ć: "c",
  š: "s",
  ž: "z",
  đ: "d",
};

/**
 * Slugify a title: lowercase, transliterate Croatian diacritics, collapse any
 * run of non-alphanumerics into a single "-", and trim leading/trailing "-".
 * Pure function.
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[čćšžđ]/g, (ch) => DIACRITICS[ch] ?? ch)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Build the REST URL, fetch (with ISR caching), and validate the in-body
 * `stat`. Flickr returns HTTP 200 even for API errors, signalling failure via
 * `stat !== "ok"` plus a `code`/`message`.
 */
async function flickrFetch<T>(
  method: string,
  params: Record<string, string>,
  opts: CacheOpts = {},
): Promise<T & FlickrBase> {
  const apiKey = requireEnv("FLICKR_API_KEY");

  const search = new URLSearchParams({
    method,
    api_key: apiKey,
    format: "json",
    nojsoncallback: "1",
    ...params,
  });
  const url = `https://api.flickr.com/services/rest/?${search.toString()}`;

  const init: RequestInit & { next?: { revalidate?: number } } = opts.noStore
    ? { cache: "no-store" }
    : { next: { revalidate: REVALIDATE } };

  let res: Response;
  try {
    res = await fetch(url, init);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(
      `Flickr request to ${method} failed (network/TLS). If this is a certificate error, NODE_EXTRA_CA_CERTS is likely unset or wrong. Cause: ${message}`,
    );
  }

  if (!res.ok) {
    throw new Error(`Flickr request to ${method} returned HTTP ${res.status}.`);
  }

  const data = (await res.json()) as T & FlickrBase;
  if (data.stat !== "ok") {
    throw new Error(
      `Flickr API error for ${method}: [${data.code ?? "?"}] ${
        data.message ?? "unknown error"
      }`,
    );
  }
  return data;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Fetch all albums (photosets) for the configured user, in Flickr's order.
 * Slugs are guaranteed unique (later collisions get a short id disambiguator).
 */
export async function getAlbums(opts: CacheOpts = {}): Promise<FlickrAlbum[]> {
  const userId = requireEnv("FLICKR_USER_ID");

  const data = await flickrFetch<GetListResponse>(
    "flickr.photosets.getList",
    {
      user_id: userId,
      // Optional: when present we prefer the real sized cover (with dims);
      // otherwise buildCover() derives the URL from server/primary/secret.
      primary_photo_extras: "url_l,url_c,url_m",
    },
    opts,
  );

  const photosets = data.photosets?.photoset ?? [];
  const seenSlugs = new Set<string>();
  const albums: FlickrAlbum[] = [];

  for (const set of photosets) {
    const title = set.title?._content ?? "";

    let slug = slugify(title);
    if (slug === "") slug = `album-${set.id}`;
    // Disambiguate collisions so every slug resolves to exactly one album.
    if (seenSlugs.has(slug)) slug = `${slug}-${set.id.slice(-4)}`;
    seenSlugs.add(slug);

    albums.push({
      id: set.id,
      slug,
      title,
      description: set.description?._content ?? "",
      photoCount: Number(set.photos) || 0,
      cover: buildCover(set),
    });
  }

  return albums;
}

/**
 * Resolve a clean slug back to its album. Reuses the cached getAlbums() fetch.
 */
export async function getAlbumBySlug(
  slug: string,
  opts: CacheOpts = {},
): Promise<FlickrAlbum | null> {
  const albums = await getAlbums(opts);
  return albums.find((album) => album.slug === slug) ?? null;
}

/**
 * Fetch all photos in an album, in Flickr's order. Videos are skipped.
 */
export async function getAlbumPhotos(
  albumId: string,
  opts: CacheOpts = {},
): Promise<FlickrPhoto[]> {
  const userId = requireEnv("FLICKR_USER_ID");

  const data = await flickrFetch<GetPhotosResponse>(
    "flickr.photosets.getPhotos",
    {
      photoset_id: albumId,
      user_id: userId,
      // url_h (1600) / url_k (2048) feed the lightbox's high-res image.
      extras: "url_l,url_c,url_m,url_o,url_h,url_k",
      per_page: "500",
    },
    opts,
  );

  const rawPhotos = data.photoset?.photo ?? [];
  const photos: FlickrPhoto[] = [];

  for (const raw of rawPhotos) {
    // Ignore videos when the media field is present and not "photo".
    if (typeof raw.media === "string" && raw.media !== "photo") continue;

    const size = pickSize(raw, ["l", "c", "m", "o"]);
    if (!size) continue; // no usable size URL — skip rather than emit a broken img

    // Prefer the biggest available size for the lightbox; fall back to the grid
    // size. (Originals `_o` are intentionally excluded here — they can be huge.)
    const big = pickSize(raw, ["k", "h", "l"]) ?? size;

    const title = typeof raw.title === "string" ? raw.title : "";
    photos.push({
      id: raw.id,
      title,
      src: size.src,
      width: size.width,
      height: size.height,
      large: big.src,
      largeWidth: big.width,
      largeHeight: big.height,
      alt: title.length > 0 ? title : "Photograph",
    });
  }

  return photos;
}
