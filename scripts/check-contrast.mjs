import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import postcss from "postcss";
const luminance = (hex) => {
  const c = hex
    .replace("#", "")
    .replace(/^([a-f0-9])([a-f0-9])([a-f0-9])$/i, "$1$1$2$2$3$3")
    .match(/../g)
    .map((s) => parseInt(s, 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722;
};
// Read the actual cascade instead of maintaining a second copy of the palette.
const base = {},
  dark = {};
for (const file of [
  "src/styles.css",
  "src/design.css",
  "src/toys.css",
  "src/project-cards.css",
  "src/responsive.css",
]) {
  postcss.parse(await readFile(file, "utf8")).walkRules((rule) => {
    const target =
      rule.selector === ":root"
        ? base
        : rule.selector === ':root[data-theme="dark"]'
          ? dark
          : null;
    if (target && rule.parent.type === "root")
      rule.walkDecls((declaration) => {
        if (declaration.prop.startsWith("--"))
          target[declaration.prop] = declaration.value;
      });
  });
}
const tokens = {
  bg: "--bg",
  surface: "--surface",
  alt: "--surface-alt",
  soft: "--accent-soft",
  text: "--text",
  muted: "--muted",
  accent: "--accent",
  gold: "--gold",
};
const palette = (values) =>
  Object.fromEntries(
    Object.entries(tokens).map(([name, variable]) => {
      assert.match(
        values[variable] || "",
        /^#[0-9a-f]{3}([0-9a-f]{3})?$/i,
        `${variable} must resolve to a hex color`,
      );
      return [name, values[variable]];
    }),
  );
const themes = { light: palette(base), dark: palette({ ...base, ...dark }) };
const results = [];
for (const [theme, c] of Object.entries(themes))
  for (const fg of ["text", "muted", "accent", "gold"])
    for (const bg of ["bg", "surface", "alt", "soft"]) {
      const a = luminance(c[fg]),
        b = luminance(c[bg]);
      const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      assert.ok(ratio >= 4.5, `${theme} ${fg}/${bg}: ${ratio}`);
      results.push({
        theme,
        foreground: fg,
        background: bg,
        ratio: Number(ratio.toFixed(2)),
        status: "PASS",
      });
    }
await writeFile(
  "reports/contrast-results.json",
  JSON.stringify(results, null, 2),
);
console.log(
  `PASS: ${results.length} text/background token combinations meet WCAG AA normal-text contrast.`,
);
