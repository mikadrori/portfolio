import { expect, test } from "@playwright/test";
import { copyFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

test.use({ video: "on" });
test.setTimeout(180_000);

test.afterAll(async () => {
  const resultsDir = path.resolve("test-results");
  const evidenceDir = path.resolve("evidence");
  mkdirSync(evidenceDir, { recursive: true });
  const target = path.join(evidenceDir, "signal50-page-structure-walkthrough.webm");

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

  const videos = walk(resultsDir).filter((file) => /signal50-page-structure/i.test(file));
  const newest = videos.sort((a, b) => {
    try {
      return statSync(b).mtimeMs - statSync(a).mtimeMs;
    } catch {
      return 0;
    }
  })[0];
  if (newest) copyFileSync(newest, target);
});

test("Signal 50 page structure: intro, brand strategy, visual language, deliverables", async ({
  page,
}) => {
  await page.goto("/signal50");
  await page.waitForTimeout(1500);

  const heroVideo = page.locator("video").first();
  await expect(heroVideo).toBeVisible();
  await expect(heroVideo).toHaveAttribute("loop", "");
  const heroBox = await heroVideo.boundingBox();
  expect(heroBox).toBeTruthy();
  expect(heroBox!.height).toBeGreaterThanOrEqual(page.viewportSize()!.height - 2);
  await page.waitForTimeout(1200);

  await expect(page.getByRole("heading", { name: "Signal 50", level: 3, exact: true })).toBeVisible();
  await expect(page.getByText("Bringing the noise back home", { exact: true })).toBeVisible();
  await page.waitForTimeout(1200);

  for (const tag of ["Solo Project", "Brand Identity & On-Screen Graphics", "2026"]) {
    await expect(page.getByText(tag, { exact: true })).toBeVisible();
  }
  await page.waitForTimeout(1000);

  await expect(page.getByText("Brief", { exact: true })).toBeVisible();
  await expect(page.getByText("Concept", { exact: true })).toBeVisible();
  await expect(page.getByText("Tools", { exact: true })).toBeVisible();
  await expect(page.getByText("Adobe Premiere", { exact: true })).toBeVisible();
  await expect(page.getByText("Suno", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Full on-screen broadcast branding for a major channel / live event"),
  ).toBeVisible();
  await page.waitForTimeout(1200);

  const showreel = page.locator("[data-signal50-showreel]");
  await expect(showreel).toBeVisible();
  const showreelVideo = showreel.locator("video");
  await expect(showreelVideo).toHaveCount(1);
  await expect(showreelVideo).toHaveAttribute("controls", "");
  await expect(showreelVideo).not.toHaveAttribute("autoplay");
  await expect(showreelVideo).not.toHaveAttribute("loop");
  await showreel.scrollIntoViewIfNeeded();
  // Wait until the showreel is fully in view, then it should attempt playback
  await expect
    .poll(async () =>
      showreel.evaluate((el) => {
        const r = el.getBoundingClientRect();
        return r.top >= 0 && r.bottom <= window.innerHeight;
      }),
    )
    .toBe(true);
  await page.waitForTimeout(1200);
  const showreelBox = await showreel.boundingBox();
  const toolsLabel = page.getByText("Tools", { exact: true });
  const toolsBox = await toolsLabel.boundingBox();
  expect(showreelBox).toBeTruthy();
  expect(toolsBox).toBeTruthy();
  // Wider strip cols 2–8 — starts left of the Tools column
  expect(showreelBox!.x).toBeLessThan(toolsBox!.x);
  await page.waitForTimeout(1000);

  const brandStrategy = page.getByRole("heading", { name: "Brand Strategy", level: 2 }).first();
  await brandStrategy.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  await expect(page.getByRole("heading", { name: "Strategic Positioning", level: 3 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Target Audience", level: 3 })).toBeVisible();
  const targetAudience = page.locator("[data-signal50-target-audience]");
  for (const label of ["Profile", "Values", "Needs"]) {
    await expect(targetAudience.getByRole("heading", { name: label, level: 4 })).toBeVisible();
  }
  await expect(targetAudience.getByText(/Ages 35\+/)).toBeVisible();
  await expect(targetAudience.getByText(/Israeli audience raised on local culture/)).toBeVisible();
  const targetImg = targetAudience.getByRole("img", { name: /Signal 50 target audience/i });
  await expect(targetImg).toBeVisible();
  const fields = targetAudience.locator("[data-signal50-target-fields]");
  const profileBox = await fields.getByRole("heading", { name: "Profile", level: 4 }).boundingBox();
  const imgBox = await targetImg.boundingBox();
  const fieldsBox = await fields.boundingBox();
  expect(profileBox).toBeTruthy();
  expect(imgBox).toBeTruthy();
  expect(fieldsBox).toBeTruthy();
  // Fields left of photo; heights align
  expect(fieldsBox!.x).toBeLessThan(imgBox!.x);
  expect(Math.abs(fieldsBox!.height - imgBox!.height)).toBeLessThan(24);
  await page.waitForTimeout(1200);
  await expect(page.getByRole("heading", { name: "Brand Values", level: 3 })).toBeVisible();

  const brandValues = page.locator("[data-signal50-brand-values]");
  for (const value of ["Nostalgia", "Rebellion", "Community", "Prestige"]) {
    await expect(brandValues.getByRole("heading", { name: value, level: 4 })).toBeVisible();
  }
  // Four value columns in one row on desktop
  const valueHeads = brandValues.locator("h4");
  await expect(valueHeads).toHaveCount(4);
  const boxes = await Promise.all(
    (await valueHeads.all()).map(async (el) => el.boundingBox()),
  );
  expect(boxes.every(Boolean)).toBe(true);
  const tops = boxes.map((b) => Math.round(b!.y));
  expect(Math.max(...tops) - Math.min(...tops)).toBeLessThan(8);
  const xs = boxes.map((b) => b!.x);
  expect([...xs].sort((a, b) => a - b)).toEqual(xs);
  await page.waitForTimeout(1200);

  const visual = page.getByRole("heading", { name: "Visual Language", level: 2 }).first();
  await visual.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);

  await expect(page.getByRole("heading", { name: "Inspirations", level: 3, exact: true })).toBeVisible();
  await expect(
    page.getByText(/Drawing inspiration from the 1960s through the 1990s/),
  ).toBeVisible();
  const inspirationsGallery = page.locator("[data-signal50-inspirations]").locator("visible=true");
  await expect(inspirationsGallery).toBeVisible();
  await expect(inspirationsGallery.locator("img")).toHaveCount(20);
  const inspirationsBlock = page
    .getByRole("heading", { name: "Inspirations", level: 3, exact: true })
    .locator("xpath=ancestor::div[contains(@class,'flex-col')][1]");
  await inspirationsBlock.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  await inspirationsGallery.locator("img").nth(2).hover();
  await page.waitForTimeout(1200);
  await inspirationsGallery.locator("img").nth(0).hover();
  await page.waitForTimeout(800);
  await page.mouse.move(0, 0);
  await page.waitForTimeout(800);

  await expect(
    page.getByRole("heading", { name: "Color Palette & Typography", level: 3 }),
  ).toBeVisible();
  await expect(page.getByText(/High-impact palette applied via color mapping/)).toBeVisible();
  await expect(page.getByText(/Complementary type using Anomalia font/)).toBeVisible();
  await page.waitForTimeout(1000);

  await expect(page.getByRole("heading", { name: "Logo", level: 3, exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Inspirations", level: 4 })).toBeVisible();
  await expect(
    page.getByText(/bold, raw, hand-drawn mark/),
  ).toBeVisible();
  const logoInspirations = page.locator("[data-signal50-logo-inspirations]").locator("visible=true");
  await expect(logoInspirations).toBeVisible();
  await expect(logoInspirations.locator("img")).toHaveCount(10);
  const logoInspirationsBlock = page
    .getByRole("heading", { name: "Inspirations", level: 4 })
    .locator("xpath=ancestor::div[contains(@class,'flex-col')][1]");
  await logoInspirationsBlock.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  const logoInspBox = await logoInspirationsBlock.boundingBox();
  expect(logoInspBox).toBeTruthy();
  expect(logoInspBox!.height).toBeLessThanOrEqual(page.viewportSize()!.height);
  await logoInspirations.locator("img").nth(4).hover();
  await page.waitForTimeout(1200);
  await logoInspirations.locator("img").nth(0).hover();
  await page.waitForTimeout(800);
  await page.mouse.move(0, 0);
  await page.waitForTimeout(800);

  await expect(page.getByRole("heading", { name: "Initial Sketches", level: 4 })).toBeVisible();
  const sketchesGallery = page.locator("[data-signal50-logo-sketches]").locator("visible=true");
  await expect(sketchesGallery).toBeVisible();
  await expect(sketchesGallery.locator("img")).toHaveCount(8);
  await sketchesGallery.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);

  const sketchImgs = sketchesGallery.locator("img");
  await sketchImgs.nth(4).hover();
  await page.waitForTimeout(1200);
  await sketchImgs.nth(0).hover();
  await page.waitForTimeout(1000);
  await page.mouse.move(0, 0);
  await page.waitForTimeout(800);

  await expect(page.getByRole("heading", { name: "Final Logo", level: 4 })).toBeVisible();
  const finalProcess = page.locator("[data-signal50-final-logo-process]");
  await expect(finalProcess).toBeVisible();
  await expect(finalProcess.locator("img")).toHaveCount(3);
  await expect(finalProcess.locator("svg[aria-hidden]")).toHaveCount(2);
  await finalProcess.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await finalProcess.locator("img").nth(1).hover();
  await page.waitForTimeout(1200);
  await finalProcess.locator("img").nth(0).hover();
  await page.waitForTimeout(800);
  await page.mouse.move(0, 0);
  await page.waitForTimeout(800);
  await expect(page.locator("[data-signal50-final-logo]")).toBeVisible();
  await expect(
    page.getByRole("img", { name: /Signal 50 final logo/i }),
  ).toBeVisible();
  await page.waitForTimeout(1200);

  await expect(page.getByRole("heading", { name: "Grid System", level: 3 })).toBeVisible();
  await expect(
    page.getByText(/Vinyl-inspired geometry utilizing center lines/),
  ).toBeVisible();
  const gridSystem = page.locator("[data-signal50-grid-system]");
  await expect(gridSystem).toBeVisible();
  const gridInspirations = page.locator("[data-signal50-grid-inspirations]");
  await expect(gridInspirations).toBeVisible();
  await expect(gridInspirations.locator("img")).toHaveCount(3);
  const gridVideo = gridSystem.locator("[data-signal50-grid-video]");
  await expect(gridVideo).toHaveCount(1);
  await expect(gridVideo).toHaveAttribute("loop", "");
  await expect(gridVideo).not.toHaveAttribute("controls");
  await expect
    .poll(async () => gridVideo.evaluate((v) => (v as HTMLVideoElement).muted))
    .toBe(true);
  // Inspirations (page col 3) sit left of the video (cols 4–7)
  const inspBox = await gridInspirations.boundingBox();
  const vidBox = await gridVideo.boundingBox();
  expect(inspBox).toBeTruthy();
  expect(vidBox).toBeTruthy();
  expect(inspBox!.x).toBeLessThan(vidBox!.x);
  expect(inspBox!.width).toBeLessThan(vidBox!.width);
  // Inspo column height matches video; tiles stay square (not stretched)
  expect(Math.abs(inspBox!.height - vidBox!.height)).toBeLessThan(24);
  const tileBoxes = await Promise.all(
    (await gridInspirations.locator(":scope > div").all()).map(async (el) => el.boundingBox()),
  );
  expect(tileBoxes.every(Boolean)).toBe(true);
  for (const box of tileBoxes) {
    expect(Math.abs(box!.width - box!.height)).toBeLessThan(4);
    expect(box!.width).toBeLessThan(inspBox!.width * 0.9);
  }
  expect(tileBoxes[1]!.y).toBeGreaterThan(tileBoxes[0]!.y + tileBoxes[0]!.height + 8);
  expect(tileBoxes[2]!.y).toBeGreaterThan(tileBoxes[1]!.y + tileBoxes[1]!.height + 8);
  await gridSystem.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  // Hover each inspiration briefly for the recording
  for (const img of await gridInspirations.locator("img").all()) {
    await img.scrollIntoViewIfNeeded();
    await img.hover();
    await page.waitForTimeout(800);
  }
  await page.mouse.move(0, 0);
  await page.waitForTimeout(800);

  const deliverables = page.getByRole("heading", { name: "Deliverables", level: 2 }).first();
  await deliverables.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  const motionAssets = page.locator("[data-signal50-motion-assets]");
  await expect(motionAssets).toBeVisible();

  const firstVid = motionAssets.locator(`[data-signal50-motion-asset="Logo ID (Short)"] video`);
  const secondVid = motionAssets.locator(`[data-signal50-motion-asset="Stage Teaser"] video`);
  await firstVid.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  await expect
    .poll(async () => firstVid.evaluate((v) => (v as HTMLVideoElement).paused))
    .toBe(true);
  await expect(firstVid).toHaveAttribute("poster", /_poster\.jpg|so_\d+/);
  await firstVid.evaluate((v) => (v as HTMLVideoElement).play().catch(() => {}));
  await page.waitForTimeout(800);
  await secondVid.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await expect
    .poll(async () => secondVid.evaluate((v) => (v as HTMLVideoElement).paused))
    .toBe(true);
  await expect(secondVid).toHaveAttribute("poster", /_poster\.jpg|so_\d+/);
  await secondVid.evaluate((v) => (v as HTMLVideoElement).play().catch(() => {}));
  await page.waitForTimeout(800);
  await expect
    .poll(async () =>
      firstVid.evaluate((v) => (v as HTMLVideoElement).paused),
    )
    .toBe(true);

  for (const item of [
    "Logo ID (Short)",
    "Stage Teaser",
    "Nominee Sequence",
    "Winner Announcement",
    "Logo ID (Commercial Promo)",
  ]) {
    const block = motionAssets.locator(`[data-signal50-motion-asset="${item}"]`);
    await expect(block.getByRole("heading", { name: item, exact: true })).toBeVisible();
    await expect(block.locator("video")).toHaveCount(1);
    await expect(block.locator("video")).toHaveAttribute("controls", "");
    await expect(block.locator("video")).toHaveAttribute("poster", /_poster\.jpg|so_\d+/);
    await expect(block.locator("video")).not.toHaveAttribute("loop");
    await expect(block.locator("video")).not.toHaveAttribute("muted");
    await block.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
  }
  await page.waitForTimeout(1200);

  await expect(page.getByText("next project")).toBeVisible();
  await page.waitForTimeout(1000);
});
