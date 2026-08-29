/**
 * Post-build step: turn the single-page bundle into one real HTML file per route.
 *
 * Crawlers — Google's first pass, and every AI crawler, none of which run
 * JavaScript — otherwise receive an empty `<div id="root">` for all ten routes,
 * with one shared title and no description. This writes a static file per route
 * carrying that route's title, description, social tags, structured data, and a
 * readable text version of the page. React replaces the body content on mount,
 * so nothing changes for real visitors.
 *
 * Also emits sitemap.xml. robots.txt is a static file in public/.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const seo = JSON.parse(readFileSync(join(root, "src/data/seo.json"), "utf8"));

const siteUrl = (process.env.VITE_SITE_URL || seo.site.defaultUrl).replace(/\/+$/, "");
/** Social crawlers need an absolute URL, and a short same-origin one fetches most reliably. */
const ogImage = seo.site.ogImage.startsWith("http")
  ? seo.site.ogImage
  : `${siteUrl}${seo.site.ogImage}`;

const escape = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const template = readFileSync(join(dist, "index.html"), "utf8");

/** Person schema on the home page; each project is a CreativeWork by that person. */
function structuredData(page) {
  const person = {
    "@type": "Person",
    name: seo.site.name,
    jobTitle: seo.site.role,
    url: siteUrl,
    email: `mailto:${seo.site.email}`,
    sameAs: [seo.site.linkedin],
    address: { "@type": "PostalAddress", addressCountry: seo.site.location },
  };

  if (page.path === "/") {
    return {
      "@context": "https://schema.org",
      "@graph": [
        { ...person, description: seo.site.bio, knowsAbout: ["UX UI Design", "Brand Identity", "Packaging Design", "Motion Graphics", "3D Design"] },
        { "@type": "WebSite", name: `${seo.site.name} — Portfolio`, url: siteUrl, author: { "@type": "Person", name: seo.site.name } },
      ],
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: page.headline,
    headline: page.title,
    description: page.description,
    url: `${siteUrl}${page.path}`,
    creator: person,
    ...(page.tags ? { keywords: page.tags.join(", ") } : {}),
  };
}

/**
 * Readable fallback content, wrapped in <noscript>.
 *
 * It sits inside `<noscript>` rather than directly in `#root` because a browser
 * paints the container's markup before the bundle executes — which showed a
 * flash of unstyled headings on every load. Inside `<noscript>` a real visitor
 * never renders it, while crawlers that don't run JavaScript still read it in
 * the raw HTML. The head metadata and JSON-LD carry the rest.
 */
function bodyContent(page) {
  const others = seo.pages
    .filter((other) => other.path !== page.path && other.path !== "/about")
    .map((other) => `<li><a href="${other.path}">${escape(other.headline)}</a></li>`)
    .join("");

  return [
    `<noscript><main data-prerendered="true">`,
    `<h1>${escape(page.headline)}</h1>`,
    page.subtitle ? `<p>${escape(page.subtitle)}</p>` : "",
    page.tags ? `<ul>${page.tags.map((tag) => `<li>${escape(tag)}</li>`).join("")}</ul>` : "",
    `<p>${escape(page.body)}</p>`,
    page.sections
      ? `<h2>Sections</h2><ul>${page.sections.map((s) => `<li>${escape(s)}</li>`).join("")}</ul>`
      : "",
    `<h2>More work by ${escape(seo.site.name)}</h2><ul>${others}</ul>`,
    `<p><a href="${seo.site.linkedin}">LinkedIn</a> · <a href="mailto:${seo.site.email}">${escape(seo.site.email)}</a></p>`,
    `</main></noscript>`,
  ]
    .filter(Boolean)
    .join("");
}

function buildPage(page) {
  const url = `${siteUrl}${page.path}`;
  // Order matters: social crawlers issue Range requests and Vercel answers with 206
  // Partial Content, so tags past roughly the first kilobyte can be missed entirely.
  // The four a preview actually needs come first; everything else follows.
  const head = [
    `<title>${escape(page.title)}</title>`,
    `<meta property="og:title" content="${escape(page.title)}" />`,
    `<meta property="og:description" content="${escape(page.description)}" />`,
    `<meta property="og:image" content="${ogImage}" />`,
    `<meta property="og:image:secure_url" content="${ogImage}" />`,
    `<meta property="og:image:type" content="image/png" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta name="description" content="${escape(page.description)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escape(seo.site.ogImageAlt)}" />`,
    `<meta property="og:type" content="${page.path === "/" ? "website" : "article"}" />`,
    `<meta property="og:site_name" content="${escape(seo.site.name)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:image" content="${ogImage}" />`,
    `<meta name="twitter:title" content="${escape(page.title)}" />`,
    `<meta name="twitter:description" content="${escape(page.description)}" />`,
    `<meta name="author" content="${escape(seo.site.name)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<script type="application/ld+json">${JSON.stringify(structuredData(page))}</script>`,
  ].join("\n    ");

  return template
    .replace("<title>Mika Drori Portfolio</title>", head)
    .replace('<div id="root"></div>', `<div id="root">${bodyContent(page)}</div>`);
}

let written = 0;
for (const page of seo.pages) {
  const outDir = page.path === "/" ? dist : join(dist, page.path.replace(/^\//, ""));
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "index.html"), buildPage(page), "utf8");
  written += 1;
}

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...seo.pages.map(
    (page) =>
      `  <url><loc>${siteUrl}${page.path === "/" ? "/" : page.path}</loc><changefreq>monthly</changefreq><priority>${page.path === "/" ? "1.0" : "0.8"}</priority></url>`,
  ),
  "</urlset>",
].join("\n");
writeFileSync(join(dist, "sitemap.xml"), sitemap, "utf8");

console.log(`prerendered ${written} routes + sitemap.xml → ${siteUrl}`);
