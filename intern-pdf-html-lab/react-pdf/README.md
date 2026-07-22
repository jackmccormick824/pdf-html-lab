# @react-pdf/renderer — build PDFs as a React component tree

**Category:** JS PDF builder (no browser) · **From starter list:** no — one of this lab's own additional finds, chosen specifically because it fits a FastAPI + React stack (per the brief's constraint) better than any other JS tool here.
**License:** MIT · **Language:** React (works server-side in Node via `renderToFile`/`renderToBuffer`, or client-side via `<PDFDownloadLink>`/`usePDF`)

Instead of drawing coordinates (pdf-lib) or an imperative API (PDFKit), you
describe the document as `<Document><Page><View><Text>` components styled
with `StyleSheet.create()` — a flexbox model that will look immediately
familiar to anyone who's used React Native. This file deliberately uses
`React.createElement` instead of JSX so it runs with plain `node
generate.mjs` and no build step, but in a real app you'd write normal JSX.

## Showcase features (6 of the required 4+)

1. **Branded header/footer** — a `View` header band + a `fixed` footer `Text` repeated on every page.
2. **Multi-page with page numbers** — page 2's letter is plain flowing `Text` that wraps and would paginate further on its own if longer; the footer's `render={({pageNumber, totalPages}) => ...}` prop is react-pdf's built-in equivalent of jsPDF/PDFKit's "two-pass" page-count pattern — no manual bookkeeping needed.
3. **Chart/graph** — a bar chart built entirely from `View` elements sized by percentage height (flexbox, not canvas/SVG) — the same trick web devs use for CSS-only bar charts, applied here to react-pdf's layout engine.
4. **Styled data table** — `View` rows/columns (react-pdf has no table primitive, same as pdf-lib/PDFKit).
5. **Callout boxes** — a `flexDirection: 'row'` View with a colored accent bar `View` + text.
6. **Custom fonts** — Work Sans registered via `Font.register()`.

## A note on Recharts (from the starter list's chart section)

Recharts renders to the **DOM** (SVG inside a browser), which react-pdf's
renderer never touches — you cannot drop a `<BarChart>` from Recharts inside
a react-pdf `<Document>`. If your app already uses Recharts for on-screen
charts and you also need them in a PDF, the two working paths are: (a)
screenshot the rendered Recharts SVG via Puppeteer/Playwright and place it
in a full HTML-to-PDF pipeline (see `../puppeteer`), or (b) rebuild the
chart with react-pdf's own `View`/`Svg` primitives, as this folder does with
plain `View`s. There's no third option that reuses Recharts components directly.

## How to run

```bash
npm install
node generate.mjs   # writes sample-output/annual-impact-report.pdf
```

## Install effort

Low — pure npm install, no browser, no system dependency.

## Best for

Teams already building the UI in React who want their PDF-generation code
to feel like the rest of the codebase (components, flexbox styles, props)
rather than switching to a totally different mental model. Fits naturally
into a Node/Express or a React-adjacent backend; also works fully
client-side for "download as PDF" buttons without a server round-trip.

## Limitations

- Flexbox-only layout (no CSS Grid, no arbitrary absolute positioning
  beyond what `position: 'absolute'` + fixed offsets give you) — less
  layout power than a real browser (Puppeteer/Playwright/WeasyPrint).
- No table, chart, or Markdown primitives — same "you build it from boxes
  and text" trade-off as pdf-lib/PDFKit.
- Cannot render other React component libraries (Recharts, MUI, etc.)
  directly — see the Recharts note above.
