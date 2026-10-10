import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
const baseURL = process.env.TEST_URL || "http://127.0.0.1:5173";
const widths = [320, 360, 390, 430, 440, 768, 1024, 1280, 1440, 1920];
const results = [];
await mkdir("reports", { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROME_PATH
    ? { executablePath: process.env.CHROME_PATH }
    : {}),
});
try {
  for (const theme of ["dark"]) {
    const sizes = [
      ...widths.map((width) => ({ width, height: width < 500 ? 844 : 1000 })),
      ...[360, 390, 430].map((height) => ({ width: 844, height })),
    ];
    for (const size of sizes) {
      const context = await browser.newContext({
        viewport: size,
        colorScheme: theme,
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      await page.goto(baseURL, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForSelector("h1");
      assert.equal(
        await page.getAttribute("html", "data-theme"),
        theme,
        "Dark theme is the default",
      );
      assert.equal(
        await page.locator(".theme-toggle").count(),
        0,
        "Day/night theme control stays removed",
      );
      for (const section of [
        "overview",
        "olist",
        "kkbox",
        "skills",
        "education",
        "about",
        "contact",
      ]) {
        await page.locator(`#${section}`).scrollIntoViewIfNeeded();
        await page.waitForTimeout(600);
      }
      // Traverse the complete page so once-only reveals are included in full-page captures.
      await page.evaluate(async () => {
        for (
          let top = 0;
          top < document.documentElement.scrollHeight;
          top += innerHeight * 0.7
        ) {
          window.scrollTo({ top, behavior: "instant" });
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
      });
      await page.waitForTimeout(600);
      const overflow = await page.evaluate(() => ({
        document: document.documentElement.scrollWidth > innerWidth + 1,
        elements: [...document.querySelectorAll("main *, header *, footer *")]
          .filter((el) => {
            const r = el.getBoundingClientRect();
            const s = getComputedStyle(el);
            return (
              r.width > 0 &&
              s.position !== "absolute" &&
              s.position !== "fixed" &&
              (r.right > innerWidth + 1 || r.left < -1)
            );
          })
          .map((el) => `${el.tagName}.${el.className}`)
          .slice(0, 15),
      }));
      assert.equal(
        overflow.document,
        false,
        `${theme} ${size.width}×${size.height}: horizontal overflow`,
      );
      assert.deepEqual(
        overflow.elements,
        [],
        `Overflowing elements at ${size.width}×${size.height}`,
      );
      if (size.width <= 850) {
        const contactLayout = await page
          .locator(".contact-layout")
          .evaluate((el) => {
            const [intro, links] = [...el.children].map((child) =>
              child.getBoundingClientRect(),
            );
            const email = el.querySelector(".contact-email-address");
            const emailBounds = email.getBoundingClientRect();
            return {
              columns:
                getComputedStyle(el).gridTemplateColumns.split(" ").length,
              stacked: links.top >= intro.bottom,
              emailHeight: emailBounds.height,
              emailLine: parseFloat(getComputedStyle(email).lineHeight),
            };
          });
        assert.equal(
          contactLayout.columns,
          1,
          "Mobile/tablet contact uses one column",
        );
        assert.ok(
          contactLayout.stacked,
          "Contact links follow introduction without overlap",
        );
        if (size.width >= 360)
          assert.ok(
            contactLayout.emailHeight < contactLayout.emailLine * 1.5,
            "Email stays on one line at phone widths",
          );
      }
      const brokenAnchors = await page.evaluate(() =>
        [...document.querySelectorAll('a[href^="#"]')]
          .map((a) => a.getAttribute("href"))
          .filter(
            (href) =>
              href.length > 1 && !document.getElementById(href.slice(1)),
          ),
      );
      assert.deepEqual(brokenAnchors, [], "All section links resolve");
      assert.equal(
        await page
          .locator(".site-header")
          .evaluate((el) => getComputedStyle(el).backgroundColor),
        "rgba(0, 0, 0, 0)",
        "Outside the navbar stays transparent",
      );
      assert.equal(
        await page
          .locator(".desktop-nav")
          .evaluate((el) => getComputedStyle(el).backgroundColor),
        "rgba(0, 0, 0, 0)",
        "Navigation has no selection tray",
      );
      assert.equal(await page.locator("h1").count(), 1);
      assert.equal(await page.locator(".project-story").count(), 2);
      assert.equal(await page.locator(".certificate").count(), 2);
      // Reduced-motion interactions complete immediately and remain replayable.
      for (const exhibit of await page.locator(".project-exhibit").all()) {
        const toggle = exhibit.locator(".exhibit-toggle");
        assert.equal(
          await exhibit.locator(".exhibit-proof").getAttribute("aria-hidden"),
          "false",
          "Results visible without interaction",
        );
        assert.equal(
          await exhibit.locator(".exhibit-cta").isVisible(),
          true,
          "Case study always accessible",
        );
        const before = await exhibit.boundingBox();
        await toggle.click();
        assert.equal(await toggle.getAttribute("aria-expanded"), "true");
        assert.equal(
          await exhibit.locator(".exhibit-notes").getAttribute("aria-hidden"),
          "false",
        );
        const after = await exhibit.boundingBox();
        assert.ok(
          Math.abs(before.height - after.height) < 1,
          "Switching project sheets reserves its layout space",
        );
        await toggle.focus();
        await page.keyboard.press("Escape");
        assert.equal(await toggle.getAttribute("aria-expanded"), "false");
        await page.keyboard.press("Enter");
        assert.equal(await toggle.getAttribute("aria-expanded"), "true");
        await toggle.click();
      }
      const cricket = page.locator(".cricket-toy");
      await cricket.locator(".toy-action").click();
      assert.match(
        await cricket.locator(".toy-message").innerText(),
        /Every match is a dataset/,
      );
      await cricket.getByRole("button", { name: "Reset", exact: true }).click();
      const marble = page.locator(".marble-toy");
      await marble.getByRole("button", { name: /Launch marble/ }).click();
      assert.match(
        await marble.locator(".toy-message").innerText(),
        /Ready to serve/,
      );
      assert.equal(await marble.locator(".stage-dot.is-complete").count(), 3);
      await marble.getByRole("button", { name: "Reset", exact: true }).click();
      await marble.locator(".marble-handle").focus();
      await page.keyboard.press("Enter");
      assert.match(
        await marble.locator(".toy-message").innerText(),
        /Ready to serve/,
      );
      await page.evaluate(() => window.scrollTo(0, 0));
      if (size.width <= 650) {
        const menu = page.getByRole("button", { name: "Open menu" });
        await menu.click();
        assert.equal(await menu.getAttribute("aria-expanded"), "true");
        await page
          .locator("#mobile-menu")
          .getByRole("link", { name: /Projects/ })
          .click();
        assert.equal(await page.locator("#mobile-menu").count(), 0);
      }
      await page.getByRole("button", { name: "Search portfolio" }).click();
      const searchBounds = await page.locator("dialog").boundingBox();
      assert.ok(
        searchBounds &&
          searchBounds.x >= 0 &&
          searchBounds.y >= 0 &&
          searchBounds.x + searchBounds.width <= size.width + 1 &&
          searchBounds.y + searchBounds.height <= size.height + 1,
        "Search fits viewport",
      );
      await page.getByRole("button", { name: "Close command palette" }).click();
      await page.screenshot({
        path: `reports/${theme}-${size.width}x${size.height}.png`,
        fullPage: true,
      });
      assert.deepEqual(errors, [], "No console or runtime errors");
      results.push({
        theme,
        ...size,
        horizontalOverflow: false,
        consoleErrors: errors,
        status: "PASS",
      });
      await context.close();
    }
  }
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
    colorScheme: "dark",
  });
  await page.goto(baseURL);
  await page.getByRole("tab", { name: /Ingest/ }).click();
  await page.getByRole("heading", { name: "Start with the source." }).waitFor();
  await page.getByRole("tab", { name: /Ingest/ }).focus();
  await page.keyboard.press("ArrowRight");
  await page
    .getByRole("heading", { name: "Make every check count." })
    .waitFor();
  assert.equal(
    await page
      .getByRole("tab", { name: /Validate/ })
      .getAttribute("aria-selected"),
    "true",
  );
  await page.getByRole("tab", { name: /Serve/ }).click();
  await page
    .getByRole("heading", { name: "Give the data a purpose." })
    .waitFor();
  assert.equal(await page.getAttribute("html", "data-theme"), "dark");
  await page.reload();
  assert.equal(
    await page.getAttribute("html", "data-theme"),
    "dark",
    "Theme persists across reload",
  );
  await page.keyboard.press("Control+k");
  await page.getByRole("combobox").fill("KKBOX");
  await page.keyboard.press("Enter");
  await page.waitForURL("**/#kkbox");
  assert.equal(new URL(page.url()).hash, "#kkbox");
  await page.waitForFunction(() => document.activeElement?.id === "kkbox");
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.keyboard.press("Control+k");
  const paletteBounds = await page.locator("dialog").boundingBox();
  assert.ok(
    paletteBounds &&
      Math.abs(paletteBounds.x + paletteBounds.width / 2 - 640) < 2,
    "Palette horizontally centered",
  );
  await page.getByRole("combobox").fill("KKBOX");
  await page.keyboard.press("Enter");
  await page.waitForFunction(() => window.scrollY > 1000);
  await page.goto(`${baseURL}/#skills`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => {
    const top = document.getElementById("skills").getBoundingClientRect().top;
    return top >= 0 && top < 250;
  });
  await page.keyboard.press("Control+k");
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("dialog").evaluate((el) => el.open), false);
  for (const asset of [
    "/assets/sai-prakash-lingala-resume.pdf",
    "/assets/deloitte-certificate.webp",
    "/assets/ibm-certificate.webp",
    "/assets/og-image-dark.png",
    "/favicon.svg",
  ]) {
    assert.equal(
      (await page.request.get(`${baseURL}${asset}`)).status(),
      200,
      `Asset ${asset}`,
    );
  }
  // Normal motion: wheel scrolling must remain native during marble capture/rolling.
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.locator(".marble-toy").scrollIntoViewIfNeeded();
  await page.locator(".marble-toy .toy-action").click();
  const scene = await page.locator(".marble-scene").boundingBox();
  assert.ok(scene);
  await page.mouse.move(scene.x + scene.width / 2, scene.y + scene.height / 2);
  const beforeWheel = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 240);
  await page.waitForFunction(
    (before) => window.scrollY > before + 80,
    beforeWheel,
  );
  const afterWheel = await page.evaluate(() => window.scrollY);
  await page.waitForTimeout(350);
  assert.ok(
    (await page.evaluate(() => window.scrollY)) >= afterWheel - 2,
    "Animation must not pull scroll position back",
  );
  await page.waitForFunction(() =>
    document
      .querySelector(".marble-toy .toy-message")
      ?.textContent.includes("Ready to serve"),
  );
  await page.locator(".copy-email").scrollIntoViewIfNeeded();
  await page.evaluate(() =>
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text) => {
          window.__copiedEmail = text;
        },
      },
    }),
  );
  await page.getByRole("button", { name: "Copy email", exact: true }).click();
  await page
    .getByRole("button", { name: "Email copied", exact: true })
    .waitFor();
  assert.equal(
    await page.evaluate(() => window.__copiedEmail),
    "saiprakash15b@gmail.com",
  );
  await page.evaluate(() =>
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error("Denied");
        },
      },
    }),
  );
  await page.getByRole("button", { name: "Email copied", exact: true }).click();
  await page.locator(".copy-email-error").waitFor();
  assert.equal(
    await page
      .getByRole("button", { name: "Copy email", exact: true })
      .isVisible(),
    true,
  );
  await page.getByRole("button", { name: "Search portfolio" }).click();
  await page.getByRole("combobox").fill("no such section 123");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  assert.equal(await page.locator(".no-results").isVisible(), true);
  await page.keyboard.press("Escape");
  await writeFile(
    "reports/browser-results.json",
    JSON.stringify({ results, interactions: "PASS" }, null, 2),
  );
  console.log(
    `PASS: ${results.length} dark-theme viewport cases, menu, command palette, default theme, section links and local assets.`,
  );
} finally {
  await browser.close();
}
