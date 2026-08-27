import { expect, test } from "@playwright/test";

test.use({ video: "on" });
test.setTimeout(60_000);

test("OGEN extreme conditions rows use content gap between pairs", async ({ page }) => {
  await page.goto("/ogen");

  const extremeHeading = page.getByRole("heading", {
    name: "Designing for Extreme Conditions",
    level: 3,
  });
  await extremeHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);

  const extremeSections = page.locator("[data-ogen-extreme-condition-sections]");
  await expect(extremeSections).toBeVisible();
  await expect(extremeSections.locator("[data-ogen-extreme-condition-pair]")).toHaveCount(2);
  await expect(extremeSections.locator("[data-ogen-interface-solutions]")).toHaveCount(2);

  const layout = await extremeSections.evaluate((element) => {
    const stack = element.firstElementChild as HTMLElement | null;
    const pairs = [...element.querySelectorAll("[data-ogen-extreme-condition-pair]")];
    if (!stack || pairs.length < 2) return null;
    const first = pairs[0].getBoundingClientRect();
    const second = pairs[1].getBoundingClientRect();
    const styles = getComputedStyle(stack);
    return {
      gap: styles.rowGap || styles.gap,
      pairGap: second.top - first.bottom,
      secondBelowFirst: second.top > first.bottom,
    };
  });

  expect(layout).not.toBeNull();
  expect(layout!.secondBelowFirst).toBe(true);
  // Content gap token is 60px+ across breakpoints; was previously gap-8 (32px).
  expect(layout!.pairGap).toBeGreaterThanOrEqual(56);
  await page.waitForTimeout(1500);

  const secondHeading = extremeSections.getByRole("heading", {
    name: "What Happens to Vision at Night?",
    level: 4,
  });
  await secondHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
});
