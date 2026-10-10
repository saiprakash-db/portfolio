# Verification record

## Completed

- Read the complete one-page resume, both complete certificate screenshots, and all original files in `about_me`.
- Extracted original contact, repository and certificate hyperlinks from the resume PDF.
- TypeScript strict check: passed.
- Vite production build: passed.
- WCAG AA normal-text contrast: all 32 design-token foreground/background pairs pass 4.5:1; see `contrast-results.json`. This is a token test, not a complete rendered accessibility audit.
- Asset script and browser-test script syntax: passed.
- Local resume, certificate images, favicon and Open Graph image are included.
- Project repositories were never placed in this workspace.

## Browser verification — blocked, not passed

The preview server failed with `listen EPERM: operation not permitted 127.0.0.1:5173`. Chromium failed with `MachPortRendezvousServer ... Permission denied (1100)`. Lighthouse was attempted and failed waiting for Chrome's debugging port. No screenshot, browser audit, runtime-console clearance, FPS result or Lighthouse score is claimed.

| Width   | Light                   | Dark                    | Orientation     |
| ------- | ----------------------- | ----------------------- | --------------- |
| 320     | Not run: browser denied | Not run: browser denied | Stress case     |
| 360     | Not run: browser denied | Not run: browser denied | Portrait        |
| 390     | Not run: browser denied | Not run: browser denied | Portrait        |
| 430     | Not run: browser denied | Not run: browser denied | Portrait        |
| 768     | Not run: browser denied | Not run: browser denied | Tablet          |
| 1024    | Not run: browser denied | Not run: browser denied | Landscape       |
| 1280    | Not run: browser denied | Not run: browser denied | Landscape       |
| 1440    | Not run: browser denied | Not run: browser denied | Landscape       |
| 1920    | Not run: browser denied | Not run: browser denied | Landscape       |
| 844×360 | Not run: browser denied | Not run: browser denied | Phone landscape |
| 844×390 | Not run: browser denied | Not run: browser denied | Phone landscape |
| 844×430 | Not run: browser denied | Not run: browser denied | Phone landscape |

Responsive CSS and test automation are implemented for these cases. Zero overflow and zero overlap remain unverified until the browser suite and visual review run.

## Source accuracy and unavailable sources

- The original resume targets Data Analyst roles. Website positioning follows the user's explicit updated Junior Data Engineer brief. The PDF itself is unchanged.
- Both certificate screenshots confirm the supplied September 2026 dates and names. Deloitte is described as a Forage job simulation, not employment.
- The supplied brief is the source for the detailed metrics. The resume independently confirms Olist's 12 visualizations, KKBOX's 200,000-customer dataset and 0.9465 ROC-AUC.
- GitHub profile and repository requests were attempted. Browser results were stale/incomplete; direct raw-file requests failed. Cloning Olist to `/tmp/sai-olist` and KKBOX to `/tmp/sai-kkbox` failed with `Could not resolve host: github.com`. No assertion is made that those older cached pages describe the current repositories.
- Original dashboard images could not be downloaded. The site labels the missing previews and links to their supplied GitHub paths.
- Certificate verification endpoints and external destination availability could not be checked end to end. Original source URLs are preserved.
- The brief says “11 stages” but enumerates 12 KKBOX steps. The website displays all 12 supplied steps and labels the workflow as 10 notebooks without repeating the inconsistent stage count.
- Olist product revenue, order count and average order value are shown as separate reported metrics. Their aggregation definitions could not be independently checked; no new metrics are derived from them.
- No invented employers, professional experience, testimonials or project outcomes were added. Location, languages, cricket interest, availability and AI-tool use are confirmed by the user's brief.

## Remaining external inputs

- Final domain for deployment-specific canonical, Open Graph and sitemap URLs.
- Updated resume if its Data Analyst summary should be changed to Data Engineering.
- Network access to retrieve and inspect the current GitHub project files and screenshots.
- Browser execution to complete responsive, keyboard, rendered accessibility, performance and animation review.

## Editorial redesign

The hero, navigation, project previews, typography, spacing and case-study hierarchy were redesigned. A keyboard-accessible Ingest / Validate / Serve workbench replaces the decorative hero illustration. Project preview charts now use supplied project results. Workbench text colors were separately checked against its dark panel background; all tested pairs exceed 4.5:1. Browser and Lighthouse verification remain blocked as recorded above; the redesign has not been visually verified in a running browser.

## Typography and UI correction pass

- Replaced thin serif typography with locally hosted Outfit 400/500/600/700. Verified the actual font weight metadata matches each CSS declaration. Removed external font requests and preloaded body/hero weights.
- Increased body copy, labels, controls, chart annotations and certificate text. Added stronger heading weights and secondary-text contrast in both themes. The updated 32-pair contrast check passes.
- Reflowed narrow-screen statistics into readable rows; stacked the hero and project previews at tablet widths; adjusted chart grids, CTA wrapping and case-study text widths for the larger type.
- Added active-section navigation and mobile-menu outside-click/desktop-resize dismissal.
- Corrected command-palette Enter handling so a focused close button or individual result does not trigger the search input’s selected result.
- Strict TypeScript and production build pass. Browser tests remain unexecuted due to the previously recorded permission restrictions; no rendered overlap, runtime accessibility, or Lighthouse clearance is claimed.

## Screenshot-led portfolio and navigation refinement

- Reviewed both user-provided dark-theme screenshots. Removed the hero availability pill and boxed text highlight; promoted the actual name to the main heading, with plain role/availability copy and direct professional-profile links.
- Reduced hero whitespace and supporting workbench height. Simplified card decorations and metric presentation. Added restrained hero and modal entrance motion, covered by the existing reduced-motion rules.
- Rebuilt the command palette with viewport centering, a bounded scrollable list, a single search focus treatment, pointer/keyboard selection, and explicit section navigation after the dialog closes.
- Added initial fragment navigation after fonts are ready to handle URLs such as `/#skills` on refresh. The screenshot showed that fragment while the hero was visible; the exact runtime cause was not independently observed.
- Extended browser regression coverage for palette centering, repeat-fragment navigation and initial fragment loading. These browser tests remain unexecuted in this restricted environment. Screenshot review is evidence about the prior version, not rendered verification of this revision.

## Final navbar pass

- Replaced the visible Command/K shortcut with a labeled search-icon button, available on desktop and mobile. The keyboard shortcut remains supported.
- Replaced the text-symbol theme icon with custom SVG sun and crescent/star artwork, with reduced-motion-aware transitions.
- Refined the navigation container, personal brand subtitle, grouped section links and animated active-section marker. All navbar controls have at least 44px targets.
- Rechecked supplied profile facts against the editable content: education, certificates, technical skills, languages, contact links and both project summaries are represented. No new credentials, experience or numerical outcomes were introduced.
- Browser execution restrictions and unverified external/dashboard assets remain as documented above.

## Wrapped-pipeline and related interaction audit

- Replaced the single first-row progress line with a route measured from every stage marker. The route connects wrapped rows through their whitespace and the moving packet follows the whole sequence. Geometry updates after font loading and resizing; reduced-motion mode shows the complete static route.
- Added pure geometry regression tests: 6/12 stages × 2/3/6 columns. All six combinations pass stage order, connector-gap and final-endpoint checks. These tests validate route math, not browser rendering.
- Replaced entry-only active-navigation tracking with cached section positions and the current scroll position; this addresses the screenshot’s incorrect Skills highlight over the KKBOX project.
- Added an opaque header background to prevent page content showing through its top gap.
- Clamped inertial scroll targets after page-height changes, normalized easing for frame timing, and preserved Shift-wheel/native noncancelable scrolling.
- Removed doubled anchor offsets: section scrolling now uses one offset measured from header height. Escape returns focus to the mobile menu button when closing from a menu link.
- Added dashboard image-load error handling to show the existing honest source link instead of a broken image.
- Production build, strict TypeScript, six pipeline geometry cases and 32 contrast pairs pass. The entire site still requires the documented browser/real-device review; the restricted environment does not support a zero-UI-issues claim.

## Cricket and data-marble interactions

- Replaced the static cricket illustration in About with an opt-in bowling scene: analytic gravity and pitch bounce, wicket impact, independently moving bails, damped stump movement, replay and reset.
- Added a Skills-section marble track. Pointer capture supports touch/mouse dragging into a generous inlet; a spring returns missed drops to the tray. A launch button and Enter/Space provide alternatives to dragging. The downhill rolling model advances through Validate, Transform and Serve, then settles into a cup.
- Both interactions have reduced-motion completion, live result text, theme tokens, scoped responsive styling and no autoplay/audio. The pipeline toy is explicitly an illustration, not a claim about processing real records.
- Strict TypeScript/production build, toy-physics tests, existing pipeline geometry tests and 32 text contrast token combinations pass. Toy tests cover ground bounds, wicket impact position/continuity, settling, ordered stages and deterministic time sampling.
- Added browser regression assertions for reduced-motion completion, reset and keyboard launch. Current browser-test attempt stops at missing local `playwright` package (`ERR_MODULE_NOT_FOUND`); earlier browser launch restrictions remain documented above. These new interactions have not been visually or physically verified on real devices here.

## Navigation and marble scrolling refinement

- Kept the navbar shell, branding and controls. Removed the opaque outer header background and the nested navigation tray. Active links now use a short transform/opacity underline, without a shared-layout moving background. Mobile links expose their current section with `aria-current`.
- Removed custom wheel interception. Its native-scroll exclusion could leave an earlier animation frame moving toward a stale scroll target over the marble playground. Native browser wheel/trackpad momentum now owns scrolling; CSS smooth section navigation and reduced-motion rules remain.
- Marble stage state now changes only at milestones rather than scheduling React updates each frame. Resize observation uses its supplied content dimensions; active rolling disables the ball hit target so touch scrolling can pass through. Reset preserves the current visual position before springing home.
- Added browser assertions for transparent header/navigation backgrounds and scrolling through the marble animation without position pullback. Browser tests remain unexecuted: Vite fails to bind with EPERM, and a cached Playwright installation lacks its browser executable. No full-device visual clearance is claimed.
- Production build, physics tests, six pipeline geometry cases and all 32 text contrast token combinations pass.

## Interactive project folders

- Replaced the two overview project cards with document folders: labeled tabs, a spring-driven cover hinged at its lower edge, and a summary sheet revealed underneath. Shared grid sizing reserves the larger face's space, keeping content below stationary during opening/closing. The cover folds away from the viewer to contain perspective expansion.
- Preserved direct case-study links. Added explicit open/close controls, Escape-to-close with focus return, inert hidden surfaces, and reduced-motion alternatives. Hover is optional; all actions use buttons or links.
- Summary sheets reuse existing verified project metrics and link to original dashboard images on GitHub. They are explicitly labeled as project summaries; unavailable original screenshots are not simulated.
- Added browser regression cases for opening, closing, keyboard behavior and stable card height. Production build and 32 contrast token checks pass. Browser regressions and visual breakpoint checks remain unexecuted under the environment restrictions documented above.

## Project cards redesigned after visual feedback

- Removed the literal folder treatment, hinged cover, and duplicate open controls. Replaced them with two project exhibits: visible result sheets, a layered document edge, stable editorial titles, stack labels and persistent case-study/source links.
- Olist exposes revenue/order/item evidence; KKBOX exposes model comparison and the leakage audit. An optional second sheet presents three concise method steps and limitations. Only transforms and opacity animate; both sheets reserve layout space. Hidden content is inert and excluded from the accessibility tree; Escape returns focus to the switch control.
- Added editable project-card content in data.ts and replaced the previous folder stylesheet rather than stacking more folder overrides. Regression selectors now verify default-visible results, persistent case-study access, page switching and reserved height.
- Production build and 32 text-token contrast checks pass. Retried installed Chrome via cached Playwright: browser exits with SIGABRT under this environment. Visual device verification remains outstanding; no flawless-rendering claim is made.

## Final code audit — 10 October 2026

- Added one practical enhancement: copy email, with feedback based on the clipboard result, denied/unavailable-clipboard guidance, duplicate-click prevention, and timeout/unmount cleanup. Existing mailto remains available.
- Corrected external-link attribute forwarding so project source links retain their descriptive accessible names. Initialized the browser theme-color from the resolved first-load theme; guarded the theme animation fallback.
- Added an accessible no-JavaScript contact/resume fallback. Certificate headings can wrap when space is constrained.
- Hardened marble dragging against competing pointers and added Escape cancellation. Running toy animations settle immediately if reduced motion is enabled mid-play. Workbench tabs now support Home/End and calculate wrapping from the actual tab count. Empty search results announce their status.
- Added `npm run check`: strict production build, rendered-page audit, pipeline geometry, physics, and contrast. Rendered audit passes for 28 unique IDs, 43 links, local asset references and ARIA targets; link checks validate structure/local destinations, not remote availability. Contrast checks now parse actual CSS tokens instead of duplicating palette constants.
- Expanded browser regression coverage for copy success/denial, empty search, project sheets and a 320px stress viewport. These tests have not run successfully in this environment. All requested light/dark breakpoint cases remain explicitly unverified in the table above.
- Retried local preview: `listen EPERM 127.0.0.1:5173`. Retried both original dashboard downloads: fetch failed. Consequently rendered UI, external URLs, real-device FPS and Lighthouse remain unverified. No zero-defect or 95+ score claim is made.
- Remaining release work: run the documented browser suite and visual review where Chrome/localhost are permitted, fetch original dashboard screenshots with network access, and supply the final deployment origin through `SITE_URL`.

## Screenshot-led mobile layout correction

- The 440px screenshot exposed a real cascade regression: a later max-width:1100px rule restored two contact columns on phones. Removed that declaration and established explicit single-column layouts through 850px in the final responsive stylesheet.
- Contact now has full-width introduction/email followed by aligned contact rows, unbroken phone value, consistent target heights and readable spacing. Hero, education, About and insight layouts also stack through 850px; results use two columns. Phone story layout, certificate spacing and narrow 320px contact labels are explicitly covered.
- Corrected an inherited project-ledger span so the third metric occupies its own column rather than unexpectedly spanning the row.
- Added a responsive CSS declaration regression test at 320, 360, 390, 430, 440, 650, 651, 768, 844, 850, 851, 1024, 1280, 1440 and 1920px. All pass. This is an exact-selector/width-query cascade check, not rendered layout verification.
- Expanded the browser suite with 440px plus contact stacking/overlap/email-line assertions. Browser execution remains blocked as documented above. `npm run check` passes in full.
