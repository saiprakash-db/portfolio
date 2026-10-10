# Sai Prakash Lingala — Quiet Pipeline

A responsive data-engineering portfolio built with React, Vite, TypeScript, Tailwind CSS and Framer Motion. Includes two project stories, light/dark themes, a mobile menu, a keyboard command palette, accessible contact links and downloadable source documents.

## Run

Requires Node.js 22.6 or newer. The rendered-page audit (`npm run check`) also uses Python 3.

```sh
npm install
npm run dev
```

Open the URL printed by Vite. To check the production build:

```sh
npm run build
npm run preview
```

The existing `dist/` folder contains a successful production build. This workspace already has local dependencies available. A clean checkout should use `npm install`; a dependency lockfile could not be generated while the npm registry was unreachable.

## Edit content

Edit `src/data.ts` for profile information, contacts, project descriptions and metrics, pipeline steps, skills, education and certificates. Main sections are composed in `src/App.tsx`; reusable components live in `src/components/`. Design tokens and base layouts are in `src/styles.css`; the editorial design refinement and its responsive rules are in `src/design.css`. The interactive source-to-insight workbench is in `src/components/Workbench.tsx`, with its content in `src/data.ts`. Motion helpers are in `src/motion.tsx`. Project exhibits use `src/project-cards.css`; interactive toys use `src/toys.css`. The final phone/tablet layout rules live in `src/responsive.css`, loaded last.

- Resume: `public/assets/sai-prakash-lingala-resume.pdf` (the supplied original, unchanged).
- Certificates: local WebP crops of the supplied screenshots, linked to their original verification URLs.
- Open Graph image: `public/assets/og-image.png`.
- Fonts: self-hosted Outfit in 400, 500, 600 and 700 weights, with JetBrains Mono for technical labels. The page makes no external font requests. Headings use 600/700, body text is generally 16px, and narrow-screen metric tiles reflow vertically. Font loading and layout shift still need browser measurement.
- Scrolling: native wheel, trackpad, touch and keyboard scrolling keeps browser momentum independent of interactive illustrations. Section links use CSS smooth scrolling, disabled for reduced motion.
- Contact uses email and telephone links plus a copy-email action with explicit success/failure feedback; no backend or form service is needed.

## Original project screenshots

Both GitHub clones were attempted only in `/tmp`, outside this portfolio. DNS/network access failed, so the repositories were not cloned or independently reviewed in full. Project-specific details beyond the resume come from the user's confirmed brief, not a claimed code audit.

The site has an honest dashboard-unavailable panel with a link to each original screenshot. It does not present the small illustrative bento graphics as real dashboards. With network access, fetch the original PNGs and generate responsive WebP copies:

```sh
python3 -m pip install Pillow
npm run assets
npm run build
```

The asset script only enables a local dashboard preview after successfully downloading and converting the PNG. It preserves the unavailable state on failure. No project repository is added to this folder.

## Deploy

Vercel and Netlify configurations are included. Import this folder/repository, use `npm run build`, and publish `dist/`.

Set `SITE_URL` to the final HTTPS origin before building. The build then writes an absolute canonical URL, Open Graph URL and `sitemap.xml`, and references the sitemap from `robots.txt`. Vercel's `VERCEL_PROJECT_PRODUCTION_URL` and Netlify's `URL` are also supported. No fictional domain is embedded when the origin is unknown.

No public deployment has been made from this session.

## Verify

```sh
npm run check
# Build + rendered-page/link/asset audit + pipeline/physics/contrast/responsive CSS checks
npx playwright install chromium
npm run dev
# In another terminal:
npm run test:browser
```

The browser script checks 320 (stress case), 360, 390, 430, 440, 768, 1024, 1280, 1440 and 1920px in both themes, plus phone landscape cases at 844×360, 844×390 and 844×430. It checks horizontal overflow, section targets, console errors, local assets, mobile menu navigation, command-palette keyboard behavior, theme persistence and blocked-storage fallback. It saves full-page screenshots for visual review. Reduced-motion layout cases and normal-motion theme interactions are covered; real-device motion smoothness still requires manual review.

`TEST_URL` overrides the browser-test URL. `CHROME_PATH` optionally selects an existing Chromium executable.

For Lighthouse, serve the production build, then run:

```sh
npm run preview -- --port 4173
npx lighthouse http://127.0.0.1:4173 --output=html --output-path=reports/lighthouse.html --chrome-flags=--headless
```

Current verification and environment limitations are recorded in `reports/verification.md`. A 95+ Lighthouse score is a target, not a claimed result.

## Final verification status (10 October 2026)

`npm run check` passes. The rendered-page audit validates unique IDs, internal link targets, local asset existence, external-link attributes, heading count and controlled regions. Contrast tests read the actual CSS theme tokens. Browser tests also include project-sheet switching, copy-email success/denial, empty search results and scrolling during marble animation.

The preview server and browser remain blocked in this environment, so responsive visual checks, real-device motion and Lighthouse are still pending. Original dashboard downloads also fail here; source links remain visible. See `reports/verification.md` for the exact distinction between passed checks and outstanding release verification.
