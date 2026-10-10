import { writeFile, readFile, mkdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
await mkdir("public/assets", { recursive: true });
let manifest = JSON.parse(
  await readFile("public/assets/dashboard-manifest.json", "utf8"),
);
const assets = [
  [
    "olist",
    "olist-ecommerce-data-analysis",
    "dashboard/olist-ecommerce-dashboard.png",
  ],
  [
    "kkbox",
    "subscription-churn-prediction-databricks",
    "docs/kkbox_dashboard.png",
  ],
];
for (const [id, repo, path] of assets) {
  try {
    const r = await fetch(
      `https://raw.githubusercontent.com/saiprakash-db/${repo}/main/${path}`,
      { signal: AbortSignal.timeout(15000) },
    );
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const bytes = Buffer.from(await r.arrayBuffer());
    if (bytes.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a")
      throw new Error("Response is not a PNG image");
    await writeFile(`public/assets/${id}-dashboard.png`, bytes);
    execFileSync("python3", [
      "-c",
      `from PIL import Image\nim=Image.open('public/assets/${id}-dashboard.png')\nim.thumbnail((1600,10000))\nim.save('public/assets/${id}-dashboard.webp',quality=88)\nim.thumbnail((720,10000))\nim.save('public/assets/${id}-dashboard-small.webp',quality=85)`,
    ]);
    manifest[id] = true;
    console.log(`${id}: original dashboard downloaded and optimized.`);
  } catch (e) {
    console.error(`${id}: ${e.message}. Keeping the honest unavailable state.`);
  }
}
await writeFile(
  "public/assets/dashboard-manifest.json",
  JSON.stringify(manifest, null, 2),
);
