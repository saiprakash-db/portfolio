import { readFile, writeFile } from "node:fs/promises";
const origin =
  process.env.SITE_URL ||
  process.env.URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "");
let html = await readFile("dist/index.html", "utf8");
if (origin) {
  const url = new URL(origin).origin;
  html = html
    .replace(
      "</head>",
      `<link rel="canonical" href="${url}/"/><meta property="og:url" content="${url}/"/></head>`,
    )
    .replace(
      'content="/assets/og-image.png"',
      `content="${url}/assets/og-image.png"`,
    );
  await writeFile(
    "dist/sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${url}/</loc></url></urlset>`,
  );
  await writeFile(
    "dist/robots.txt",
    `User-agent: *\nAllow: /\nSitemap: ${url}/sitemap.xml\n`,
  );
} else {
  await writeFile("dist/robots.txt", "User-agent: *\nAllow: /\n");
  console.info(
    "SEO: set SITE_URL at deployment to generate the canonical URL and sitemap.",
  );
}
await writeFile("dist/index.html", html);
