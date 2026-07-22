// @react-pdf/renderer: describe a PDF as a tree of React components
// (Document/Page/View/Text) styled with a StyleSheet.create() API that
// mirrors React Native's flexbox — not CSS, not raw coordinates like
// pdf-lib/PDFKit. This file intentionally uses React.createElement instead
// of JSX so the example runs with plain `node generate.mjs`, no build step
// or JSX transform required.
import React from 'react';
import {
  Document, Page, View, Text, Font, StyleSheet, renderToFile,
} from '@react-pdf/renderer';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const e = React.createElement;
const dir = path.dirname(fileURLToPath(import.meta.url));

Font.register({ family: 'Work Sans', src: path.join(dir, 'fonts/WorkSans.ttf') });

const accent = '#9333ea';
const ink = '#1a1a1a';
const muted = '#6b6b6b';

const styles = StyleSheet.create({
  page: { fontFamily: 'Work Sans', fontSize: 10, color: ink, padding: '40 44' },
  headerBand: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 3, borderBottomColor: accent, paddingBottom: 14, marginBottom: 20 },
  logo: { width: 34, height: 34, borderRadius: 17, backgroundColor: accent, color: 'white', textAlign: 'center', paddingTop: 10, fontSize: 11, fontWeight: 700 },
  h1: { fontSize: 18, fontWeight: 700 },
  sub: { color: muted, fontSize: 9, marginTop: 2 },
  kpiRow: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  kpiCard: { flex: 1, borderWidth: 1, borderColor: '#eee', borderRadius: 6, padding: 10 },
  kpiLabel: { fontSize: 7.5, color: muted, textTransform: 'uppercase' },
  kpiValue: { fontSize: 16, fontWeight: 700, color: accent, marginTop: 3 },
  h2: { fontSize: 12, fontWeight: 700, borderBottomWidth: 1.5, borderBottomColor: accent, paddingBottom: 4, marginBottom: 10, marginTop: 16 },
  chartRow: { flexDirection: 'row', alignItems: 'flex-end', height: 110, gap: 14, paddingLeft: 4 },
  barWrap: { alignItems: 'center', width: 46 },
  barLabel: { fontSize: 7.5, color: muted, marginTop: 4 },
  barValueLabel: { fontSize: 7.5, color: ink, marginBottom: 3 },
  table: { borderWidth: 1, borderColor: '#eee', borderRadius: 4 },
  tr: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee' },
  trHead: { backgroundColor: '#f5eefc' },
  td: { flex: 1, padding: 6, fontSize: 9 },
  tdHead: { flex: 1, padding: 6, fontSize: 9, fontWeight: 700 },
  callout: { flexDirection: 'row', backgroundColor: '#f5eefc', borderRadius: 4, marginTop: 14, padding: 10 },
  calloutBar: { width: 3, backgroundColor: accent, borderRadius: 2, marginRight: 10 },
  footer: { position: 'absolute', bottom: 24, left: 44, right: 44, flexDirection: 'row', justifyContent: 'space-between', fontSize: 8, color: muted, borderTopWidth: 0.5, borderTopColor: '#ddd', paddingTop: 6 },
  longPara: { lineHeight: 1.5, marginBottom: 8, textAlign: 'justify' },
});

const bars = [
  { label: 'Clean water', value: 82, color: accent },
  { label: 'Education', value: 64, color: '#7c3aed' },
  { label: 'Healthcare', value: 91, color: '#a855f7' },
  { label: 'Nutrition', value: 57, color: '#c084fc' },
];
const maxBar = 100;

const table = [
  ['Program', 'Beneficiaries', 'Budget', '% of program spend'],
  ['Clean water access', '18,400', '$412,000', '34%'],
  ['Primary education', '9,200', '$298,000', '25%'],
  ['Community healthcare', '26,700', '$356,000', '29%'],
  ['Nutrition & food security', '14,100', '$146,000', '12%'],
];

function Footer() {
  return e(Text, {
    style: { position: 'absolute', bottom: 24, left: 44, fontSize: 8, color: muted },
    render: ({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`,
    fixed: true,
  });
}

const doc = e(Document, { title: 'Annual Impact Report — Meridian Foundation' },
  e(Page, { size: 'A4', style: styles.page },
    e(View, { style: styles.headerBand },
      e(View, { style: { flexDirection: 'row', alignItems: 'center', gap: 10 } },
        e(Text, { style: styles.logo }, 'MF'),
        e(View, { style: { marginLeft: 10 } },
          e(Text, { style: styles.h1 }, 'Annual Impact Report'),
          e(Text, { style: styles.sub }, 'Meridian Foundation · Fiscal Year 2026'),
        ),
      ),
      e(Text, { style: styles.sub }, 'Prepared for the Board of Directors'),
    ),

    e(View, { style: styles.kpiRow },
      [
        ['People reached', '68,400'],
        ['Program budget', '$1.21M'],
        ['Program efficiency', '89%'],
        ['Active partners', '23'],
      ].map(([label, value], i) =>
        e(View, { style: styles.kpiCard, key: i },
          e(Text, { style: styles.kpiLabel }, label),
          e(Text, { style: styles.kpiValue }, value),
        )
      )
    ),

    e(Text, { style: styles.h2 }, 'Program Reach (% of annual target achieved)'),
    e(View, { style: styles.chartRow },
      bars.map((b, i) =>
        e(View, { style: styles.barWrap, key: i },
          e(Text, { style: styles.barValueLabel }, `${b.value}%`),
          e(View, { style: { width: 30, height: (b.value / maxBar) * 80, backgroundColor: b.color, borderRadius: 3 } }),
          e(Text, { style: styles.barLabel }, b.label),
        )
      )
    ),

    e(Text, { style: styles.h2 }, 'Spend by Program'),
    e(View, { style: styles.table },
      e(View, { style: [styles.tr, styles.trHead] },
        table[0].map((h, i) => e(Text, { style: styles.tdHead, key: i }, h))
      ),
      ...table.slice(1).map((row, r) =>
        e(View, { style: styles.tr, key: r },
          row.map((cell, i) => e(Text, { style: styles.td, key: i }, cell))
        )
      )
    ),

    e(View, { style: styles.callout },
      e(View, { style: styles.calloutBar }),
      e(Text, { style: { fontSize: 9.5, flex: 1 } },
        e(Text, { style: { fontWeight: 700 } }, 'Clean water program exceeded its annual target. '),
        'Two new wells completed ahead of schedule in Q3 pushed beneficiary reach 12% past plan — the community health program is next in line for a similar mid-year capacity review.'
      ),
    ),

    Footer(),
  ),

  // Second page: flowing prose that wraps and paginates on its own, to
  // show react-pdf documents aren't limited to one hand-laid-out page.
  e(Page, { size: 'A4', style: styles.page },
    e(Text, { style: styles.h2 }, 'Letter from the Executive Director'),
    e(Text, { style: styles.longPara },
      'This year tested our organization in ways we did not fully anticipate. Currency volatility in two of our ' +
      'primary program countries meant the same donor dollar bought less on the ground than it did twelve months ' +
      'earlier, and we made the deliberate choice to protect program spend rather than administrative capacity — ' +
      'a decision that stretched our small team but one the board and I stand behind.'
    ),
    e(Text, { style: styles.longPara },
      'Despite that headwind, every program above hit or exceeded its target, and our cost per beneficiary declined ' +
      'for the third consecutive year. That is a credit to our field teams, our local partners, and to the ' +
      'monitoring-and-evaluation discipline we have built over the last three fiscal years — discipline that lets us ' +
      'say with real confidence, not just hope, that the dollars you send do what we say they will do.'
    ),
    e(Text, { style: styles.longPara },
      'Next year we are proposing a fifth program area: digital literacy, piloted alongside our existing education ' +
      'infrastructure in two regions. It is a smaller bet than clean water or healthcare, sized deliberately so a ' +
      'disappointing pilot costs us a line item, not a year. If it works, it becomes program five in next year’s report.'
    ),
    Footer(),
  ),
);

const outPath = path.join(dir, 'sample-output', 'annual-impact-report.pdf');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
await renderToFile(doc, outPath);
console.log('Wrote', outPath);
