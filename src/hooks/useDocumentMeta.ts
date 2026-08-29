import { useEffect } from "react";
import seo from "../data/seo.json";

/** Keep an existing tag if the prerendered HTML already provided one. */
function setMeta(selector: string, attribute: string, name: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, name);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

/**
 * Mirrors the prerendered per-route metadata during client-side navigation.
 *
 * `scripts/generate-static-pages.mjs` writes the correct title and description
 * into each route's static HTML for crawlers. Once React takes over routing,
 * nothing updates them — so a visitor moving from OGEN to Nabat would keep the
 * previous tab title, and a bookmark would save the wrong name.
 */
export function useDocumentMeta(pathname: string): void {
  useEffect(() => {
    const normalized = pathname.replace(/\/+$/, "") || "/";
    const page = seo.pages.find((entry) => entry.path === normalized);
    if (!page) return;

    document.title = page.title;
    setMeta('meta[name="description"]', "name", "description", page.description);
    setMeta('meta[property="og:title"]', "property", "og:title", page.title);
    setMeta('meta[property="og:description"]', "property", "og:description", page.description);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${window.location.origin}${page.path}`;
  }, [pathname]);
}
