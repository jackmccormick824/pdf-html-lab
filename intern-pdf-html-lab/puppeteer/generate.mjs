// Puppeteer: load a real HTML page (with a Chart.js canvas), wait for it to
// finish rendering, then print to PDF using Puppeteer's own header/footer
// template feature — a Puppeteer/Playwright-specific capability that plain
// CSS print styles don't have: automatic total-page-count injection via
// <span class="totalPages"> with zero extra markup in the source document.
import puppeteer from 'puppeteer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const inputPath = 'file://' + path.join(dir, 'report.html');
const outputPath = path.join(dir, 'sample-output', 'monthly-metrics-report.pdf');

const headerTemplate = `
  <div style="font-size:8px; width:100%; padding: 0 12mm; display:flex; justify-content:space-between; color:#888; font-family:Arial,sans-serif;">
    <span>Nimbus Analytics</span>
    <span>Monthly SaaS Metrics — June 2026</span>
  </div>
`;

const footerTemplate = `
  <div style="font-size:8px; width:100%; padding: 0 12mm; display:flex; justify-content:space-between; color:#888; font-family:Arial,sans-serif;">
    <span>Confidential — Board &amp; Investors Only</span>
    <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
  </div>
`;

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto(inputPath, { waitUntil: 'networkidle0' });
await page.waitForSelector('body[data-chart-ready="true"]');

await page.pdf({
  path: outputPath,
  format: 'A4',
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate,
  footerTemplate,
  margin: { top: '22mm', bottom: '18mm', left: '14mm', right: '14mm' },
});

await browser.close();
console.log('Wrote', outputPath);
