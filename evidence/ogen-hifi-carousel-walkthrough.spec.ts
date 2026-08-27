import { expect, test } from "@playwright/test";
import { copyFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

test.use({ video: "on" });
test.setTimeout(180_000);

test.afterAll(async () => {
  const resultsDir = path.resolve("test-results");
  const evidenceDir = path.resolve("evidence");
  mkdirSync(evidenceDir, { recursive: true });
  const target = path.join(evidenceDir, "OGEN-hifi-carousel-walkthrough.webm");

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

  const videos = walk(resultsDir).filter((file) => /ogen-hifi-carousel/i.test(file));
  const newest = videos.sort((a, b) => {
    try {
      return statSync(b).mtimeMs - statSync(a).mtimeMs;
    } catch {
      return 0;
    }
  })[0];
  if (newest) copyFileSync(newest, target);
});

test("OGEN High Fidelity is a horizontal drag carousel of five title + still slides", async ({
  page,
}) => {
  await page.goto("/ogen");
  await expect(page.getByRole("heading", { name: "OGEN System", level: 3 })).toBeVisible();
  await page.waitForTimeout(1200);

  const designHeading = page.getByRole("heading", { name: "Design", level: 2 }).first();
  await designHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);

  const highFidelityHeading = page.getByRole("heading", { name: "High Fidelity", level: 3 });
  await highFidelityHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);

  const hifiCarousel = page.locator("[data-ogen-hifi-carousel]");
  const hifiColumn = page.locator("[data-ogen-hifi-column]");
  await expect(hifiCarousel).toBeVisible();
  await expect(hifiColumn.getByRole("heading", { name: "High Fidelity", level: 3 })).toBeVisible();

  const hifiGroups: Array<[string, number]> = [
    ["Dashboard", 1],
    ["Anchor List", 1],
    ["Anchor List pop up", 1],
    ["Battalion Reports", 1],
    ["Battalion Reports pop up", 1],
  ];
  for (const [title, screens] of hifiGroups) {
    await expect(hifiCarousel.locator(`[data-ogen-hifi-screen="${title}"]`)).toHaveCount(screens);
    await expect(hifiCarousel.locator(`[data-ogen-hifi-screen="${title}"] img`)).toHaveCount(
      screens,
    );
    await expect(
      hifiCarousel.getByRole("heading", { name: title, level: 4, exact: true }),
    ).toHaveCount(screens);
  }
  expect(await hifiCarousel.locator("[data-ogen-hifi-screen]").count()).toBe(5);

  const hifiSlideTitles = [
    "Dashboard",
    "Anchor List",
    "Anchor List pop up",
    "Battalion Reports",
    "Battalion Reports pop up",
  ];
  for (const title of hifiSlideTitles) {
    const slide = hifiCarousel.locator(`[data-ogen-hifi-screen="${title}"]`);
    await slide.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);
    await expect(slide.getByRole("heading", { name: title, level: 4, exact: true })).toBeVisible();
    await expect(slide.locator("img")).toBeVisible();
  }

  await hifiCarousel
    .locator(`[data-ogen-hifi-screen="Dashboard"]`)
    .first()
    .scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  const carouselLayout = await hifiCarousel.evaluate((el) => {
    const overflowX = getComputedStyle(el).overflowX;
    const slides = [...el.querySelectorAll("[data-ogen-hifi-screen]")];
    return {
      overflowX,
      canScroll: el.scrollWidth > el.clientWidth + 8,
      titles: slides.map((slide) => slide.getAttribute("data-ogen-hifi-screen") ?? ""),
    };
  });
  expect(["auto", "scroll", "overlay"]).toContain(carouselLayout.overflowX);
  expect(carouselLayout.canScroll).toBe(true);
  expect(carouselLayout.titles).toEqual(hifiSlideTitles);

  await expect
    .poll(async () =>
      hifiCarousel.evaluate((element) =>
        [...element.querySelectorAll("[data-ogen-hifi-screen] img")].every(
          (img) => (img as HTMLImageElement).naturalWidth > 0,
        ),
      ),
    )
    .toBe(true);
  await expect
    .poll(async () =>
      hifiCarousel.evaluate((element) => {
        const cells = [...element.querySelectorAll("[data-ogen-hifi-screen]")];
        if (cells.length !== 5) return false;
        const widths = cells.map((node) => node.getBoundingClientRect().width);
        const heights = cells.map((node) => node.getBoundingClientRect().height);
        const widthSpan = Math.max(...widths) - Math.min(...widths);
        const heightSpan = Math.max(...heights) - Math.min(...heights);
        return widthSpan <= 1 && heightSpan <= 2;
      }),
    )
    .toBe(true);

  const hifiSizes = await hifiCarousel.evaluate((element) =>
    [...element.querySelectorAll("[data-ogen-hifi-screen]")].map((node) => {
      const rect = node.getBoundingClientRect();
      return {
        title: node.getAttribute("data-ogen-hifi-screen") ?? "",
        width: Number(rect.width.toFixed(1)),
        height: Number(rect.height.toFixed(1)),
        src: (node.querySelector("img") as HTMLImageElement | null)?.currentSrc ?? "",
        pointerEvents: node.querySelector("img")
          ? getComputedStyle(node.querySelector("img")!).pointerEvents
          : "",
      };
    }),
  );
  expect(hifiSizes.length).toBe(5);
  expect(Math.max(...hifiSizes.map((c) => c.width)) - Math.min(...hifiSizes.map((c) => c.width))).toBeLessThanOrEqual(1);
  expect(Math.max(...hifiSizes.map((c) => c.height)) - Math.min(...hifiSizes.map((c) => c.height))).toBeLessThanOrEqual(2);
  expect(hifiSizes.every((cell) => cell.pointerEvents === "none")).toBe(true);
  expect(hifiSizes.some((cell) => /High_fidelity_Dashboard/i.test(cell.src))).toBe(true);
  await expect(hifiCarousel.getByText(/Users log in to the system/)).toHaveCount(0);

  // Drag scroll so the recording shows the carousel interaction.
  const box = await hifiCarousel.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box!.x + box!.width * 0.85, box!.y + box!.height * 0.55);
  await page.mouse.down();
  await page.mouse.move(box!.x + box!.width * 0.15, box!.y + box!.height * 0.55, { steps: 18 });
  await page.mouse.up();
  await page.waitForTimeout(1500);

  await expect
    .poll(async () => hifiCarousel.evaluate((el) => el.scrollLeft), { timeout: 10_000 })
    .toBeGreaterThan(20);

  await page.waitForTimeout(1500);
});
