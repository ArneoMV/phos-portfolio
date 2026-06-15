"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { FlickrPhoto } from "@/lib/flickr";
import styles from "./Lightbox.module.scss";

type LightboxProps = {
  photos: FlickrPhoto[];
  index: number;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
};

// Wrap an index into [0, length) so navigation loops both ways.
function wrap(i: number, length: number): number {
  return ((i % length) + length) % length;
}

export default function Lightbox({
  photos,
  index,
  onClose,
  onNavigate,
}: LightboxProps) {
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  // Element focused before opening, so focus can be returned on close.
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const count = photos.length;
  const goPrev = useCallback(
    () => onNavigate(wrap(index - 1, count)),
    [index, count, onNavigate],
  );
  const goNext = useCallback(
    () => onNavigate(wrap(index + 1, count)),
    [index, count, onNavigate],
  );

  // Portal target only exists in the browser; flip on after first paint.
  useEffect(() => setMounted(true), []);

  // Lock background scroll while open; restore the prior value on close.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Capture + restore focus, and move focus to the close button on open.
  useEffect(() => {
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => restoreFocusRef.current?.focus();
  }, []);

  // Keyboard: Esc closes, Left/Right navigate (wrapping).
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, goPrev, goNext]);

  if (!mounted || count === 0) return null;

  const current = photos[index];
  const prevPhoto = photos[wrap(index - 1, count)];
  const nextPhoto = photos[wrap(index + 1, count)];
  // With 2 photos prev === next; only render one peeking neighbor then.
  const showTwoNeighbors = count > 2;

  return createPortal(
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={`Image ${index + 1} of ${count}`}
      // Clicking the backdrop (anything that isn't the focused image or a
      // button) closes. Buttons/image stop propagation below.
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        className={styles.close}
        aria-label="Close"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <CloseIcon />
      </button>

      <button
        type="button"
        className={`${styles.nav} ${styles.navPrev}`}
        aria-label="Previous"
        onClick={(e) => {
          e.stopPropagation();
          goPrev();
        }}
      >
        <ArrowIcon direction="left" />
      </button>

      {/* Peeking neighbors — cropped vertical slivers pinned to the screen
          edges. Purely decorative; the arrows navigate. They use the smaller
          grid src and ignore pointer events so clicks fall through to close. */}
      {prevPhoto && (
        // eslint-disable-next-line @next/next/no-img-element -- decorative cropped sliver, no optimizer needed
        <img
          src={prevPhoto.src}
          alt=""
          aria-hidden="true"
          className={`${styles.peek} ${styles.peekPrev}`}
        />
      )}
      {showTwoNeighbors && nextPhoto && (
        // eslint-disable-next-line @next/next/no-img-element -- decorative cropped sliver, no optimizer needed
        <img
          src={nextPhoto.src}
          alt=""
          aria-hidden="true"
          className={`${styles.peek} ${styles.peekNext}`}
        />
      )}

      {/* Centered focused image, in the band between the close chip and the
          bottom margin, inset by the neighbor peek + gap on each side. */}
      <div className={styles.stage}>
        {/* High-res focused image. Clicking it must NOT close. */}
        <Image
          key={current.id}
          src={current.large}
          alt={current.alt}
          width={current.largeWidth}
          height={current.largeHeight}
          sizes="90vw"
          className={styles.focused}
          priority
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      <button
        type="button"
        className={`${styles.nav} ${styles.navNext}`}
        aria-label="Next"
        onClick={(e) => {
          e.stopPropagation();
          goNext();
        }}
      >
        <ArrowIcon direction="right" />
      </button>
    </div>,
    document.body,
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  // Full arrow (shaft + head). Sized via CSS (.nav svg). Mirror the geometry for
  // the right arrow. Rendered as two stacked paths — a thicker dark #303001
  // underlay (the "outline") with the yellow fill path on top — the SVG
  // equivalent of the card title's fill + stroke. Drop shadow is a CSS filter.
  const d =
    direction === "left"
      ? "M20 12H4M4 12l7-7M4 12l7 7"
      : "M4 12h16M20 12l-7-7M20 12l-7 7";
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path className={styles.arrowOutline} d={d} />
      <path className={styles.arrowFill} d={d} />
    </svg>
  );
}
