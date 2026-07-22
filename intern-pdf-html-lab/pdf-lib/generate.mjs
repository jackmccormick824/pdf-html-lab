// pdf-lib: build a PDF from scratch with low-level drawing primitives (no
// browser, no HTML) — you position every line of text and every shape
// yourself. This script builds two small PDFs (a certificate cover page and
// a data appendix), then demonstrates pdf-lib's other headline feature —
// merging separate PDF documents into one — before stamping page numbers
// across the merged result.
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(dir, 'sample-output');
await fs.mkdir(outDir, { recursive: true });

const A4 = [595.28, 841.89];

// ---------- Document 1: certificate cover page (custom embedded font) ----------
async function buildCertificate() {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const bold = await pdf.embedFont(await fs.readFile(path.join(dir, 'fonts/Poppins-Bold.ttf')));
  const regular = await pdf.embedFont(await fs.readFile(path.join(dir, 'fonts/Poppins-Regular.ttf')));

  const page = pdf.addPage(A4);
  const { width, height } = page.getSize();

  // Border frame
  page.drawRectangle({
    x: 24, y: 24, width: width - 48, height: height - 48,
    borderColor: rgb(0.18, 0.31, 0.62), borderWidth: 2,
  });

  const centerText = (text, font, size, y, color = rgb(0.1, 0.1, 0.15)) => {
    const w = font.widthOfTextAtSize(text, size);
    page.drawText(text, { x: (width - w) / 2, y, size, font, color });
  };

  centerText('CERTIFICATE OF COMPLETION', bold, 14, height - 140, rgb(0.18, 0.31, 0.62));
  centerText('Free & Open-Source PDF Tooling Lab', regular, 12, height - 165, rgb(0.4, 0.4, 0.45));
  centerText('This certifies that the', regular, 12, height - 260);
  centerText('intern-pdf-html-lab', bold, 26, height - 300);
  centerText('project was built using pdf-lib, embedding a real TrueType', regular, 11, height - 340);
  centerText('font (Poppins, via @pdf-lib/fontkit) with zero browser involved.', regular, 11, height - 358);

  // A small "chart" — hand-drawn bars, since pdf-lib has no chart helper
  const chartOrigin = { x: width / 2 - 140, y: height - 470 };
  const bars = [
    { label: 'ReportLab', value: 0.55 },
    { label: 'WeasyPrint', value: 0.7 },
    { label: 'pdf-lib', value: 0.9 },
    { label: 'fpdf2', value: 0.4 },
  ];
  bars.forEach((b, i) => {
    const barW = 44;
    const barH = 90 * b.value;
    const x = chartOrigin.x + i * 70;
    page.drawRectangle({ x, y: chartOrigin.y, width: barW, height: barH, color: rgb(0.35, 0.55, 0.85) });
    const labelW = regular.widthOfTextAtSize(b.label, 8);
    page.drawText(b.label, { x: x + barW / 2 - labelW / 2, y: chartOrigin.y - 12, size: 8, font: regular, color: rgb(0.3,0.3,0.3) });
  });
  centerText('Relative "drawing primitives you get for free" (illustrative)', regular, 8, chartOrigin.y - 28, rgb(0.5,0.5,0.5));

  // Callout box
  const calloutY = 150;
  page.drawRectangle({ x: 90, y: calloutY, width: width - 180, height: 60, color: rgb(0.95, 0.96, 0.99), borderColor: rgb(0.18,0.31,0.62), borderWidth: 1 });
  page.drawLine({ start: { x: 90, y: calloutY }, end: { x: 90, y: calloutY + 60 }, thickness: 4, color: rgb(0.18,0.31,0.62) });
  page.drawText('Everything on this page — border, bars, callout box, text — is drawn', { x: 104, y: calloutY + 38, size: 9, font: regular, color: rgb(0.2,0.2,0.25) });
  page.drawText('with explicit x/y coordinates. No layout engine, no CSS.', { x: 104, y: calloutY + 24, size: 9, font: regular, color: rgb(0.2,0.2,0.25) });

  centerText('Issued July 22, 2026', regular, 10, 90, rgb(0.4,0.4,0.4));

  return pdf.save();
}

// ---------- Document 2: multi-page data appendix (plain StandardFonts) ----------
async function buildAppendix() {
  const pdf = await PDFDocument.create();
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);

  const rows = [
    ['Library', 'Language', 'License', 'Needs a browser?'],
    ['pdf-lib', 'JS/TS', 'MIT', 'No'],
    ['ReportLab', 'Python', 'BSD', 'No'],
    ['WeasyPrint', 'Python', 'BSD', 'No (uses its own CSS/layout engine)'],
    ['Puppeteer', 'JS/TS', 'Apache-2.0', 'Yes (bundles Chromium)'],
    ['Playwright', 'JS/TS', 'Apache-2.0', 'Yes (bundles browsers)'],
    ['fpdf2', 'Python', 'LGPL-3.0', 'No'],
    ['xhtml2pdf', 'Python', 'Apache-2.0', 'No'],
    ['jsPDF', 'JS/TS', 'MIT', 'No (runs in-browser, but no headless render needed)'],
  ];

  const rowsPerPage = 5;
  const dataRows = rows.slice(1);
  const pageCount = Math.ceil(dataRows.length / rowsPerPage);

  for (let p = 0; p < pageCount; p++) {
    const page = pdf.addPage(A4);
    const { width, height } = page.getSize();
    let y = height - 60;

    page.drawText('Appendix: Library Reference Table', { x: 50, y, size: 16, font: bold, color: rgb(0.1,0.1,0.15) });
    y -= 30;

    const colX = [50, 160, 260, 360];
    rows[0].forEach((h, i) => page.drawText(h, { x: colX[i], y, size: 10, font: bold, color: rgb(0.2,0.2,0.3) }));
    y -= 6;
    page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 1, color: rgb(0.6,0.6,0.6) });
    y -= 16;

    const pageRows = dataRows.slice(p * rowsPerPage, (p + 1) * rowsPerPage);
    for (const row of pageRows) {
      row.forEach((cell, i) => {
        const maxWidth = i === 3 ? 190 : 90;
        const text = cell.length > 40 && i === 3 ? cell.slice(0, 40) + '…' : cell;
        page.drawText(text, { x: colX[i], y, size: 9, font: regular, color: rgb(0.15,0.15,0.2), maxWidth });
      });
      y -= 22;
    }
  }

  return pdf.save();
}

// ---------- Merge + stamp page numbers across the combined document ----------
async function main() {
  const certBytes = await buildCertificate();
  const appendixBytes = await buildAppendix();

  const merged = await PDFDocument.create();
  const font = await merged.embedFont(StandardFonts.Helvetica);

  const certDoc = await PDFDocument.load(certBytes);
  const appendixDoc = await PDFDocument.load(appendixBytes);

  const certPages = await merged.copyPages(certDoc, certDoc.getPageIndices());
  certPages.forEach((p) => merged.addPage(p));
  const appendixPages = await merged.copyPages(appendixDoc, appendixDoc.getPageIndices());
  appendixPages.forEach((p) => merged.addPage(p));

  const total = merged.getPageCount();
  merged.getPages().forEach((page, i) => {
    if (i === 0) return; // skip page number on the certificate cover
    const { width } = page.getSize();
    const label = `Page ${i + 1} of ${total}`;
    const w = font.widthOfTextAtSize(label, 8);
    page.drawText(label, { x: width - w - 40, y: 30, size: 8, font, color: rgb(0.5, 0.5, 0.5) });
  });

  const finalBytes = await merged.save();
  await fs.writeFile(path.join(outDir, 'certificate-and-appendix.pdf'), finalBytes);
  console.log(`Wrote sample-output/certificate-and-appendix.pdf (${total} pages, merged from 2 documents)`);
}

main();
