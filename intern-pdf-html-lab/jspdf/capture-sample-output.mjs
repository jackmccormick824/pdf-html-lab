// index.html is a client-side-only jsPDF demo (no server, no Node PDF code
// at all) — the only way to capture its real output as a committed sample
// is to drive an actual browser and intercept the download it triggers.
// This script is a *verification/capture* tool, not the library
// integration itself (that's 100% in index.html's inline <script>).
import puppeteer from 'puppeteer';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(dir, 'sample-output');
await fs.mkdir(outDir, { recursive: true });

const browser = await puppeteer.launch();
const page = await browser.newPage();
const client = await page.createCDPSession();
await client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: outDir });

await page.goto('file://' + path.join(dir, 'index.html'), { waitUntil: 'networkidle0' });
await page.click('#generate');

// Wait for the download to land on disk (jsPDF's .save() triggers a
// browser download of a blob: URL — there's no JS-visible "done" signal
// beyond the status text, so poll the download directory).
let found = null;
for (let i = 0; i < 40 && !found; i++) {
  await new Promise((r) => setTimeout(r, 250));
  const files = await fs.readdir(outDir);
  found = files.find((f) => f.endsWith('.pdf') && !f.endsWith('.crdownload'));
}

await browser.close();

if (!found) {
  console.error('Download did not complete in time');
  process.exit(1);
}
console.log('Captured', path.join('sample-output', found));
