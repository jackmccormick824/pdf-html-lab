// PDFKit: a fluent, chainable drawing API (think "Node's ReportLab") with
// one big advantage over ../pdf-lib for prose-heavy documents — .text()
// wraps and flows automatically within a given width, and the document
// adds new pages on its own when content overflows. pdf-lib makes you
// compute every line break yourself.
import PDFDocument from 'pdfkit';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(dir, 'sample-output', 'investor-update-letter.pdf');
fs.mkdirSync(path.dirname(outPath), { recursive: true });

const doc = new PDFDocument({ size: 'A4', margins: { top: 72, bottom: 60, left: 64, right: 64 }, bufferPages: true });
doc.pipe(fs.createWriteStream(outPath));

doc.registerFont('Sans-Bold', path.join(dir, 'fonts/Inter-Bold.ttf'));
doc.registerFont('Serif', path.join(dir, 'fonts/Lora-Regular.ttf'));
doc.registerFont('Serif-Italic', path.join(dir, 'fonts/Lora-Italic.ttf'));

const accent = '#7a3b12';
const ink = '#1c1c1c';
const muted = '#6b6b6b';

// ---------- Header band (vector-drawn logo mark, no image file needed) ----------
function drawBrandMark() {
  doc.save();
  doc.circle(64 + 12, 50, 12).fill(accent);
  doc.fillColor('white').font('Sans-Bold').fontSize(11).text('NA', 64 + 4, 44);
  doc.restore();
  doc.fillColor(ink).font('Sans-Bold').fontSize(10).text('NIMBUS ANALYTICS', 64 + 32, 44, { characterSpacing: 1 });
  doc.fillColor(muted).font('Serif').fontSize(9).text('Investor Update · Q2 2026', 64 + 32, 57);
  doc.moveTo(64, 82).lineTo(531, 82).lineWidth(1.5).strokeColor(accent).stroke();
  doc.moveDown(2);
}
drawBrandMark();

// ---------- Flowing letter body — this is the part pdf-lib can't do for you ----------
doc.fillColor(ink).font('Serif').fontSize(11).text(
  'Dear investors,',
  { paragraphGap: 10 }
);
doc.font('Serif').fontSize(11).text(
  `Q2 was our strongest quarter to date. ARR grew 18% quarter-over-quarter to $19.3M, ` +
  `net revenue retention held at 128%, and we closed the quarter with 27 months of runway ` +
  `at current burn. The headline driver was EMEA, where the enterprise renewal cohort we ` +
  `flagged last quarter closed 3-4 weeks ahead of schedule — six deals totaling $1.1M in ` +
  `annualized value, none of which required a discount beyond our standard multi-year terms.`,
  { align: 'justify', paragraphGap: 10 }
);
doc.font('Serif').fontSize(11).text(
  `We also shipped the Analytics Pro tier in April, three weeks ahead of the roadmap we shared ` +
  `at the last board meeting. Early attach rate among existing Team-tier accounts is running at ` +
  `9%, ahead of our 6% first-quarter target for a new tier launch. We believe this validates the ` +
  `pricing thesis from our March strategy memo and expect attach rate to keep climbing as the ` +
  `in-app upsell prompts roll out to the full base in July.`,
  { align: 'justify', paragraphGap: 10 }
);
doc.font('Serif-Italic').fontSize(11).fillColor(accent).text(
  `"This was the first quarter where expansion revenue, not new logos, was the majority of net new ARR — a milestone we've been building toward for six quarters."`,
  { align: 'left', indent: 20, paragraphGap: 10 }
);
doc.font('Serif').fontSize(11).fillColor(ink).text(
  `On the other side of the ledger: APAC growth continues to lag the rest of the business at ` +
  `just 6% YoY, against 14-31% everywhere else. We believe this is a pricing localization problem, ` +
  `not a product or demand problem, and the regional team has a proposal ready for the Q3 planning ` +
  `offsite. We'll bring the details to the next board meeting.`,
  { align: 'justify', paragraphGap: 16 }
);

// ---------- Vector-drawn line chart (no chart library, no rasterized image) ----------
doc.font('Sans-Bold').fontSize(11).fillColor(ink).text('ARR Growth — Trailing 6 Quarters', { paragraphGap: 6 });
{
  const chartX = doc.x, chartTop = doc.y, chartW = 467, chartH = 130;
  const values = [11.2, 12.6, 14.1, 15.8, 17.4, 19.3]; // $M
  const labels = ['Q1 25', 'Q2 25', 'Q3 25', 'Q4 25', 'Q1 26', 'Q2 26'];
  const maxV = 22;

  doc.save();
  doc.strokeColor('#ddd').lineWidth(0.5);
  [0, 0.25, 0.5, 0.75, 1].forEach((f) => {
    const y = chartTop + chartH - f * chartH;
    doc.moveTo(chartX, y).lineTo(chartX + chartW, y).stroke();
  });

  const points = values.map((v, i) => [
    chartX + (i / (values.length - 1)) * chartW,
    chartTop + chartH - (v / maxV) * chartH,
  ]);
  doc.strokeColor(accent).lineWidth(2);
  doc.moveTo(points[0][0], points[0][1]);
  points.slice(1).forEach(([x, y]) => doc.lineTo(x, y));
  doc.stroke();

  points.forEach(([x, y], i) => {
    doc.circle(x, y, 3).fill(accent);
    doc.fillColor(muted).font('Serif').fontSize(8).text(`$${values[i]}M`, x - 14, y - 16, { width: 28, align: 'center' });
    doc.fillColor(muted).font('Serif').fontSize(8).text(labels[i], x - 18, chartTop + chartH + 8, { width: 36, align: 'center' });
  });
  doc.restore();
  doc.x = chartX;
  doc.y = chartTop + chartH + 30;
}

// ---------- Hand-drawn table of key metrics ----------
doc.font('Sans-Bold').fontSize(11).fillColor(ink).text('Key Metrics', { paragraphGap: 6 });
{
  const rows = [
    ['Metric', 'Q1 2026', 'Q2 2026', 'QoQ'],
    ['ARR', '$16.3M', '$19.3M', '+18%'],
    ['Net revenue retention', '124%', '128%', '+4pt'],
    ['Gross margin', '78%', '79%', '+1pt'],
    ['Months of runway', '29', '27', '-2'],
  ];
  const colW = [180, 90, 90, 90];
  const startX = doc.x;
  let y = doc.y;
  rows.forEach((row, r) => {
    let x = startX;
    if (r === 0) doc.rect(startX, y, colW.reduce((a, b) => a + b, 0), 20).fill('#f4efe8');
    row.forEach((cell, c) => {
      doc.fillColor(r === 0 ? ink : '#333')
        .font(r === 0 ? 'Sans-Bold' : 'Serif')
        .fontSize(9.5)
        .text(cell, x + 6, y + 6, { width: colW[c] - 12, align: c === 0 ? 'left' : 'right' });
      x += colW[c];
    });
    y += 20;
    if (r > 0) {
      doc.moveTo(startX, y).lineTo(startX + colW.reduce((a, b) => a + b, 0), y).strokeColor('#e5ddd0').lineWidth(0.5).stroke();
    }
  });
  doc.x = startX;
  doc.y = y + 16;
}

// ---------- Callout box ----------
{
  const boxX = doc.x, boxY = doc.y, boxW = 467;
  const text = 'Next board meeting: August 12, 2026. Please review the Q3 hiring plan (sent separately) before then — we\'d like to lock headcount for the APAC pricing initiative at that meeting.';
  doc.font('Serif').fontSize(9.5);
  const textH = doc.heightOfString(text, { width: boxW - 28 });
  doc.rect(boxX, boxY, boxW, textH + 24).fill('#fbf3ea');
  doc.rect(boxX, boxY, 4, textH + 24).fill(accent);
  doc.fillColor('#3a2a18').text(text, boxX + 18, boxY + 12, { width: boxW - 28 });
  doc.x = boxX;
  doc.y = boxY + textH + 24 + 20;
}

doc.font('Serif-Italic').fontSize(11).fillColor(ink).text('Thank you, as always, for the support.');
doc.moveDown(0.5);
doc.font('Serif').fontSize(11).text('— The Nimbus Analytics team');

// ---------- Page numbers, added after all content is placed (bufferPages
// lets us go back and stamp every page once the total count is known) ----------
const range = doc.bufferedPageRange();
const bottomMargin = doc.page.margins.bottom;
for (let i = range.start; i < range.start + range.count; i++) {
  doc.switchToPage(i);
  // Text placed inside the page margins still trips PDFKit's overflow
  // guard and silently spawns a new page — zero the bottom margin for the
  // duration of this one stamp so it doesn't count as "off the page".
  doc.page.margins.bottom = 0;
  doc.font('Serif').fontSize(8).fillColor('#999').text(
    `Page ${i + 1} of ${range.count}`,
    64, 802, { width: 467, align: 'center' }
  );
  doc.page.margins.bottom = bottomMargin;
}

doc.end();
console.log('Wrote', outPath);
