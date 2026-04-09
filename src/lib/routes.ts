/** Section slugs that map to flat URLs: `/${id}` (home is `/`). */
export const ROUTE_SECTION_IDS = [
  "about",
  "lumina",
  "aviv",
  "packup",
  "muchiwaze",
  "wwl",
] as const;

export type RouteSectionId = (typeof ROUTE_SECTION_IDS)[number];

const ROUTE_SET = new Set<string>(ROUTE_SECTION_IDS);

function normalizePathname(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, "") || "/";
  return trimmed === "" ? "/" : trimmed;
}

/** Map URL pathname to ContentArea section id, or `null` for home. Unknown paths return `null` until redirect. */
export function pathnameToSection(pathname: string): string | null {
  const normalized = normalizePathname(pathname);
  if (normalized === "/") return null;
  const id = normalized.slice(1);
  if (id.includes("/")) return null;
  return ROUTE_SET.has(id) ? id : null;
}

export function sectionToPath(section: string | null): string {
  if (section == null) return "/";
  return `/${section}`;
}

export function isValidRoutePathname(pathname: string): boolean {
  const normalized = normalizePathname(pathname);
  if (normalized === "/") return true;
  const id = normalized.slice(1);
  if (id.includes("/")) return false;
  return ROUTE_SET.has(id);
}
