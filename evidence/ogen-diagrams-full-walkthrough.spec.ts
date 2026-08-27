import { expect, test } from "@playwright/test";

test.use({ video: "on" });
test.setTimeout(180_000);

test("OGEN diagrams fit without scrolling and show hierarchy", async ({ page }) => {
  await page.goto("/ogen");
  await expect(page.getByRole("heading", { name: "OGEN System", level: 3 })).toBeVisible();
  const appIcon = page.getByRole("img", { name: "OGEN app icon" });
  await expect(appIcon).toBeVisible();
  await expect
    .poll(async () => appIcon.evaluate((img) => (img as HTMLImageElement).currentSrc))
    .toMatch(/OGEN_App_icon/i);
  const heroVideo = page.locator("video").first();
  await expect(heroVideo).toBeVisible();
  const heroMetrics = await heroVideo.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const video = element as HTMLVideoElement;
    return {
      height: rect.height,
      viewport: window.innerHeight,
      src: video.currentSrc || video.src,
    };
  });
  // Full-viewport hero: within a few px of the visual viewport height.
  expect(Math.abs(heroMetrics.height - heroMetrics.viewport)).toBeLessThan(8);
  expect(heroMetrics.src).toMatch(/Hero_VID/i);
  await page.waitForTimeout(1200);

  await expect(page.getByText("Figma Make")).toBeVisible();
  await expect(page.getByText("Gemini")).toBeVisible();
  await expect(page.getByText("Adobe Illustrator")).toHaveCount(0);
  await expect(page.getByText("After Effects")).toHaveCount(0);
  const introScreensVideo = page.getByTitle("OGEN screens overview");
  await expect(introScreensVideo).toBeVisible();
  await expect
    .poll(async () => introScreensVideo.evaluate((el) => (el as HTMLVideoElement).currentSrc))
    .toMatch(/OGEN_Screens_VID/i);
  await introScreensVideo.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);

  const disasterHeading = page.getByRole("heading", { name: "What is a Disaster Scene?", level: 3 });
  await disasterHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);

  const disasterCopySpan = await disasterHeading.evaluate((heading) => {
    const block = heading.closest("[class*='col-span']");
    if (!block?.parentElement) return null;
    const pageGrid = block.parentElement;
    const styles = getComputedStyle(pageGrid);
    const colGap = Number.parseFloat(styles.columnGap) || 0;
    const gridWidth = pageGrid.getBoundingClientRect().width;
    const colWidth = (gridWidth - colGap * 7) / 8;
    const gridLeft = pageGrid.getBoundingClientRect().left;
    const rect = block.getBoundingClientRect();
    return {
      className: block.className,
      startCol: (rect.left - gridLeft) / (colWidth + colGap) + 1,
      endCol: (rect.right - gridLeft + colGap) / (colWidth + colGap),
    };
  });
  expect(disasterCopySpan).not.toBeNull();
  expect(disasterCopySpan!.className).toMatch(/md:col-span-4/);
  expect(disasterCopySpan!.startCol).toBeGreaterThan(2.5);
  expect(disasterCopySpan!.startCol).toBeLessThan(3.5);
  expect(disasterCopySpan!.endCol).toBeGreaterThan(5.5);
  expect(disasterCopySpan!.endCol).toBeLessThan(6.5);

  const disasterRow = page.locator("[data-ogen-disaster-scenes]");
  await expect(disasterRow).toBeVisible();
  await expect
    .poll(async () =>
      disasterRow.evaluate((element) =>
        [...element.querySelectorAll("img")].every((img) => (img as HTMLImageElement).naturalWidth > 0),
      ),
    )
    .toBe(true);
  const disasterLayout = await disasterRow.evaluate((element) => {
    const grid = element.querySelector("[data-ogen-equal-image-row]");
    const pageGrid = element.closest("[class*='grid']") ?? element.parentElement;
    const cells = [...(grid?.children ?? [])] as HTMLElement[];
    const imgs = [...element.querySelectorAll("img")] as HTMLImageElement[];
    const cellRects = cells.map((cell) => {
      const rect = cell.getBoundingClientRect();
      return {
        top: Number(rect.top.toFixed(1)),
        height: Number(rect.height.toFixed(1)),
        width: Number(rect.width.toFixed(1)),
      };
    });
    const styles = pageGrid ? getComputedStyle(pageGrid) : null;
    const colGap = styles ? Number.parseFloat(styles.columnGap) || 0 : 0;
    const gridWidth = pageGrid?.getBoundingClientRect().width ?? 0;
    const colWidth = gridWidth > 0 ? (gridWidth - colGap * 7) / 8 : 0;
    const gridLeft = pageGrid?.getBoundingClientRect().left ?? 0;
    const rowRect = element.getBoundingClientRect();
    const startCol = colWidth > 0 ? (rowRect.left - gridLeft) / (colWidth + colGap) + 1 : 0;
    const endCol = colWidth > 0 ? (rowRect.right - gridLeft + colGap) / (colWidth + colGap) : 0;
    return {
      count: imgs.length,
      tops: [...new Set(cellRects.map((cell) => cell.top))],
      heights: [...new Set(cellRects.map((cell) => cell.height))],
      className: element.className,
      startCol,
      endCol,
    };
  });
  expect(disasterLayout.count).toBe(3);
  expect(disasterLayout.tops.length).toBe(1);
  expect(disasterLayout.heights.length).toBe(1);
  expect(disasterLayout.className).toMatch(/md:col-span-6/);
  expect(disasterLayout.startCol).toBeGreaterThan(2.5);
  expect(disasterLayout.startCol).toBeLessThan(3.5);
  expect(disasterLayout.endCol).toBeGreaterThan(7.5);
  expect(disasterLayout.endCol).toBeLessThan(8.5);

  // Hover expand: hovered cell grows, siblings shrink within the same row width.
  const disasterImgs = disasterRow.locator("[data-ogen-equal-image-row] > div");
  await disasterImgs.nth(1).hover();
  await page.waitForTimeout(800);
  const disasterHover = await disasterRow.evaluate((element) => {
    const cells = [...element.querySelectorAll("[data-ogen-equal-image-row] > div")] as HTMLElement[];
    const widths = cells.map((cell) => cell.getBoundingClientRect().width);
    return {
      midIsWidest: widths[1] > widths[0] && widths[1] > widths[2],
      rowWidth: element.querySelector("[data-ogen-equal-image-row]")?.getBoundingClientRect().width ?? 0,
    };
  });
  expect(disasterHover.midIsWidest).toBe(true);
  await disasterRow.hover({ position: { x: 2, y: 2 } });
  await page.mouse.move(0, 0);
  await page.waitForTimeout(1200);

  const marketHeading = page.getByRole("heading", {
    name: "Market Reality & Existing Systems",
    level: 3,
  });
  await marketHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);

  const marketCopySpan = await marketHeading.evaluate((heading) => {
    const block = heading.closest("[class*='col-span']");
    if (!block?.parentElement) return null;
    const pageGrid = block.parentElement;
    const styles = getComputedStyle(pageGrid);
    const colGap = Number.parseFloat(styles.columnGap) || 0;
    const gridWidth = pageGrid.getBoundingClientRect().width;
    const colWidth = (gridWidth - colGap * 7) / 8;
    const gridLeft = pageGrid.getBoundingClientRect().left;
    const rect = block.getBoundingClientRect();
    return {
      className: block.className,
      startCol: (rect.left - gridLeft) / (colWidth + colGap) + 1,
      endCol: (rect.right - gridLeft + colGap) / (colWidth + colGap),
    };
  });
  expect(marketCopySpan).not.toBeNull();
  expect(marketCopySpan!.className).toMatch(/md:col-span-4/);
  expect(marketCopySpan!.endCol).toBeGreaterThan(5.5);
  expect(marketCopySpan!.endCol).toBeLessThan(6.5);

  const marketBlock = page.locator("[data-ogen-market-reality]");
  await expect(marketBlock).toBeVisible();
  await expect
    .poll(async () =>
      marketBlock.evaluate((element) => {
        const row1 = [...element.querySelectorAll("[data-ogen-market-reality-row1] img")] as HTMLImageElement[];
        const row2 = [...element.querySelectorAll("[data-ogen-market-reality-row2] img")] as HTMLImageElement[];
        if (row1.length !== 3 || row2.length !== 2) return false;
        if (![...row1, ...row2].every((img) => img.naturalWidth > 0)) return false;
        const h1 = new Set(row1.map((img) => Number(img.getBoundingClientRect().height.toFixed(1))));
        const h2 = new Set(row2.map((img) => Number(img.getBoundingClientRect().height.toFixed(1))));
        return h1.size === 1 && h2.size === 1;
      }),
    )
    .toBe(true);
  const marketLayout = await marketBlock.evaluate((element) => {
    const row1El = element.querySelector("[data-ogen-market-reality-row1]");
    const row2El = element.querySelector("[data-ogen-market-reality-row2]");
    const row1 = [...(row1El?.querySelectorAll("img") ?? [])] as HTMLImageElement[];
    const row2 = [...(row2El?.querySelectorAll("img") ?? [])] as HTMLImageElement[];
    const pageGrid = element.closest(".col-span-8") ?? element.parentElement;
    const gridParent = pageGrid?.parentElement;
    const gridStyles = gridParent ? getComputedStyle(gridParent) : null;
    const gridGap = gridStyles ? Number.parseFloat(gridStyles.columnGap) || 0 : 0;
    const gridWidth = gridParent?.getBoundingClientRect().width ?? 0;
    const colWidth = gridWidth > 0 ? (gridWidth - gridGap * 7) / 8 : 0;
    const gridLeft = gridParent?.getBoundingClientRect().left ?? 0;
    const wrapRect = (pageGrid as HTMLElement | null)?.getBoundingClientRect();
    const h1 = row1[0]?.getBoundingClientRect().height ?? 0;
    const h2 = row2[0]?.getBoundingClientRect().height ?? 0;
    return {
      rowCounts: [row1.length, row2.length],
      row1Height: Number(h1.toFixed(1)),
      row2Height: Number(h2.toFixed(1)),
      fits: [...row1, ...row2].map((img) => getComputedStyle(img).objectFit),
      ratios: [...row1, ...row2].map((img) => {
        const natural = img.naturalWidth / img.naturalHeight;
        const rendered = img.getBoundingClientRect().width / img.getBoundingClientRect().height;
        return Math.abs(natural - rendered);
      }),
      wrapperClass: (pageGrid as HTMLElement | null)?.className ?? "",
      startCol:
        wrapRect && colWidth > 0 ? (wrapRect.left - gridLeft) / (colWidth + gridGap) + 1 : 0,
      endCol:
        wrapRect && colWidth > 0 ? (wrapRect.right - gridLeft + gridGap) / (colWidth + gridGap) : 0,
    };
  });
  expect(marketLayout.rowCounts).toEqual([3, 2]);
  expect(marketLayout.fits.every((fit) => fit === "cover")).toBe(true);
  // Each row spans the full width with tight gaps; both rows share the same edges.
  const rowAlign = await marketBlock.evaluate((element) => {
    const row1 = element.querySelector("[data-ogen-market-reality-row1]");
    const row2 = element.querySelector("[data-ogen-market-reality-row2]");
    const r1 = row1?.getBoundingClientRect();
    const r2 = row2?.getBoundingClientRect();
    const gapBetween = (row: Element | null) => {
      const imgs = [...(row?.querySelectorAll("img") ?? [])];
      if (imgs.length < 2) return [];
      const gaps: number[] = [];
      for (let i = 1; i < imgs.length; i += 1) {
        gaps.push(
          imgs[i].getBoundingClientRect().left - imgs[i - 1].getBoundingClientRect().right,
        );
      }
      return gaps;
    };
    const row1Imgs = [...(row1?.querySelectorAll("img") ?? [])].map((img) =>
      Number(img.getBoundingClientRect().top.toFixed(1)),
    );
    const row2Imgs = [...(row2?.querySelectorAll("img") ?? [])].map((img) =>
      Number(img.getBoundingClientRect().top.toFixed(1)),
    );
    return {
      row1Tops: [...new Set(row1Imgs)],
      row2Tops: [...new Set(row2Imgs)],
      row2Count: row2Imgs.length,
      leftGap: r1 && r2 ? Math.abs(r1.left - r2.left) : 99,
      rightGap: r1 && r2 ? Math.abs(r1.right - r2.right) : 99,
      widthGap: r1 && r2 ? Math.abs(r1.width - r2.width) : 99,
      imageGaps: [...gapBetween(row1), ...gapBetween(row2)],
    };
  });
  expect(rowAlign.row1Tops.length).toBe(1);
  expect(rowAlign.row2Tops.length).toBe(1);
  expect(rowAlign.row2Count).toBe(2);
  expect(rowAlign.leftGap).toBeLessThan(2);
  expect(rowAlign.rightGap).toBeLessThan(2);
  expect(rowAlign.widthGap).toBeLessThan(2);
  expect(rowAlign.imageGaps.every((gap) => gap >= 0 && gap <= 28)).toBe(true);
  expect(marketLayout.wrapperClass).toMatch(/md:col-span-5/);
  expect(marketLayout.startCol).toBeGreaterThan(2.5);
  expect(marketLayout.startCol).toBeLessThan(3.5);
  expect(marketLayout.endCol).toBeGreaterThan(6.5);
  expect(marketLayout.endCol).toBeLessThan(7.5);

  // Hover expand on Market Reality: column grows AND hovered row grows (other row shrinks).
  const marketRow1Cells = marketBlock.locator("[data-ogen-market-reality-row1] > div");
  const restRowHeights = await marketBlock.evaluate((element) => {
    const r1 = element.querySelector("[data-ogen-market-reality-row1]")?.getBoundingClientRect().height ?? 0;
    const r2 = element.querySelector("[data-ogen-market-reality-row2]")?.getBoundingClientRect().height ?? 0;
    return { r1, r2, total: element.getBoundingClientRect().height };
  });
  await marketRow1Cells.nth(1).hover();
  await page.waitForTimeout(800);
  const marketHover = await marketBlock.evaluate((element) => {
    const row1 = element.querySelector("[data-ogen-market-reality-row1]") as HTMLElement | null;
    const row2 = element.querySelector("[data-ogen-market-reality-row2]") as HTMLElement | null;
    const cells = [...(row1?.querySelectorAll(":scope > div") ?? [])] as HTMLElement[];
    const widths = cells.map((cell) => cell.getBoundingClientRect().width);
    return {
      midIsWidest: widths[1] > widths[0] && widths[1] > widths[2],
      row1H: row1?.getBoundingClientRect().height ?? 0,
      row2H: row2?.getBoundingClientRect().height ?? 0,
      total: element.getBoundingClientRect().height,
    };
  });
  expect(marketHover.midIsWidest).toBe(true);
  expect(marketHover.row1H).toBeGreaterThan(restRowHeights.r1);
  expect(marketHover.row2H).toBeLessThan(restRowHeights.r2);
  expect(Math.abs(marketHover.total - restRowHeights.total)).toBeLessThan(3);

  await marketBlock.locator("[data-ogen-market-reality-row2] > div").first().hover();
  await page.waitForTimeout(800);
  const marketHoverRow2 = await marketBlock.evaluate((element) => {
    const row1 = element.querySelector("[data-ogen-market-reality-row1]")?.getBoundingClientRect().height ?? 0;
    const row2 = element.querySelector("[data-ogen-market-reality-row2]")?.getBoundingClientRect().height ?? 0;
    return { row1, row2 };
  });
  expect(marketHoverRow2.row2).toBeGreaterThan(restRowHeights.r2);
  expect(marketHoverRow2.row1).toBeLessThan(restRowHeights.r1);
  await page.mouse.move(0, 0);
  await page.waitForTimeout(1200);

  await expect(page.getByRole("heading", { name: "Challenges", level: 2 }).last()).toBeVisible();
  await page.getByRole("heading", { name: "Challenges", level: 2 }).last().scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  const extremeHeading = page.getByRole("heading", {
    name: "Designing for Extreme Conditions",
    level: 3,
  });
  await extremeHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);

  const extremeBlock = page.locator("[data-ogen-extreme-conditions]");
  const extremeSections = page.locator("[data-ogen-extreme-condition-sections]");
  await expect(extremeBlock).toBeVisible();
  await expect(extremeSections).toBeVisible();
  await expect(
    extremeSections.getByRole("heading", {
      name: "What Happens to Human Body Under Stress?",
      level: 4,
    }),
  ).toBeVisible();
  await expect(
    extremeSections.getByRole("heading", { name: "What Happens to Vision at Night?", level: 4 }),
  ).toBeVisible();
  await expect(extremeSections.locator("[data-ogen-interface-solutions]")).toHaveCount(2);
  await expect(
    extremeSections.getByText("• Cognitive disruption").filter({ visible: true }),
  ).toBeVisible();
  await expect(
    extremeSections.getByText("• Operational dark mode").filter({ visible: true }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Working Under Extreme Stress", level: 3 })).toHaveCount(
    0,
  );

  const extremeLayout = await Promise.all([
    extremeBlock.evaluate((element) => {
      const pageGrid = element.parentElement;
      if (!pageGrid) return null;
      const styles = getComputedStyle(pageGrid);
      const colGap = Number.parseFloat(styles.columnGap) || 0;
      const gridWidth = pageGrid.getBoundingClientRect().width;
      const colWidth = (gridWidth - colGap * 7) / 8;
      const gridLeft = pageGrid.getBoundingClientRect().left;
      const rect = element.getBoundingClientRect();
      return {
        className: element.className,
        startCol: (rect.left - gridLeft) / (colWidth + colGap) + 1,
        endCol: (rect.right - gridLeft + colGap) / (colWidth + colGap),
      };
    }),
    extremeSections.evaluate((element) => {
      const pairs = [...element.querySelectorAll("[data-ogen-extreme-condition-pair]")].map(
        (pair) => {
          const heading = pair.querySelector("h4");
          const solution = pair.querySelector("[data-ogen-interface-solutions]");
          if (!heading || !solution) return null;
          const headingRect = heading.getBoundingClientRect();
          const solutionRect = solution.getBoundingClientRect();
          return {
            headingTop: headingRect.top,
            headingLeft: headingRect.left,
            solutionLeft: solutionRect.left,
          };
        },
      );
      return { pairs: pairs.filter(Boolean) };
    }),
  ]);
  const [introSpan, columnsLayout] = extremeLayout;
  expect(introSpan).not.toBeNull();
  expect(introSpan!.className).toMatch(/md:col-span-4/);
  expect(introSpan!.startCol).toBeGreaterThan(2.5);
  expect(introSpan!.startCol).toBeLessThan(3.5);
  expect(introSpan!.endCol).toBeGreaterThan(5.5);
  expect(introSpan!.endCol).toBeLessThan(6.5);
  expect(columnsLayout.pairs).toHaveLength(2);
  // Stacked pairs: second problem below the first
  expect(columnsLayout.pairs[1]!.headingTop).toBeGreaterThan(
    columnsLayout.pairs[0]!.headingTop + 40,
  );
  // Within each pair on desktop: problem left of Interface Solutions
  for (const pair of columnsLayout.pairs) {
    expect(pair!.solutionLeft).toBeGreaterThan(pair!.headingLeft + 40);
  }
  await page.waitForTimeout(1200);

  const visionHeading = page.getByRole("heading", {
    name: "Tunnel Vision VS Night Blind Spot",
    level: 3,
  });
  await visionHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);

  const visionBlock = page.locator("[data-ogen-vision-conflict]");
  await expect(visionBlock).toBeVisible();
  await expect(page.getByRole("heading", { name: "Night Blind Spot", level: 4 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Tunnel Vision", level: 4 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "UX UI Solution", level: 4 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "The UX Solution", level: 4 })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "UX UI", level: 4, exact: true })).toHaveCount(0);
  await expect(
    page.getByText(/creating a blind spot in the center of the screen/),
  ).toBeVisible();
  await expect(
    page.getByText(/forcing focus strictly on the screen center/),
  ).toBeVisible();
  await expect(
    page.getByText(
      /placing a prominent visual element in the screen center to capture focus/,
    ),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Darkness vs. Tunnel Vision", level: 3 })).toHaveCount(0);

  const nightCard = page.locator('[data-ogen-vision-phenomenon="Night Blind Spot"]');
  const tunnelCard = page.locator('[data-ogen-vision-phenomenon="Tunnel Vision"]');
  await expect(nightCard.getByRole("img", { name: "Night Blind Spot" })).toBeVisible();
  await expect(tunnelCard.getByRole("img", { name: "Tunnel Vision" })).toBeVisible();
  await expect
    .poll(async () =>
      Promise.all([
        nightCard.locator("img").evaluate((img) => (img as HTMLImageElement).naturalWidth > 0),
        tunnelCard.locator("img").evaluate((img) => (img as HTMLImageElement).naturalWidth > 0),
      ]).then(([a, b]) => a && b),
    )
    .toBe(true);

  const visionMediaLayout = await page.evaluate(() => {
    const night = document.querySelector('[data-ogen-vision-phenomenon="Night Blind Spot"]');
    const tunnel = document.querySelector('[data-ogen-vision-phenomenon="Tunnel Vision"]');
    const wrap = document.querySelector("[data-ogen-vision-phenomena]");
    const pageGrid = wrap?.parentElement;
    if (!night || !tunnel || !wrap || !pageGrid) return null;
    const styles = getComputedStyle(pageGrid);
    const colGap = Number.parseFloat(styles.columnGap) || 0;
    const gridWidth = pageGrid.getBoundingClientRect().width;
    const colWidth = (gridWidth - colGap * 7) / 8;
    const gridLeft = pageGrid.getBoundingClientRect().left;
    const colSpan = (el: Element) => {
      const rect = el.getBoundingClientRect();
      return {
        startCol: (rect.left - gridLeft) / (colWidth + colGap) + 1,
        endCol: (rect.right - gridLeft + colGap) / (colWidth + colGap),
        width: rect.width,
        top: rect.top,
      };
    };
    const nightRect = night.getBoundingClientRect();
    const tunnelRect = tunnel.getBoundingClientRect();
    const nightImg = night.querySelector("img")!.getBoundingClientRect();
    const nightTitle = night.querySelector("h4")!.getBoundingClientRect();
    const tunnelImg = tunnel.querySelector("img")!.getBoundingClientRect();
    const tunnelTitle = tunnel.querySelector("h4")!.getBoundingClientRect();
    return {
      wrap: colSpan(wrap),
      wrapClass: (wrap as HTMLElement).className,
      night: colSpan(night),
      tunnel: colSpan(tunnel),
      sameRow: Math.abs(nightRect.top - tunnelRect.top) < 8,
      imgAboveTitle:
        nightImg.bottom <= nightTitle.top + 2 && tunnelImg.bottom <= tunnelTitle.top + 2,
      centerGap: nightRect.left - tunnelRect.right,
    };
  });
  expect(visionMediaLayout).not.toBeNull();
  // Pair spans page columns 3–7; at rest Tunnel left (~3–4), Night right (~6–7), center gap.
  expect(visionMediaLayout!.wrapClass).toMatch(/md:col-start-3/);
  expect(visionMediaLayout!.wrapClass).toMatch(/md:col-span-5/);
  expect(visionMediaLayout!.wrap.startCol).toBeGreaterThan(2.5);
  expect(visionMediaLayout!.wrap.startCol).toBeLessThan(3.5);
  expect(visionMediaLayout!.wrap.endCol).toBeGreaterThan(6.5);
  expect(visionMediaLayout!.wrap.endCol).toBeLessThan(7.5);
  expect(visionMediaLayout!.tunnel.startCol).toBeGreaterThan(2.5);
  expect(visionMediaLayout!.tunnel.startCol).toBeLessThan(3.5);
  expect(visionMediaLayout!.tunnel.endCol).toBeGreaterThan(3.5);
  expect(visionMediaLayout!.tunnel.endCol).toBeLessThan(5.2);
  expect(visionMediaLayout!.night.startCol).toBeGreaterThan(5.5);
  expect(visionMediaLayout!.night.startCol).toBeLessThan(6.6);
  expect(visionMediaLayout!.night.endCol).toBeGreaterThan(6.5);
  expect(visionMediaLayout!.night.endCol).toBeLessThan(7.5);
  expect(visionMediaLayout!.centerGap).toBeGreaterThan(40);
  expect(visionMediaLayout!.sameRow).toBe(true);
  expect(visionMediaLayout!.imgAboveTitle).toBe(true);

  // Subtle image scale toward center+up; title stays put.
  const tunnelTitleBefore = await tunnelCard.locator("h4").boundingBox();
  await tunnelCard.locator("img").hover();
  await page.waitForTimeout(600);
  const tunnelHover = await tunnelCard.evaluate((el) => {
    const img = el.querySelector("img") as HTMLImageElement;
    const title = el.querySelector("h4") as HTMLElement;
    return {
      scale: getComputedStyle(img).transform,
      titleTop: title.getBoundingClientRect().top,
      imgWidth: img.getBoundingClientRect().width,
    };
  });
  expect(tunnelHover.scale).toMatch(/matrix/);
  expect(tunnelHover.scale).not.toBe("none");
  expect(tunnelHover.scale).not.toBe("matrix(1, 0, 0, 1, 0, 0)");
  expect(Math.abs(tunnelHover.titleTop - (tunnelTitleBefore?.y ?? 0))).toBeLessThan(2);
  await page.mouse.move(0, 0);
  await page.waitForTimeout(500);

  const visionSolution = page.locator("[data-ogen-vision-solution]");
  await expect(visionSolution).toBeVisible();
  const solutionSpan = await visionSolution.evaluate((element) => {
    const pageGrid = element.parentElement;
    if (!pageGrid) return null;
    const styles = getComputedStyle(pageGrid);
    const colGap = Number.parseFloat(styles.columnGap) || 0;
    const gridWidth = pageGrid.getBoundingClientRect().width;
    const colWidth = (gridWidth - colGap * 7) / 8;
    const gridLeft = pageGrid.getBoundingClientRect().left;
    const rect = element.getBoundingClientRect();
    return {
      className: element.className,
      startCol: (rect.left - gridLeft) / (colWidth + colGap) + 1,
      endCol: (rect.right - gridLeft + colGap) / (colWidth + colGap),
      imgSrc: (document.querySelector('[data-ogen-vision-phenomenon="Night Blind Spot"] img') as HTMLImageElement | null)?.currentSrc ?? "",
    };
  });
  expect(solutionSpan).not.toBeNull();
  expect(solutionSpan!.className).toMatch(/md:col-span-5/);
  expect(solutionSpan!.startCol).toBeGreaterThan(2.5);
  expect(solutionSpan!.startCol).toBeLessThan(3.5);
  expect(solutionSpan!.endCol).toBeGreaterThan(6.5);
  expect(solutionSpan!.endCol).toBeLessThan(7.5);
  expect(solutionSpan!.imgSrc).toMatch(/Night_blind_spot_cklv73/i);
  const uxUiBox = await visionSolution.locator("[data-ogen-ux-ui-solution]").evaluate((element) => {
    const styles = getComputedStyle(element);
    const title = element.querySelector("h4");
    const body = element.querySelector("p");
    return {
      radius: styles.borderRadius,
      backgroundImage: styles.backgroundImage,
      titleColor: title ? getComputedStyle(title).color : "",
      bodyColor: body ? getComputedStyle(body).color : "",
    };
  });
  expect(uxUiBox.radius).toMatch(/^6px/);
  expect(uxUiBox.backgroundImage).toContain("radial-gradient");
  expect(uxUiBox.backgroundImage).toMatch(/rgb\(42,\s*35,\s*114\).*rgb\(0,\s*0,\s*0\)|#2a2372.*#000000/i);
  expect(uxUiBox.titleColor).toMatch(/^(rgb\(255,\s*255,\s*255\)|#ffffff)$/i);
  expect(uxUiBox.bodyColor).toMatch(/^(rgb\(255,\s*255,\s*255\)|#ffffff)$/i);
  await expect(
    visionSolution.getByRole("img", { name: "OGEN system mockup in operational dark mode" }),
  ).toBeVisible();
  await expect
    .poll(async () =>
      visionSolution
        .getByRole("img", { name: "OGEN system mockup in operational dark mode" })
        .evaluate((img) => (img as HTMLImageElement).currentSrc),
    )
    .toMatch(/System_Mockup_Night_zezhb6/i);
  await page.waitForTimeout(1200);

  const personaHeading = page.getByRole("heading", { name: "User Persona", level: 2 }).last();
  await personaHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);

  const personaImage = page.getByRole("img", { name: "Population NCO user persona" });
  await expect(personaImage).toBeVisible();
  const personaCard = page.locator("[data-ogen-persona-card]");
  await expect
    .poll(async () => personaCard.evaluate((element) => getComputedStyle(element).backgroundImage))
    .toContain("radial-gradient");
  await expect
    .poll(async () => personaCard.evaluate((element) => getComputedStyle(element).backgroundImage))
    .toMatch(/rgb\(42,\s*35,\s*114\).*rgb\(0,\s*0,\s*0\)|#2a2372.*#000000/i);

  const personaLayout = await personaCard.evaluate((cardEl) => {
    const image = cardEl.querySelector("img");
    const cardRect = cardEl.getBoundingClientRect();
    const imageRect = image?.getBoundingClientRect();
    const titles = [...cardEl.querySelectorAll("h4")].map((node) => node.textContent?.trim());
    const roleText =
      [...cardEl.querySelectorAll("h4")]
        .find((node) => node.textContent?.trim() === "Role")
        ?.nextElementSibling?.textContent?.trim() ?? "";
    const ageText =
      [...cardEl.querySelectorAll("h4")]
        .find((node) => node.textContent?.trim() === "Age")
        ?.nextElementSibling?.textContent?.trim() ?? "";
    return {
      topGap: imageRect ? Math.abs(imageRect.top - cardRect.top) : -1,
      bottomGap: imageRect ? Math.abs(cardRect.bottom - imageRect.bottom) : -1,
      rightGap: imageRect ? Math.abs(cardRect.right - imageRect.right) : -1,
      imageOnRight: imageRect ? imageRect.left > cardRect.left + cardRect.width * 0.35 : false,
      imageWidthRatio: imageRect ? imageRect.width / cardRect.width : 0,
      textTopPad: (() => {
        const textCol = cardEl.querySelector("div.flex.flex-col");
        const first = textCol?.querySelector("h4");
        if (!textCol || !first) return -1;
        return first.getBoundingClientRect().top - textCol.getBoundingClientRect().top;
      })(),
      textBottomPad: (() => {
        const textCol = cardEl.querySelector("div.flex.flex-col");
        const fields = textCol?.querySelectorAll("p");
        const last = fields?.[fields.length - 1];
        if (!textCol || !last) return -1;
        return textCol.getBoundingClientRect().bottom - last.getBoundingClientRect().bottom;
      })(),
      titles,
      roleText,
      ageText,
      radius: Number.parseFloat(getComputedStyle(cardEl).borderRadius),
      hasTableBorders: [...cardEl.querySelectorAll("div")].some((node) =>
        node.className.includes("border-b"),
      ),
    };
  });
  expect(personaLayout.topGap).toBeLessThan(2);
  expect(personaLayout.bottomGap).toBeLessThan(2);
  expect(personaLayout.rightGap).toBeLessThan(2);
  expect(personaLayout.imageOnRight).toBe(true);
  expect(personaLayout.imageWidthRatio).toBeGreaterThan(0.45);
  expect(personaLayout.textTopPad).toBeGreaterThan(12);
  expect(Math.abs(personaLayout.textTopPad - personaLayout.textBottomPad)).toBeLessThan(8);
  expect(personaLayout.titles).toEqual([
    "Role",
    "Age",
    "Characteristics",
    "Tech Literacy",
    "Core Needs",
  ]);
  expect(personaLayout.roleText).toBe("Field Population NCO");
  expect(personaLayout.ageText).toBe("25–30");
  expect(personaLayout.radius).toBe(6);
  expect(personaLayout.hasTableBorders).toBe(false);
  await page.waitForTimeout(1200);

  const architectureHeading = page.getByRole("heading", { name: "Architecture", level: 2 }).last();
  await expect(architectureHeading).toBeVisible();
  await architectureHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  // Architecture title sticks above the diagrams while scrolling (like Research / Design).
  expect(await architectureHeading.evaluate((el) => getComputedStyle(el).position)).toBe("sticky");

  const informationArchitectureHeading = page.getByRole("heading", {
    name: "Information Architecture",
    level: 3,
  });
  await informationArchitectureHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);

  // IA title-to-diagram gap stays compact (gap-12 = 48px). User Flow keeps pb-12 under the diagram.
  const archGaps = await informationArchitectureHeading.evaluate((heading) => {
    const section = heading.closest("section");
    const iaDiagram = section?.querySelector('[data-ogen-diagram="information-architecture"]');
    const userFlow = section?.querySelector("[data-ogen-user-flow]");
    const flowDiagram = section?.querySelector('[data-ogen-diagram="user-flow"]');
    if (!iaDiagram || !userFlow || !flowDiagram) return null;
    return {
      titleToIa: iaDiagram.getBoundingClientRect().top - heading.getBoundingClientRect().bottom,
      belowFlow: userFlow.getBoundingClientRect().bottom - flowDiagram.getBoundingClientRect().bottom,
    };
  });
  expect(archGaps).not.toBeNull();
  expect(archGaps!.titleToIa).toBeGreaterThan(36);
  expect(archGaps!.titleToIa).toBeLessThan(60);
  expect(Math.abs(archGaps!.titleToIa - archGaps!.belowFlow)).toBeLessThan(4);

  // IA is a Design-style semi-title inside Architecture (not its own sticky section).
  await expect(page.getByRole("heading", { name: "Information Architecture", level: 2 })).toHaveCount(
    0,
  );
  await expect(page.getByRole("heading", { name: "Architecture", level: 2 }).last()).toBeVisible();
  expect(
    await page
      .getByRole("heading", { name: "Architecture", level: 2 })
      .last()
      .evaluate((el) => getComputedStyle(el).position),
  ).toBe("sticky");

  const iaBlock = page.locator("[data-ogen-information-architecture]");
  await expect(iaBlock).toHaveClass(/col-span-8/);
  await expect(iaBlock).toHaveClass(/md:col-span-6/);
  await expect(iaBlock).toHaveClass(/md:col-start-3/);

  // Architecture marker shares the top row with the IA semi-title (like other sections).
  await page.getByRole("heading", { name: "Architecture", level: 2 }).last().scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  const sameRow = await page.evaluate(() => {
    const archTitle = [...document.querySelectorAll("h2")].find(
      (node) =>
        node.textContent?.trim() === "Architecture" &&
        getComputedStyle(node).display !== "none" &&
        node.offsetParent !== null,
    );
    const titleRow = document.querySelector("[data-ogen-architecture-title-row]");
    if (!archTitle || !titleRow) return false;
    return Math.abs(archTitle.getBoundingClientRect().top - titleRow.getBoundingClientRect().top) < 48;
  });
  expect(sameRow).toBe(true);

  const architectureDiagram = page.locator('[data-ogen-diagram="information-architecture"]');
  await expect(architectureDiagram).toBeVisible();
  await expect(architectureDiagram).toContainText("Status Overview");
  await expect(architectureDiagram).toContainText("Yahalom Unit");
  await expect(architectureDiagram).toContainText("Add New Person");
  await expect(architectureDiagram).toContainText("Full List");
  await expect(architectureDiagram).toContainText("Detailed Report View");
  await expect(architectureDiagram).toContainText("Battalion Direct Chat");
  await expect(architectureDiagram.getByText("Sort by Category")).toHaveCount(0);
  await expect(architectureDiagram.getByText("Battalion Chat", { exact: true })).toHaveCount(0);
  expect(await architectureDiagram.evaluate((element) => element.scrollWidth)).toBe(
    await architectureDiagram.evaluate((element) => element.clientWidth),
  );
  await expect
    .poll(async () =>
      architectureDiagram.evaluate((element) => getComputedStyle(element).backgroundColor),
    )
    .toMatch(/^(rgba\(0, 0, 0, 0\)|transparent)$/);

  const topLevelLabel = architectureDiagram.getByText("Building Schematic", { exact: true });
  const detailLabel = architectureDiagram.getByText("Structure Definition", { exact: true });
  const [
    topLevelSize,
    detailSize,
    cornerRadius,
    topBg,
    detailBg,
    lineBg,
    topHeight,
    detailHeight,
  ] = await Promise.all([
    topLevelLabel.evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize)),
    detailLabel.evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize)),
    topLevelLabel
      .locator("xpath=..")
      .evaluate((element) => Number.parseFloat(getComputedStyle(element).borderRadius)),
    topLevelLabel.locator("xpath=..").evaluate((element) => getComputedStyle(element).backgroundColor),
    detailLabel.locator("xpath=..").evaluate((element) => getComputedStyle(element).backgroundColor),
    architectureDiagram.evaluate((element) => {
      const line =
        element.querySelector("[data-ogen-ia-bus]") ??
        element.querySelector("[data-ogen-ia-trunk]");
      if (!line) return "";
      // SVG stroke or CSS background, depending on connector implementation.
      const stroke = line.getAttribute("stroke");
      if (stroke) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return stroke;
        ctx.fillStyle = stroke;
        return ctx.fillStyle;
      }
      return getComputedStyle(line as Element).backgroundColor;
    }),
    topLevelLabel.locator("xpath=..").evaluate((element) => element.getBoundingClientRect().height),
    detailLabel.locator("xpath=..").evaluate((element) => element.getBoundingClientRect().height),
  ]);

  expect(topLevelSize).toBeGreaterThan(detailSize);
  // Compared to User Flow after that diagram is measured below.
  const iaTopLevelSize = topLevelSize;
  expect(detailSize).toBeGreaterThanOrEqual(22);
  expect(topHeight).toBeGreaterThan(detailHeight);
  expect(topBg).toBe("rgb(29, 24, 56)");
  expect(detailBg).toBe("rgb(53, 45, 106)");
  expect(lineBg.replace(/\s/g, "").toLowerCase()).toMatch(/^(rgb\(95,77,229\)|#5f4de5)$/);
  expect(cornerRadius).toBe(6);

  // One straight bus; endpoints land on the outer category centers.
  await expect.poll(async () => architectureDiagram.locator("[data-ogen-ia-bus]").count()).toBe(1);
  const busAlignment = await architectureDiagram.evaluate((element) => {
    const bus = element.querySelector("[data-ogen-ia-bus]");
    const categories = [...element.querySelectorAll('[data-ia-node="category"]')];
    if (!bus || categories.length < 2) return null;
    const busRect = bus.getBoundingClientRect();
    const first = categories[0].getBoundingClientRect();
    const last = categories[categories.length - 1].getBoundingClientRect();
    return {
      leftGap: Math.abs(busRect.left - (first.left + first.width / 2)),
      rightGap: Math.abs(busRect.right - (last.left + last.width / 2)),
      // Bus must be a single horizontal (no stepped Y extent).
      height: busRect.height,
    };
  });
  expect(busAlignment).not.toBeNull();
  expect(busAlignment!.leftGap).toBeLessThan(1.5);
  expect(busAlignment!.rightGap).toBeLessThan(1.5);
  expect(busAlignment!.height).toBeLessThan(3);

  // Trunk spine is one continuous line through System Entry and Dashboard centers.
  const trunkAlignment = await architectureDiagram.evaluate((element) => {
    const trunk = element.querySelector("[data-ogen-ia-trunk]");
    const system = element.querySelector('[data-ia-node="system"]');
    const dashboard = element.querySelector('[data-ia-node="dashboard"]');
    if (!trunk || !system || !dashboard) return null;
    const trunkRect = trunk.getBoundingClientRect();
    const systemRect = system.getBoundingClientRect();
    const dashboardRect = dashboard.getBoundingClientRect();
    const trunkCenter = trunkRect.left + trunkRect.width / 2;
    return {
      systemGap: Math.abs(trunkCenter - (systemRect.left + systemRect.width / 2)),
      dashboardGap: Math.abs(trunkCenter - (dashboardRect.left + dashboardRect.width / 2)),
    };
  });
  expect(trunkAlignment).not.toBeNull();
  expect(trunkAlignment!.systemGap).toBeLessThan(1.5);
  expect(trunkAlignment!.dashboardGap).toBeLessThan(1.5);

  // All category big boxes share one width (and "Important Documents" → "Documents").
  await expect(architectureDiagram).toContainText("Documents");
  await expect(architectureDiagram.getByText("Important Documents")).toHaveCount(0);
  const categoryWidths = await architectureDiagram.evaluate((element) => {
    const labels = [
      "Status Overview",
      "Anchor List",
      "Battalion Reports",
      "Building Schematic",
      "NCO Aids",
      "Interview Forms",
      "Documents",
    ];
    return labels.map((label) => {
      const span = [...element.querySelectorAll("span")].find((node) => node.textContent === label);
      return span?.parentElement?.getBoundingClientRect().width ?? 0;
    });
  });
  expect(categoryWidths.every((width) => width > 0)).toBe(true);
  const uniqueWidths = new Set(categoryWidths.map((width) => Number(width.toFixed(1))));
  expect(uniqueWidths.size).toBe(1);

  // Gaps between adjacent category boxes are uniform (equal-width columns).
  const categoryGaps = await architectureDiagram.evaluate((element) => {
    const boxes = [...element.querySelectorAll('[data-ia-node="category"]')].map((node) =>
      node.getBoundingClientRect(),
    );
    const gaps: number[] = [];
    for (let index = 1; index < boxes.length; index += 1) {
      gaps.push(Number((boxes[index].left - boxes[index - 1].right).toFixed(1)));
    }
    return gaps;
  });
  const gapSpread = Math.max(...categoryGaps) - Math.min(...categoryGaps);
  expect(gapSpread).toBeLessThan(1.5);
  await page.waitForTimeout(1500);

  const userFlowHeading = page.getByRole("heading", { name: "User Flow", level: 3 });
  await userFlowHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);

  const flowDiagram = page.locator('[data-ogen-diagram="user-flow"]');
  await expect(flowDiagram).toBeVisible();
  await expect(flowDiagram).toContainText("Closing Population Story");
  await expect(flowDiagram).toContainText("Status Overview");
  await expect.poll(async () => flowDiagram.locator("line[stroke]").count()).toBeGreaterThan(8);

  const flowNodeMetrics = await flowDiagram.evaluate((element) => {
    const nodes = [...element.querySelectorAll("div")].filter(
      (node) =>
        node.className.includes("h-24") &&
        node.className.includes("w-full") &&
        node.className.includes("bg-[#1D1838]"),
    );
    const line = element.querySelector("line[stroke]");
    return {
      nodes: nodes.map((node) => {
        const text = node.querySelector("span");
        const rect = node.getBoundingClientRect();
        return {
          height: Number(rect.height.toFixed(2)),
          left: Number(rect.left.toFixed(1)),
          right: Number(rect.right.toFixed(1)),
          top: Number(rect.top.toFixed(1)),
          width: Number(rect.width.toFixed(1)),
          bg: getComputedStyle(node).backgroundColor,
          whiteSpace: text ? getComputedStyle(text).whiteSpace : "",
          wraps: text ? text.getClientRects().length > 1 : false,
          textFits: text ? text.scrollWidth <= node.clientWidth + 1 : false,
          label: text?.textContent ?? "",
        };
      }),
      shellBg: getComputedStyle(element).backgroundColor,
      lineStroke: line?.getAttribute("stroke") ?? "",
      lineWidths: [...element.querySelectorAll("line[stroke]")].map(
        (node) => node.getAttribute("stroke-width") ?? node.getAttribute("strokeWidth") ?? "",
      ),
      lineStrokes: [...element.querySelectorAll("line[stroke]")].map(
        (node) => node.getAttribute("stroke") ?? "",
      ),
    };
  });

  expect(flowNodeMetrics.nodes.length).toBe(10);
  expect(flowNodeMetrics.shellBg === "rgba(0, 0, 0, 0)" || flowNodeMetrics.shellBg === "transparent").toBe(
    true,
  );
  expect(flowNodeMetrics.lineStroke.toLowerCase()).toBe("#5f4de5");
  // Every connector (gaps, stairs) shares one stroke color and weight.
  expect(flowNodeMetrics.lineStrokes.length).toBeGreaterThan(8);
  expect(new Set(flowNodeMetrics.lineStrokes.map((stroke) => stroke.toLowerCase())).size).toBe(1);
  expect(new Set(flowNodeMetrics.lineWidths).size).toBe(1);
  expect(flowNodeMetrics.lineWidths[0]).toBe("2.5");
  // User Flow uses a dedicated larger "flow" type.
  const sharedBigFont = await flowDiagram.evaluate((element) => {
    const flowText = [...element.querySelectorAll("span")].find(
      (node) => node.textContent === "System Entry",
    );
    return flowText ? Number.parseFloat(getComputedStyle(flowText).fontSize) : 0;
  });
  expect(sharedBigFont).toBeGreaterThanOrEqual(34);
  expect(sharedBigFont).toBeGreaterThan(iaTopLevelSize);
  const heights = new Set(flowNodeMetrics.nodes.map((node) => node.height));
  expect(heights.size).toBe(1);
  const widths = new Set(flowNodeMetrics.nodes.map((node) => node.width));
  expect(widths.size).toBe(1);
  // Three rows contain 4, 4, and 2 nodes.
  const rowCounts = [...new Set(flowNodeMetrics.nodes.map((node) => node.top))]
    .sort((a, b) => a - b)
    .map((top) => flowNodeMetrics.nodes.filter((node) => node.top === top).length);
  expect(rowCounts).toEqual([4, 4, 2]);
  // The two full rows align to the same left and right edges.
  const col1Left = flowNodeMetrics.nodes[0].left;
  expect(Math.abs(flowNodeMetrics.nodes[4].left - col1Left)).toBeLessThan(1.5);
  const col4Right = flowNodeMetrics.nodes[3].right;
  expect(Math.abs(flowNodeMetrics.nodes[7].right - col4Right)).toBeLessThan(1.5);
  // Final row starts at the left edge (two nodes).
  expect(Math.abs(flowNodeMetrics.nodes[8].left - col1Left)).toBeLessThan(1.5);
  // Two long stair connectors reset the flow from column 4 back to column 1.
  expect(await flowDiagram.locator("[data-ogen-flow-stair]").count()).toBe(2);
  await expect
    .poll(async () => flowDiagram.locator("line[stroke]").count())
    .toBeGreaterThan(8);
  const stairSpan = await flowDiagram.evaluate((element) => {
    const lines = [...element.querySelectorAll("line")];
    const horizontal = lines
      .map((line) => {
        const y1 = Number(line.getAttribute("y1"));
        const y2 = Number(line.getAttribute("y2"));
        const x1 = Number(line.getAttribute("x1"));
        const x2 = Number(line.getAttribute("x2"));
        return { width: Math.abs(x2 - x1), isHorizontal: Math.abs(y2 - y1) < 0.5 };
      })
      .filter((line) => line.isHorizontal)
      .sort((a, b) => b.width - a.width)[0];
    return horizontal?.width ?? 0;
  });
  expect(stairSpan).toBeGreaterThan(flowNodeMetrics.nodes[0].width);
  for (const node of flowNodeMetrics.nodes) {
    expect(node.bg).toBe("rgb(29, 24, 56)");
    expect(node.whiteSpace).toBe("nowrap");
    expect(node.wraps).toBe(false);
    expect(node.textFits, `label overflows: ${node.label}`).toBe(true);
  }

  expect(await flowDiagram.evaluate((element) => element.scrollWidth)).toBe(
    await flowDiagram.evaluate((element) => element.clientWidth),
  );

  // User Flow spans page columns 3–8.
  const architectureColumn = page.locator("[data-ogen-architecture-column]");
  const flowSpan = await architectureColumn.evaluate((element) => {
    const grid = element.parentElement;
    if (!grid) return null;
    const styles = getComputedStyle(grid);
    const colGap = Number.parseFloat(styles.columnGap) || 0;
    const gridWidth = grid.getBoundingClientRect().width;
    const colWidth = (gridWidth - colGap * 7) / 8;
    const rect = element.getBoundingClientRect();
    const gridLeft = grid.getBoundingClientRect().left;
    return {
      className: element.className,
      startCol: (rect.left - gridLeft) / (colWidth + colGap) + 1,
      endCol: (rect.right - gridLeft + colGap) / (colWidth + colGap),
    };
  });
  expect(flowSpan).not.toBeNull();
  expect(flowSpan!.className).toMatch(/md:col-start-3/);
  expect(flowSpan!.className).toMatch(/md:col-span-6/);
  expect(flowSpan!.startCol).toBeGreaterThan(2.5);
  expect(flowSpan!.startCol).toBeLessThan(3.5);
  expect(flowSpan!.endCol).toBeGreaterThan(7.5);
  expect(flowSpan!.endCol).toBeLessThan(8.5);

  const prototypeVideo = page.locator("[data-ogen-prototype-video]");
  await prototypeVideo.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  await expect(prototypeVideo.getByTitle("OGEN prototype walkthrough")).toBeVisible();
  await expect
    .poll(async () =>
      prototypeVideo.locator("video").evaluate((el) => (el as HTMLVideoElement).currentSrc),
    )
    .toMatch(/OGEN_Prototype/i);
  // Between IA diagram and User Flow; starts at page column 3.
  const prototypePlacement = await page.evaluate(() => {
    const ia = document.querySelector('[data-ogen-diagram="information-architecture"]');
    const flowHeading = [...document.querySelectorAll("h3")].find(
      (node) => node.textContent?.trim() === "User Flow",
    );
    const prototype = document.querySelector("[data-ogen-prototype-video]");
    const grid = prototype?.parentElement;
    if (!ia || !flowHeading || !prototype || !grid) return null;
    const styles = getComputedStyle(grid);
    const colGap = Number.parseFloat(styles.columnGap) || 0;
    const gridWidth = grid.getBoundingClientRect().width;
    const colWidth = (gridWidth - colGap * 7) / 8;
    const gridLeft = grid.getBoundingClientRect().left;
    const rect = prototype.getBoundingClientRect();
    const video = prototype.querySelector("video");
    const wrap = video?.parentElement;
    return {
      afterIa: rect.top >= ia.getBoundingClientRect().bottom - 2,
      beforeFlow: rect.bottom <= flowHeading.getBoundingClientRect().top + 2,
      startCol: (rect.left - gridLeft) / (colWidth + colGap) + 1,
      className: prototype.className,
      hasRadius: wrap ? getComputedStyle(wrap).borderRadius !== "0px" : false,
    };
  });
  expect(prototypePlacement).not.toBeNull();
  expect(prototypePlacement!.afterIa).toBe(true);
  expect(prototypePlacement!.beforeFlow).toBe(true);
  expect(prototypePlacement!.className).toMatch(/md:col-start-3/);
  expect(prototypePlacement!.startCol).toBeGreaterThan(2.5);
  expect(prototypePlacement!.startCol).toBeLessThan(3.5);
  expect(prototypePlacement!.hasRadius).toBe(true);

  // Prototype is cropped to the iPad (backdrop removed) with an iPad-shaped corner radius.
  const prototypeCrop = await prototypeVideo.evaluate((el) => {
    const wrap = el.firstElementChild as HTMLElement | null;
    const video = el.querySelector("video");
    if (!wrap || !video) return null;
    const wrapStyle = getComputedStyle(wrap);
    const videoStyle = getComputedStyle(video);
    const left = Number.parseFloat(video.style.left);
    const top = Number.parseFloat(video.style.top);
    return {
      borderRadius: wrapStyle.borderRadius,
      clipPath: videoStyle.clipPath || video.style.clipPath,
      leftPct: left,
      topPct: top,
      widerThanTall: wrap.getBoundingClientRect().width > wrap.getBoundingClientRect().height,
    };
  });
  expect(prototypeCrop).not.toBeNull();
  expect(prototypeCrop!.borderRadius).not.toBe("0px");
  expect(prototypeCrop!.clipPath.toLowerCase()).toContain("round");
  // Cropped device framing: video is scaled up and shifted in (negative left/top %).
  expect(prototypeCrop!.leftPct).toBeLessThan(-15);
  expect(prototypeCrop!.topPct).toBeLessThan(-4);
  expect(prototypeCrop!.widerThanTall).toBe(true);

  // Equal vertical gaps above and below the video frame (padding on the prototype cell).
  const equalGaps = await page.evaluate(() => {
    const ia = document.querySelector('[data-ogen-diagram="information-architecture"]');
    const cell = document.querySelector("[data-ogen-prototype-video]");
    const videoWrap = cell?.firstElementChild as HTMLElement | null;
    const flowHeading = [...document.querySelectorAll("h3")].find(
      (node) => node.textContent?.trim() === "User Flow",
    );
    if (!ia || !cell || !videoWrap || !flowHeading) return null;
    const gapAbove = videoWrap.getBoundingClientRect().top - ia.getBoundingClientRect().bottom;
    const gapBelow = flowHeading.getBoundingClientRect().top - videoWrap.getBoundingClientRect().bottom;
    return { gapAbove, gapBelow, delta: Math.abs(gapAbove - gapBelow) };
  });
  expect(equalGaps).not.toBeNull();
  expect(equalGaps!.gapAbove).toBeGreaterThan(40);
  expect(equalGaps!.delta).toBeLessThan(8);

  await expect(page.getByRole("heading", { name: "Design", level: 2 }).last()).toBeVisible();
  const lowFidelityHeading = page.getByRole("heading", { name: "Low Fidelity", level: 3 });
  await page.getByRole("heading", { name: "Design", level: 2 }).last().scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await lowFidelityHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);

  await expect(page.getByRole("heading", { name: "Low Fidelity", level: 2 })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "High Fidelity", level: 2 })).toHaveCount(0);

  const pillarList = page.locator("[data-ogen-wireframe-pillars]");
  const pillarTitles = [
    "Status Overview",
    "Anchor List",
    "Battalion Reports",
    "Building Schematic",
    "Tools & Resources",
  ];
  for (const title of pillarTitles) {
    await expect(pillarList.getByRole("heading", { name: title, level: 4 })).toBeVisible();
  }
  await expect(pillarList.getByRole("heading", { name: "Auxiliary Tools", level: 4 })).toHaveCount(0);

  // Single vertical list: 01 → 05 top to bottom.
  const pillarBoxes = await Promise.all(
    [1, 2, 3, 4, 5].map((pillar) =>
      pillarList.locator(`[data-ogen-pillar="${pillar}"]`).evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return { top: rect.top, left: rect.left, right: rect.right };
      }),
    ),
  );
  expect(pillarBoxes.every((box, index) => index === 0 || box.top > pillarBoxes[index - 1].top + 20)).toBe(
    true,
  );
  expect(Math.abs(pillarBoxes[0].left - pillarBoxes[4].left)).toBeLessThan(8);

  const wireframePlaceholder = page.locator("[data-ogen-wireframe-media]");
  await expect(wireframePlaceholder).toBeVisible();
  await expect(wireframePlaceholder.locator("img")).toBeVisible();
  await expect(wireframePlaceholder.locator("[data-ogen-wireframe-slot]")).toHaveCount(0);

  await expect(page.getByText(/five essential pillars required for the interface, ordered by priority:/)).toBeVisible();
  await expect(pillarList.getByText("Files, SOPs, interview forms, important contacts.")).toBeVisible();
  await expect(pillarList.getByText(/emergency contacts/)).toHaveCount(0);
  await expect(pillarList.getByText(/forms, and emergency/)).toHaveCount(0);

  const lowFiIntroSpan = await page
    .getByText(/five essential pillars required for the interface, ordered by priority:/)
    .evaluate((el) => {
      const designCol = el.closest("[data-ogen-design-column]");
      if (!designCol?.parentElement) return null;
      const pageGrid = designCol.parentElement;
      const styles = getComputedStyle(pageGrid);
      const colGap = Number.parseFloat(styles.columnGap) || 0;
      const gridWidth = pageGrid.getBoundingClientRect().width;
      const colWidth = (gridWidth - colGap * 7) / 8;
      const gridLeft = pageGrid.getBoundingClientRect().left;
      const rect = designCol.getBoundingClientRect();
      const introRect = el.getBoundingClientRect();
      return {
        className: (designCol as HTMLElement).className,
        endCol: (rect.right - gridLeft + colGap) / (colWidth + colGap),
        introWidthRatio: introRect.width / rect.width,
      };
    });
  expect(lowFiIntroSpan).not.toBeNull();
  expect(lowFiIntroSpan!.className).toMatch(/md:col-span-5/);
  expect(lowFiIntroSpan!.endCol).toBeGreaterThan(7.5);
  expect(lowFiIntroSpan!.endCol).toBeLessThan(8.5);
  expect(lowFiIntroSpan!.introWidthRatio).toBeLessThan(0.75);

  // Media sits right of the list with a clear gap; design column spans page columns 3–8.
  const [listBox, mediaBox, wireframeSpan] = await Promise.all([
    pillarList.locator('[data-ogen-pillar="1"]').evaluate((element) => {
      const column = element.parentElement;
      return column?.getBoundingClientRect() ?? null;
    }),
    wireframePlaceholder.evaluate((element) => element.getBoundingClientRect()),
    page.locator("[data-ogen-design-column]").evaluate((element) => {
      const pageGrid = element.parentElement;
      if (!pageGrid) return null;
      const styles = getComputedStyle(pageGrid);
      const colGap = Number.parseFloat(styles.columnGap) || 0;
      const gridWidth = pageGrid.getBoundingClientRect().width;
      const colWidth = (gridWidth - colGap * 7) / 8;
      const gridLeft = pageGrid.getBoundingClientRect().left;
      const rect = element.getBoundingClientRect();
      return {
        className: element.className,
        startCol: (rect.left - gridLeft) / (colWidth + colGap) + 1,
        endCol: (rect.right - gridLeft + colGap) / (colWidth + colGap),
      };
    }),
  ]);
  expect(listBox).not.toBeNull();
  expect(mediaBox.left).toBeGreaterThan(listBox!.right + 24);
  expect(mediaBox.width).toBeGreaterThan(listBox!.width);
  // Pillars column stretches to the wireframe height (01 top / 05 bottom align with image).
  expect(Math.abs(listBox!.height - mediaBox.height)).toBeLessThan(4);
  expect(Math.abs(listBox!.top - mediaBox.top)).toBeLessThan(4);
  expect(Math.abs(listBox!.bottom - mediaBox.bottom)).toBeLessThan(4);
  expect(wireframeSpan).not.toBeNull();
  expect(wireframeSpan!.className).toMatch(/md:col-span-5/);
  expect(wireframeSpan!.startCol).toBeGreaterThan(2.5);
  expect(wireframeSpan!.startCol).toBeLessThan(3.5);
  expect(wireframeSpan!.endCol).toBeGreaterThan(7.5);
  expect(wireframeSpan!.endCol).toBeLessThan(8.5);
  await page.waitForTimeout(1500);

  const highFidelityHeading = page.getByRole("heading", { name: "High Fidelity", level: 3 });
  await highFidelityHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);

  const hifiCarousel = page.locator("[data-ogen-hifi-carousel]");
  await expect(hifiCarousel).toBeVisible();
  const hifiGrid = page.locator("[data-ogen-hifi-screens]");
  const hifiGroups: Array<[string, number]> = [
    ["Dashboard", 1],
    ["Anchor List", 1],
    ["Anchor List pop up", 1],
    ["Battalion Reports", 1],
    ["Battalion Reports pop up", 1],
  ];
  for (const [title, screens] of hifiGroups) {
    await expect(hifiGrid.locator(`[data-ogen-hifi-screen="${title}"]`)).toHaveCount(screens);
    await expect(hifiGrid.locator(`[data-ogen-hifi-screen="${title}"] img`)).toHaveCount(screens);
    await expect(hifiGrid.getByRole("heading", { name: title, level: 4, exact: true })).toHaveCount(screens);
  }
  expect(await hifiGrid.locator("[data-ogen-hifi-screen]").count()).toBe(5);

  // Walk each slide into view so the reviewer video shows title + still.
  const hifiSlideTitles = [
    "Dashboard",
    "Anchor List",
    "Anchor List pop up",
    "Battalion Reports",
    "Battalion Reports pop up",
  ];
  for (const title of hifiSlideTitles) {
    const slide = hifiGrid.locator(`[data-ogen-hifi-screen="${title}"]`);
    await slide.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);
    await expect(slide.getByRole("heading", { name: title, level: 4, exact: true })).toBeVisible();
    await expect(slide.locator("img")).toBeVisible();
  }

  // Horizontal drag carousel; all five stills share one half-viewport width and one height.
  const hifiLayout = await hifiCarousel.evaluate((el) => {
    const overflowX = getComputedStyle(el).overflowX;
    const slides = [...el.querySelectorAll("[data-ogen-hifi-screen]")];
    return {
      overflowX,
      canScroll: el.scrollWidth > el.clientWidth + 8,
      titles: slides.map((slide) => slide.getAttribute("data-ogen-hifi-screen") ?? ""),
      total: slides.length,
    };
  });
  expect(["auto", "scroll", "overlay"]).toContain(hifiLayout.overflowX);
  expect(hifiLayout.canScroll).toBe(true);
  expect(hifiLayout.total).toBe(5);
  expect(hifiLayout.titles).toEqual(hifiSlideTitles);

  await expect
    .poll(async () =>
      hifiGrid.evaluate((element) =>
        [...element.querySelectorAll("[data-ogen-hifi-screen] img")].every(
          (img) => (img as HTMLImageElement).naturalWidth > 0,
        ),
      ),
    )
    .toBe(true);
  await expect
    .poll(async () =>
      hifiGrid.evaluate((element) => {
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
  const hifiSizes = await hifiGrid.evaluate((element) => {
    const cells = [...element.querySelectorAll("[data-ogen-hifi-screen]")].map((node) => {
      const rect = node.getBoundingClientRect();
      return {
        title: node.getAttribute("data-ogen-hifi-screen") ?? "",
        width: Number(rect.width.toFixed(1)),
        height: Number(rect.height.toFixed(1)),
        src: (node.querySelector("img") as HTMLImageElement | null)?.currentSrc ?? "",
      };
    });
    return cells;
  });
  expect(hifiSizes.length).toBe(5);
  expect(Math.max(...hifiSizes.map((cell) => cell.width)) - Math.min(...hifiSizes.map((cell) => cell.width))).toBeLessThanOrEqual(1);
  expect(Math.max(...hifiSizes.map((cell) => cell.height)) - Math.min(...hifiSizes.map((cell) => cell.height))).toBeLessThanOrEqual(2);
  expect(hifiSizes.some((cell) => /High_fidelity_Dashboard/i.test(cell.src))).toBe(true);
  // High Fidelity shows titles + media only — no long screen body copy in this section.
  await expect(hifiGrid.getByText(/Users log in to the system/)).toHaveCount(0);

  // Placeholders occupy page columns 3–8 (one column wider than the usual 3–7 content band).
  const hifiColumn = page.locator("[data-ogen-hifi-column]");
  const hifiSpan = await page.locator("[data-ogen-design-column]").evaluate((element) => {
    const grid = element.parentElement;
    if (!grid) return null;
    const styles = getComputedStyle(grid);
    const colGap = Number.parseFloat(styles.columnGap) || 0;
    const gridWidth = grid.getBoundingClientRect().width;
    const colWidth = (gridWidth - colGap * 7) / 8;
    const rect = element.getBoundingClientRect();
    const gridLeft = grid.getBoundingClientRect().left;
    const startCol = (rect.left - gridLeft) / (colWidth + colGap) + 1;
    const endCol = (rect.right - gridLeft + colGap) / (colWidth + colGap);
    return { startCol, endCol, className: element.className };
  });
  expect(hifiColumn).toBeVisible();
  expect(hifiSpan).not.toBeNull();
  expect(hifiSpan!.className).toMatch(/md:col-span-5/);
  expect(hifiSpan!.startCol).toBeGreaterThan(2.5);
  expect(hifiSpan!.startCol).toBeLessThan(3.5);
  expect(hifiSpan!.endCol).toBeGreaterThan(7.5);
  expect(hifiSpan!.endCol).toBeLessThan(8.5);
  await page.waitForTimeout(1500);

  const designScreens = page.locator("[data-ogen-design-screens]");
  await designScreens.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  await expect(designScreens.getByRole("heading", { name: "Screens", level: 3 })).toBeVisible();
  const screensCarousel = designScreens.locator("[data-ogen-screens-carousel]");
  await expect(screensCarousel).toBeVisible();
  const designTitles = [
    "Login & Event Setup",
    "Main Dashboard",
    "Anchor List",
    "Battalion Reports",
    "Building Schematic",
  ];
  expect(await designScreens.locator("[data-ogen-design-screen]").count()).toBe(designTitles.length);

  // Walk each carousel slide into view so the reviewer video shows title + body + video.
  for (const title of designTitles) {
    const screenBlock = designScreens.locator(`[data-ogen-design-screen="${title}"]`);
    await screenBlock.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);
    await expect(screenBlock.getByRole("heading", { name: title, level: 4 })).toBeVisible();
    await expect(screenBlock.locator("video")).toBeVisible();
  }

  await designScreens
    .locator(`[data-ogen-design-screen="Login & Event Setup"]`)
    .scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await expect(designScreens.getByText(/Population NCOs log in and initialize/)).toBeVisible();

  const anchorSlide = designScreens.locator(`[data-ogen-design-screen="Anchor List"]`);
  await anchorSlide.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  await expect(anchorSlide.getByText("Smart Cross-Referencing:")).toBeVisible();
  await expect(anchorSlide.getByText(/final decisions strictly to the human operator/)).toBeVisible();
  await expect(designScreens.getByRole("heading", { name: "Smart Cross-Referencing", level: 4 })).toHaveCount(0);
  await expect(designScreens.getByRole("heading", { name: "AI Cross-Referencing", level: 4 })).toHaveCount(0);

  // Carousel scrolls horizontally; slide cards stack title/body above video (Aviv KeyFeatures pattern).
  // Text blocks are equalized so every video starts on the same baseline (Anchor List note included).
  const carouselLayout = await screensCarousel.evaluate((el) => {
    const overflowX = getComputedStyle(el).overflowX;
    const slides = [...el.querySelectorAll("[data-ogen-design-screen]")];
    if (slides.length === 0) return null;
    const first = slides[0];
    const heading = first.querySelector("h4");
    const body = first.querySelector("p");
    const text = first.querySelector("[data-ogen-screen-text]");
    const video = first.querySelector("video");
    const videoWrap = video?.parentElement;
    if (!heading || !body || !text || !video || !videoWrap) return null;
    const headingRect = heading.getBoundingClientRect();
    const bodyRect = body.getBoundingClientRect();
    const textRect = text.getBoundingClientRect();
    const wrapRect = videoWrap.getBoundingClientRect();
    const textHeights = slides.map((slide) => {
      const block = slide.querySelector("[data-ogen-screen-text]");
      return block ? block.getBoundingClientRect().height : 0;
    });
    const videoTops = slides.map((slide) => {
      const wrap = slide.querySelector("video")?.parentElement;
      return wrap ? wrap.getBoundingClientRect().top : NaN;
    });
    const minText = Math.min(...textHeights);
    const maxText = Math.max(...textHeights);
    const minVideoTop = Math.min(...videoTops);
    const maxVideoTop = Math.max(...videoTops);
    return {
      overflowX,
      canScroll: el.scrollWidth > el.clientWidth + 8,
      textAboveVideo: textRect.bottom <= wrapRect.top + 4,
      titleAboveBody: headingRect.bottom <= bodyRect.top + 4,
      textHeightsEqual: maxText - minText <= 2,
      videosAligned: maxVideoTop - minVideoTop <= 2,
    };
  });
  expect(carouselLayout).not.toBeNull();
  expect(["auto", "scroll", "overlay"]).toContain(carouselLayout!.overflowX);
  expect(carouselLayout!.canScroll).toBe(true);
  expect(carouselLayout!.textAboveVideo).toBe(true);
  expect(carouselLayout!.titleAboveBody).toBe(true);
  expect(carouselLayout!.textHeightsEqual).toBe(true);
  expect(carouselLayout!.videosAligned).toBe(true);

  await expect
    .poll(async () =>
      designScreens.locator(`[data-ogen-design-screen="Login & Event Setup"] video`).evaluate(
        (el) => (el as HTMLVideoElement).currentSrc,
      ),
    )
    .toMatch(/OGEN_Login_VID/i);
  await expect
    .poll(async () =>
      designScreens.locator(`[data-ogen-design-screen="Building Schematic"] video`).evaluate(
        (el) => (el as HTMLVideoElement).currentSrc,
      ),
    )
    .toMatch(/OGEN_Building_VID/i);

  const designSystem = page.locator("[data-ogen-design-system]");
  await designSystem.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  await expect(designSystem.getByRole("heading", { name: "Design System", level: 3 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Design System", level: 2 })).toHaveCount(0);
  const designSystemTitles = [
    "Operational Color Palette",
    "Typography & Scannability",
    "Icons & Status Badges",
    "Buttons & Text Boxes",
    "Tactical Components & Pop-ups",
  ];
  for (const title of designSystemTitles) {
    await expect(designSystem.getByText(title, { exact: true })).toBeAttached();
    await expect(designSystem.getByRole("heading", { name: title, level: 3 })).toHaveCount(0);
  }
  await expect(designSystem.getByText(/Atomic Design/)).toHaveCount(0);
  await expect(designSystem.getByText("Media Placeholder")).toHaveCount(0);
  await expect(designSystem.locator('[data-ogen-ds-media="composite"] img')).toHaveCount(1);
  await expect
    .poll(async () =>
      designSystem
        .locator('[data-ogen-ds-media="composite"] img')
        .evaluate((img) => (img as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0);
  await expect
    .poll(async () =>
      designSystem
        .locator('[data-ogen-ds-media="composite"] img')
        .evaluate((el) => (el as HTMLImageElement).currentSrc),
    )
    .toMatch(/Ogen_UI_DesignSystem_Composite/i);
  await page.waitForTimeout(1500);

  await page.setViewportSize({ width: 390, height: 844 });
  await informationArchitectureHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);

  expect(await architectureDiagram.evaluate((element) => element.scrollWidth)).toBe(
    await architectureDiagram.evaluate((element) => element.clientWidth),
  );

  await userFlowHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  expect(await flowDiagram.evaluate((element) => element.scrollWidth)).toBe(
    await flowDiagram.evaluate((element) => element.clientWidth),
  );
});
