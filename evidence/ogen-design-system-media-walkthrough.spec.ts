import { expect, test } from "@playwright/test";
import { copyFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

test.use({ video: "on" });
test.setTimeout(180_000);

const DESIGN_SYSTEM_BLOCKS = [
  "Operational Color Palette",
  "Typography & Scannability",
  "Icons & Status Badges",
  "Buttons & Text Boxes",
  "Tactical Components & Pop-ups",
] as const;

test.afterAll(async () => {
  const resultsDir = path.resolve("test-results");
  const evidenceDir = path.resolve("evidence");
  mkdirSync(evidenceDir, { recursive: true });
  const target = path.join(evidenceDir, "OGEN-design-system-media-walkthrough.webm");

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
    /ogen-design-system-media/i.test(file),
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

test("OGEN Design System shows individual curated assets for all five blocks", async ({ page }) => {
  await page.goto("/ogen");
  await expect(page.getByRole("heading", { name: "OGEN System", level: 3 })).toBeVisible();
  await page.waitForTimeout(1200);

  const designHeading = page.getByRole("heading", { name: "Design", level: 2 }).first();
  await designHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);

  const designSystem = page.locator("[data-ogen-design-system]");
  await designSystem.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);

  await expect(designSystem.getByRole("heading", { name: "Design System", level: 3 })).toBeVisible();
  await expect(page.locator("[data-ogen-design-column]")).toHaveClass(/md:col-span-5/);
  await expect(designSystem.getByText("Media Placeholder")).toHaveCount(0);
  await expect(designSystem.getByText(/Atomic Design/)).toHaveCount(0);
  await expect(designSystem.locator('[data-ogen-ds-media="composite"]')).toHaveCount(0);

  for (const title of DESIGN_SYSTEM_BLOCKS) {
    const block = designSystem.locator(`[data-ogen-design-system-block="${title}"]`);
    await block.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);
    await expect(block.getByRole("heading", { name: title, level: 4 })).toBeVisible();
  }

  // Palette — PNG swatches, full content-column width
  const palette = designSystem.locator('[data-ogen-ds-media="palette"] img');
  await expect(palette).toBeVisible();
  await expect
    .poll(async () => palette.evaluate((el) => (el as HTMLImageElement).currentSrc))
    .toMatch(/Ogen_UI_ColorPallete_shqxzu/i);
  await expect
    .poll(async () => palette.evaluate((el) => (el as HTMLImageElement).naturalWidth))
    .toBeGreaterThan(0);

  // Typography — dark panel + 3 type assets
  const typography = designSystem.locator('[data-ogen-ds-media="typography"]');
  await typography.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await expect(typography.locator("img")).toHaveCount(3);
  await expect(typography.locator("xpath=ancestor::*[@data-ogen-ds-panel]")).toHaveCount(1);

  // Icons (17) + status badges (7) on dark panel
  const iconsBadges = designSystem.locator('[data-ogen-ds-media="icons-badges"]');
  await iconsBadges.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  await expect(designSystem.locator("[data-ogen-ds-icons] img")).toHaveCount(17);
  await expect(designSystem.locator("[data-ogen-ds-status-badges] img")).toHaveCount(7);
  await expect
    .poll(async () =>
      designSystem.locator("[data-ogen-ds-icons]").evaluate((el) => el.getBoundingClientRect().width),
    )
    .toBeGreaterThan(80);
  await expect(iconsBadges.locator("xpath=ancestor::*[@data-ogen-ds-panel]")).toHaveCount(1);

  // Tactical atoms — equal button heights, filters present
  const atoms = designSystem.locator("[data-ogen-ds-atoms]");
  await atoms.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  const buttons = atoms.locator('img[alt*="button"]');
  await expect(buttons).toHaveCount(3);
  await expect
    .poll(async () => {
      const heights = await buttons.evaluateAll((els) =>
        els.map((el) => el.getBoundingClientRect().height),
      );
      return Math.max(...heights) - Math.min(...heights);
    })
    .toBeLessThan(1);
  await expect(designSystem.locator("[data-ogen-ds-filter-authority] img")).toHaveCount(2);
  await expect(atoms.locator("xpath=ancestor::*[@data-ogen-ds-panel]")).toHaveCount(1);

  // Popups — Anchor pair side-by-side; reports stacked (no panel)
  const popups = designSystem.locator("[data-ogen-ds-popups]");
  await popups.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  const anchorImgs = designSystem.locator("[data-ogen-ds-popup-anchor] img");
  await expect(anchorImgs).toHaveCount(2);
  await expect
    .poll(async () =>
      anchorImgs.nth(0).evaluate((el) => (el as HTMLImageElement).currentSrc),
    )
    .toMatch(/OgenPopupNewAdd/i);
  await expect
    .poll(async () =>
      anchorImgs.nth(1).evaluate((el) => (el as HTMLImageElement).currentSrc),
    )
    .toMatch(/Ogen_UI_OgenPopup_hrfs2n/i);
  await expect(designSystem.locator("[data-ogen-ds-popup-reports] img")).toHaveCount(2);
  await expect(popups.locator("xpath=ancestor::*[@data-ogen-ds-panel]")).toHaveCount(0);

  // Titles only — no body copy under Design System blocks
  await expect(designSystem.locator("[data-ogen-design-system-block] > p")).toHaveCount(0);

  await page.waitForTimeout(1500);
  await designSystem.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);
});
