import fs from "fs";
import path from "path";

const dir = path.resolve("public/assets/New Cubes");
const PAD = 3;

function pathBounds(d) {
  const cmds = d.match(/[MmLlHhVvCcSsQqTtAaZz][^MmLlHhVvCcSsQqTtAaZz]*/g) || [];
  let cx = 0;
  let cy = 0;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const add = (x, y) => {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  };

  for (const chunk of cmds) {
    const c = chunk[0];
    const nums = (chunk.slice(1).match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi) || []).map(Number);
    const abs = c === c.toUpperCase();
    const cmd = c.toUpperCase();
    let i = 0;
    const take = (n) => {
      const a = nums.slice(i, i + n);
      i += n;
      return a;
    };
    if (cmd === "Z") continue;
    if (cmd === "M" || cmd === "L" || cmd === "T") {
      while (i < nums.length) {
        let [x, y] = take(2);
        if (!abs) {
          x += cx;
          y += cy;
        }
        cx = x;
        cy = y;
        add(cx, cy);
      }
    } else if (cmd === "H") {
      while (i < nums.length) {
        let [x] = take(1);
        if (!abs) x += cx;
        cx = x;
        add(cx, cy);
      }
    } else if (cmd === "V") {
      while (i < nums.length) {
        let [y] = take(1);
        if (!abs) y += cy;
        cy = y;
        add(cx, cy);
      }
    } else if (cmd === "C") {
      while (i < nums.length) {
        let [x1, y1, x2, y2, x, y] = take(6);
        if (!abs) {
          x1 += cx;
          y1 += cy;
          x2 += cx;
          y2 += cy;
          x += cx;
          y += cy;
        }
        add(x1, y1);
        add(x2, y2);
        cx = x;
        cy = y;
        add(cx, cy);
      }
    } else if (cmd === "S" || cmd === "Q") {
      while (i < nums.length) {
        let [x1, y1, x, y] = take(4);
        if (!abs) {
          x1 += cx;
          y1 += cy;
          x += cx;
          y += cy;
        }
        add(x1, y1);
        cx = x;
        cy = y;
        add(cx, cy);
      }
    } else if (cmd === "A") {
      while (i < nums.length) {
        let [, , , , , x, y] = take(7);
        if (!abs) {
          x += cx;
          y += cy;
        }
        cx = x;
        cy = y;
        add(cx, cy);
      }
    }
  }
  if (!Number.isFinite(minX)) return null;
  return { minX, minY, maxX, maxY };
}

function pathOnlyBounds(text) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const m of text.matchAll(/<path[^>]*\sd="([^"]+)"/g)) {
    const b = pathBounds(m[1]);
    if (!b) continue;
    minX = Math.min(minX, b.minX);
    minY = Math.min(minY, b.minY);
    maxX = Math.max(maxX, b.maxX);
    maxY = Math.max(maxY, b.maxY);
  }
  return { minX, minY, maxX, maxY, w: maxX - minX, h: maxY - minY };
}

const files = fs.readdirSync(dir).filter((f) => f.endsWith(".svg"));
const report = [];

for (const file of files) {
  const text = fs.readFileSync(path.join(dir, file), "utf8");
  const b = pathOnlyBounds(text);
  const minX = +(b.minX - PAD).toFixed(2);
  const minY = +(b.minY - PAD).toFixed(2);
  const w = +(b.w + PAD * 2).toFixed(2);
  const h = +(b.h + PAD * 2).toFixed(2);
  const viewBox = `${minX} ${minY} ${w} ${h}`;
  const next = text
    .replace(/width="[^"]*"/, `width="${w}"`)
    .replace(/height="[^"]*"/, `height="${h}"`)
    .replace(/viewBox="[^"]*"/, `viewBox="${viewBox}"`);
  fs.writeFileSync(path.join(dir, file), next);
  report.push({ file, viewBox });
}

console.log(JSON.stringify(report, null, 2));
