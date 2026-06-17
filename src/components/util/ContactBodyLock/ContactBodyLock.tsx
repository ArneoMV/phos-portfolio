"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Adds the `contact-lock` class to <body> while on the /kontakt route and
 * removes it everywhere else. Pairs with the scoped globals.css rule
 * `@media (max-width: 520px) { body.contact-lock { overflow-y: hidden } }` so the
 * one-screen Contact page doesn't scroll on mobile — without touching scroll on
 * any other route or above 520px. Renders nothing.
 */
export default function ContactBodyLock() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/kontakt") return;
    document.body.classList.add("contact-lock");
    // Always clean up on unmount or when the pathname changes away from /kontakt
    // so the class never leaks to another route.
    return () => document.body.classList.remove("contact-lock");
  }, [pathname]);

  return null;
}
