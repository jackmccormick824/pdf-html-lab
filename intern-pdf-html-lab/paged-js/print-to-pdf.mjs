// Paged.js paginates in the browser and, once it finishes, the resulting
// .pagedjs_page elements are already sized/laid out to match real print
// pages — printing that (rather than the pre-pagination DOM) is what makes
// @page rules, named pages (the landscape appendix), running headers
// (string-set), and target-counter() page references come out correctly.
// This script waits for Paged.js to finish, then uses the same
// Playwright print-to-PDF call as ../custom-print-css/print-to-pdf.mjs.
import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
// Paged.js fetches its stylesheets via XHR to parse @page rules, which the
// file:// origin's CORS restrictions block — serve over local HTTP instead.
// `npx http-server` (or any static server) pointed at this folder works too.
const inputPath = process.env.PAGEDJS_URL || 'http://localhost:8420/paged-js/index.html';
const outputPath = path.join(dir, 'sample-output', 'new-hire-handbook.pdf');

const browser = await chromium.launch();
const page = await browser.newPage();
page.on('console', (msg) => console.log('[page]', msg.text()));
page.on('pageerror', (err) => console.log('[pageerror]', err.message));
await page.goto(inputPath, { waitUntil: 'networkidle' });

// Wait until Paged.js has finished chunking content into page boxes and
// the count has stabilized (it renders incrementally).
await page.waitForFunction(() => document.querySelectorAll('.pagedjs_page').length > 0, { timeout: 60000 });
await page.waitForFunction(() => {
  const count = document.querySelectorAll('.pagedjs_page').length;
  if (window.__lastPageCount === count) return true;
  window.__lastPageCount = count;
  return false;
}, { timeout: 15000 }).catch(() => {});
await page.waitForTimeout(500);

await page.pdf({
  path: outputPath,
  printBackground: true,
  preferCSSPageSize: true,
});

await browser.close();
console.log('Wrote', outputPath);
