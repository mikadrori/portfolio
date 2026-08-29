/**
 * Pull the last few days of Clarity data so it can be summarised in plain language.
 *
 * Reads CLARITY_API_TOKEN from .env (gitignored — the token never enters the repo).
 * Clarity allows only 10 requests per project per day and returns at most 3 days,
 * so every response is cached under .clarity-cache/ and reused unless --fresh is
 * passed. Custom events and funnels are not exposed by this API; they exist only
 * in the Clarity UI.
 *
 *   node scripts/clarity-insights.mjs [--days=3] [--by=URL] [--fresh]
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function readToken() {
  const envPath = join(root, ".env");
  if (!existsSync(envPath)) return null;
  const line = readFileSync(envPath, "utf8")
    .split("\n")
    .find((l) => l.trim().startsWith("CLARITY_API_TOKEN="));
  if (!line) return null;
  return line.slice(line.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "");
}

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split("=")[1] : fallback;
};

const days = flag("days", "3");
const by = flag("by", null);
const fresh = args.includes("--fresh");

const token = readToken();
if (!token) {
  console.error(
    "No CLARITY_API_TOKEN in .env.\n" +
      "Get one from Clarity → Settings → Data Export → Generate new API token,\n" +
      "then add this line to .env:\n\n  CLARITY_API_TOKEN=your-token-here\n",
  );
  process.exit(1);
}

const cacheDir = join(root, ".clarity-cache");
if (!existsSync(cacheDir)) mkdirSync(cacheDir, { recursive: true });
const cacheKey = `${days}-${by || "overall"}.json`;
const cachePath = join(cacheDir, cacheKey);

if (!fresh && existsSync(cachePath)) {
  const cached = JSON.parse(readFileSync(cachePath, "utf8"));
  console.log(`# cached request (${cached.fetchedAt}) — pass --fresh to spend a request\n`);
  console.log(JSON.stringify(cached.data, null, 2));
  process.exit(0);
}

const url = new URL("https://www.clarity.ms/export-data/api/v1/project-live-insights");
url.searchParams.set("numOfDays", days);
if (by) url.searchParams.set("dimension1", by);

const res = await fetch(url, {
  headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
});

if (!res.ok) {
  const body = await res.text();
  console.error(`Clarity API ${res.status}: ${body.slice(0, 400)}`);
  if (res.status === 429) console.error("\nDaily limit of 10 requests reached. Cached results are still readable without --fresh.");
  process.exit(1);
}

const data = await res.json();
writeFileSync(cachePath, JSON.stringify({ fetchedAt: new Date().toISOString(), data }, null, 2));
console.log(JSON.stringify(data, null, 2));
