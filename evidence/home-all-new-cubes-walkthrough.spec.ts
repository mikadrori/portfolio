import { expect, test } from "@playwright/test";
import { copyFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

test.use({ video: "on" });
test.setTimeout(180_000);

const CUBES = [
  {
    label: "Lumina Forest",
    asset: /Cube_Lumina_BLUE/i,
    hoverAsset: /Cube_Lumina_PINK/i,
    path: "/lumina",
  },
  {
    label: "OGEN",
    asset: /Cube_Ogen_BLUE/i,
    hoverAsset: /Cube_Ogen_PINK/i,
    path: "/ogen",
  },
  {
    label: "Pack Up",
    asset: /Cube_PackUp_BLUE/i,
    hoverAsset: /Cube_PackUp_PINK/i,
    path: "/packup",
  },
  {
    label: "Nabat",
    asset: /Cube_Nabat_BLUE/i,
    hoverAsset: /Cube_Nabat_PINK/i,
    path: "/muchiwaze",
  },
  {
    label: "Signal",
    asset: /Cube_Signal_BLUE/i,
    hoverAsset: /Cube_Signal_PINK/i,
    path: "/signal50",
  },
] as const;

/** Dev: `/assets/New Cubes/…`; prod: Cloudinary `…/New%20Cubes/…` via cloudinaryUrl. */
const CUBE_CDN_OR_LOCAL = /(?:\/assets\/New(?:%20| )Cubes\/|res\.cloudinary\.com\/[^/]+\/image\/upload\/New(?:%20| )Cubes\/)/i;

test.afterAll(async () => {
  const resultsDir = path.resolve("test-results");
  const evidenceDir = path.resolve("evidence");
  mkdirSync(evidenceDir, { recursive: true });
  const target = path.join(evidenceDir, "home-all-new-cubes-walkthrough.webm");

  const walk = (dir: string): string[] => {
    try {
      const entries = readdirSync(dir, { withFileTypes: true });
      const files: string[] = [];
      for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) files.push(...walk(full));
        else if (entry.name.endsWith(".webm")) files.push(full);
      }
      return files;
    } catch {
      return [];
    }
  };

  const videos = walk(resultsDir).filter((file) =>
    /home-all-new-cubes/i.test(file),
  );
  const newest = videos.sort((a, b) => {
    try {
      return statSync(b).mtimeMs - statSync(a).mtimeMs;
    } catch {
      return 0;
    }
  })[0];
  if (newest) copyFileSync(newest, target);
});

test("home page shows all new cubes on rest and hover", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(1500);

  // Wait for drop-in animation to finish (5 cubes × 0.5s delay + bounce).
  await page.waitForTimeout(3500);

  for (const cube of CUBES) {
    const button = page.getByRole("button", { name: cube.label });
    await expect(button).toBeVisible();
    const img = button.locator("img");
    await expect
      .poll(async () => img.evaluate((el) => (el as HTMLImageElement).currentSrc))
      .toMatch(cube.asset);
    await expect
      .poll(async () => img.evaluate((el) => (el as HTMLImageElement).currentSrc))
      .toMatch(CUBE_CDN_OR_LOCAL);
    await expect
      .poll(async () =>
        img.evaluate((el) => (el as HTMLImageElement).naturalWidth > 0),
      )
      .toBe(true);
  }
  await page.waitForTimeout(1200);

  // Hover each cube to show PINK state, then leave to restore BLUE.
  for (const cube of CUBES) {
    const button = page.getByRole("button", { name: cube.label });
    const img = button.locator("img");
    await button.hover();
    await expect
      .poll(async () => img.evaluate((el) => (el as HTMLImageElement).currentSrc))
      .toMatch(cube.hoverAsset);
    await page.waitForTimeout(1200);
    await page.mouse.move(0, 0);
    await expect
      .poll(async () => img.evaluate((el) => (el as HTMLImageElement).currentSrc))
      .toMatch(cube.asset);
    await page.waitForTimeout(800);
  }

  // Click each cube and verify link target is unchanged.
  for (const cube of CUBES) {
    await page.goto("/");
    await page.waitForTimeout(3500);
    const button = page.getByRole("button", { name: cube.label });
    await expect(button).toBeVisible();
    await button.click();
    await expect(page).toHaveURL(new RegExp(`${cube.path.replace("/", "\\/")}$`));
    await page.waitForTimeout(1200);
  }
});
