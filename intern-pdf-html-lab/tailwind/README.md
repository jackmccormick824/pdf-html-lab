# Tailwind CSS v4 — polished HTML report

**Category:** CSS framework (HTML/browser polish) · **From starter list:** yes
**License:** MIT · **Language:** CSS (utility classes) + a little vanilla JS

Tailwind is a utility-first CSS framework — instead of pre-built components you
compose small single-purpose classes (`px-4`, `text-slate-600`, `dark:bg-slate-900`)
directly in your markup. This example uses the real Tailwind v4 CLI build (not
the CDN play-script), so it reflects what a production setup looks like:
purging unused CSS, custom theme tokens, and a hand-written `@layer utilities`
block for reusable callout styles.

## Showcase features (7 of the required 4+)

1. **Branded header/footer** — logo mark, title block, confidential footer strip.
2. **Styled data table** — striped rows, right-aligned numeric columns, status pills.
3. **Chart/graph** — a Chart.js line chart for the revenue trend (chart libs are
   a cross-cutting technique, not tied to any one CSS framework — Chart.js is
   used here and reused in a couple of the PDF examples).
4. **Callout boxes** — info/warning boxes built from a small custom `@layer utilities` block.
5. **Print CSS** — `@media print` hides the nav/toggle, forces a light background,
   sets `@page` margins, and prevents cards/table rows from splitting across pages.
6. **Dark/light theme** — a real toggle (not just OS `prefers-color-scheme`) using
   Tailwind v4's `@custom-variant dark` + a `.dark` class on `<html>`, persisted to `localStorage`.
7. **TOC** — in-page anchor navigation to each section.

## How to run

```bash
npm install
npx @tailwindcss/cli -i ./src/input.css -o ./dist/output.css --minify
open index.html   # or serve the folder and open in a browser
```

To print to PDF: open `index.html` in Chrome → File → Print → Save as PDF.
The print stylesheet in `src/input.css` (`@media print`) controls how it lays out.

`sample-output/` contains a frozen, already-built copy (`index.html` + `output.css`)
so you can view the result without running the build.

## Install effort

Low — one `npm install`, one CLI build command. No server required; output is static HTML+CSS.

## Best for

Teams that already use Tailwind for their product UI and want report/dashboard
pages to share the same design tokens. Excellent for browser-viewed HTML reports;
pairs well with Puppeteer/Playwright (see `../puppeteer` and `../playwright-pdf`)
when you need the same page as a PDF.

## Limitations

- Utility classes make markup verbose; needs a build step (or the CDN script,
  which is slower and not meant for production) — not truly a drop-in `<link>` like Pico/Water.
- Tailwind itself doesn't touch PDF generation — you still need a
  headless-browser step (Puppeteer/Playwright) or print-to-PDF to get a PDF out of this.
