import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import postcss from "postcss";
const main = await readFile("src/main.tsx", "utf8");
const files = [...main.matchAll(/import "\.\/(.*\.css)"/g)].map(
  (m) => `src/${m[1]}`,
);
const sheets = await Promise.all(
  files.map(async (f) => postcss.parse(await readFile(f, "utf8"))),
);
// Regression guard for exact layout selectors and width queries. This is not a browser layout engine.
function declaration(selector, property, width) {
  let value;
  for (const sheet of sheets)
    sheet.walkRules((rule) => {
      if (
        !rule.selector
          .split(",")
          .map((s) => s.trim())
          .includes(selector)
      )
        return;
      for (let parent = rule.parent; parent; parent = parent.parent) {
        if (parent.type !== "atrule") continue;
        if (parent.name !== "media") return;
        const q = parent.params;
        if (/hover|pointer|prefers|orientation/.test(q)) return;
        if (
          [...q.matchAll(/min-width:\s*([\d.]+)px/g)].some(
            (m) => width < Number(m[1]),
          )
        )
          return;
        if (
          [...q.matchAll(/max-width:\s*([\d.]+)px/g)].some(
            (m) => width > Number(m[1]),
          )
        )
          return;
      }
      rule.walkDecls(property, (d) => (value = d.value));
    });
  return value;
}
for (const width of [
  320, 360, 390, 430, 440, 650, 651, 768, 844, 850, 851, 1024, 1280, 1440, 1920,
]) {
  if (width <= 850) {
    for (const selector of [
      ".hero-grid",
      ".contact-layout",
      ".education-layout",
      ".about-layout",
      ".insight-grid",
    ]) {
      assert.equal(
        declaration(selector, "display", width),
        "grid",
        `${width}: ${selector} uses grid`,
      );
      assert.equal(
        declaration(selector, "grid-template-columns", width),
        "minmax(0, 1fr)",
        `${width}: ${selector} stays single column`,
      );
    }
    assert.equal(
      declaration(".results-grid", "grid-template-columns", width),
      "repeat(2, minmax(0, 1fr))",
    );
  } else
    assert.notEqual(
      declaration(".contact-layout", "grid-template-columns", width),
      "minmax(0, 1fr)",
      "Desktop contact retains columns",
    );
  if (width <= 650)
    assert.equal(
      declaration(".story-body", "grid-template-columns", width),
      "minmax(0, 1fr)",
    );
  console.log(`PASS: responsive declaration cascade at ${width}px`);
}
