import { build } from "esbuild";
import { mkdtemp, readFile, rm, access } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
const temp = await mkdtemp(resolve(".site-audit-"));
try {
  const outfile = resolve(temp, "render.mjs");
  await build({
    stdin: {
      contents:
        'import React from "react"; import {renderToStaticMarkup} from "react-dom/server"; import App from "./src/App"; export default ()=>renderToStaticMarkup(React.createElement(App));',
      resolveDir: process.cwd(),
      loader: "tsx",
    },
    outfile,
    bundle: true,
    platform: "node",
    format: "esm",
    packages: "external",
  });
  const render = (await import(pathToFileURL(outfile).href)).default;
  const html = render();
  const audit = JSON.parse(
    execFileSync(
      "python3",
      [
        "-c",
        `
from html.parser import HTMLParser
import sys,json
class Audit(HTMLParser):
 def __init__(self):
  super().__init__(); self.ids=[]; self.links=[]; self.images=[]; self.controls=[]; self.headings=[]; self.buttons=0
 def handle_starttag(self, tag, attrs):
  a=dict(attrs)
  if 'id' in a: self.ids.append(a['id'])
  if tag=='a': self.links.append(a)
  if tag=='img': self.images.append(a)
  if 'aria-controls' in a: self.controls.extend(a['aria-controls'].split())
  if tag in ['h1','h2','h3','h4']: self.headings.append(tag)
  if tag=='button': self.buttons+=1
p=Audit();p.feed(sys.stdin.read());print(json.dumps(p.__dict__,default=str))
`,
      ],
      { input: html, encoding: "utf8" },
    ),
  );
  assert.equal(
    audit.ids.length,
    new Set(audit.ids).size,
    "Rendered IDs are unique",
  );
  assert.equal(
    audit.headings.filter((h) => h === "h1").length,
    1,
    "Exactly one main heading",
  );
  const assets = new Set();
  for (const link of audit.links) {
    assert.ok(link.href, "Every link has a destination");
    if (link.href.startsWith("#"))
      assert.ok(
        audit.ids.includes(link.href.slice(1)),
        `Missing anchor: ${link.href}`,
      );
    if (link.href.startsWith("/")) assets.add(link.href);
    if (link.target === "_blank") assert.match(link.rel, /noopener/);
  }
  for (const image of audit.images) {
    assert.ok("alt" in image, "Every image has alt text");
    if (image.src.startsWith("/")) assets.add(image.src);
  }
  // The mobile menu is conditionally mounted while closed.
  for (const id of audit.controls)
    assert.ok(
      id === "mobile-menu" || audit.ids.includes(id),
      `Missing controlled region: ${id}`,
    );
  const index = await readFile("index.html", "utf8");
  for (const match of index.matchAll(
    /(?:href|content)="(\/(?:fonts|assets)\/[^" ]+)"/g,
  ))
    assets.add(match[1]);
  for (const asset of assets) await access(resolve("public", asset.slice(1)));
  for (const file of [
    "src/styles.css",
    "src/design.css",
    "src/toys.css",
    "src/project-cards.css",
    "src/responsive.css",
  ]) {
    const css = await readFile(file, "utf8");
    for (const match of css.matchAll(/url\(["']?(\/[^)"']+)["']?\)/g))
      await access(resolve("public", match[1].slice(1)));
  }
  assert.ok(
    !html.includes('class="certificate-view"'),
    "Duplicate certificate action stays removed",
  );
  assert.ok(!html.includes("project-folder"), "Superseded folder UI is absent");
  console.log(
    `PASS: rendered page — ${audit.ids.length} unique IDs, ${audit.links.length} links, ${audit.images.length} images, ${assets.size} local assets, heading and ARIA targets.`,
  );
} finally {
  await rm(temp, { recursive: true, force: true });
}
