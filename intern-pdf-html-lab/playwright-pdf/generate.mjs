// Playwright's PDF API is (deliberately) near-identical to Puppeteer's —
// both wrap the same underlying Chromium DevTools Protocol print call —
// so this example leans into the differences that matter in practice:
// a genuinely wide dataset that benefits from `landscape: true`, a
// self-hosted variable font via @font-face (no CDN), and Plotly.js instead
// of Chart.js for the chart.
import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const inputPath = 'file://' + path.join(dir, 'report.html');
const outputPath = path.join(dir, 'sample-output', 'regional-sales-report.pdf');

const headerTemplate = `
  <div style="font-size:8px; width:100%; padding: 0 14mm; display:flex; justify-content:space-between; color:#888; font-family:Arial,sans-serif;">
    <span>Nimbus Analytics — Revenue Operations</span>
    <span>FY2026 H1 Regional Sales Report</span>
  </div>
`;
const footerTemplate = `
  <div style="font-size:8px; width:100%; padding: 0 14mm; display:flex; justify-content:space-between; color:#888; font-family:Arial,sans-serif;">
    <span>Confidential — Internal Use Only</span>
    <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
  </div>
`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(inputPath, { waitUntil: 'networkidle' });
await page.waitForSelector('body[data-chart-ready="true"]');
await page.waitForTimeout(200); // let Plotly finish its own internal paint

await page.pdf({
  path: outputPath,
  format: 'A4',
  landscape: true,
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate,
  footerTemplate,
  margin: { top: '20mm', bottom: '16mm', left: '14mm', right: '14mm' },
});

await browser.close();
console.log('Wrote', outputPath);
