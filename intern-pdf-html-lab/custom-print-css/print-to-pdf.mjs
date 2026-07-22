// Renders index.html to PDF using a real Chromium print pipeline, so the
// @media print rules in print.css (page breaks, @page size/margins, CSS
// counters) actually run — this is the simplest possible way to turn
// hand-rolled print CSS into a PDF file (see ../playwright-pdf for the
// general Playwright PDF technique in more depth).
import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const inputPath = 'file://' + path.join(dir, 'index.html');
const outputPath = path.join(dir, 'sample-output', 'report.pdf');

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(inputPath);
await page.emulateMedia({ media: 'print' });
await page.pdf({
  path: outputPath,
  format: 'A4',
  printBackground: true,
});
await browser.close();
console.log('Wrote', outputPath);
