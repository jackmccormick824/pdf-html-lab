# Pico.css — classless weekly status report

**Category:** CSS framework, classless (HTML/browser polish) · **From starter list:** yes
**License:** MIT · **Language:** CSS only

Pico is a "classless" framework: you write plain semantic HTML
(`<header>`, `<section>`, `<table>`, `<article>`) and it styles the tags
directly, no `class="..."` soup required. This example's `<body>` content has
almost no custom classes — only the two callout boxes and the theme-toggle
button use one apiece. Everything else (headings, `<table>`, `<figure>`) is
styled purely by tag.

## Showcase features (6 of the required 4+)

1. **Branded header/footer** — semantic `<header>`/`<footer>`, no framework markup needed.
2. **Styled data table** — a plain `<table>` gets zebra striping/spacing for free.
3. **Chart/graph** — Chart.js bar chart of sprint velocity.
4. **Callout boxes** — the only custom CSS in the page (~6 lines), built on Pico's CSS variables so they still respect the active theme.
5. **Print CSS** — `@media print` hides the top nav and sets `@page` margins.
6. **Dark/light theme** — Pico's native `data-theme="dark"` attribute (also auto-responds to OS `prefers-color-scheme` if you omit the attribute entirely).

## How to run

```bash
npm install   # only to re-vendor pico.min.css yourself; vendor/ is already populated
open index.html
```

## Install effort

Trivial — one `<link>` tag, zero classes to learn for a basic document. This
is the lowest-effort option in the whole CSS section.

## Best for

Docs pages, internal tools, README-style reports, anywhere you want a
"looks intentional, not a wall of Times New Roman" result from writing
almost no CSS at all. Not meant for pixel-perfect brand design.

## Limitations

- Very little visual customization without writing your own CSS on top
  (compare to Bulma/Bootstrap's component classes).
- No layout grid system built in — for anything beyond simple document flow
  (multi-column dashboards) you'll reach for your own flexbox/grid CSS.
- **Related but not built separately:** MVP.css and Water.css (see `../water-css`)
  are the same "classless" idea with different default aesthetics — the three
  are close enough in capability that building all three would be redundant;
  Water.css was chosen for its own folder because its automatic OS dark-mode
  detection is a slightly different mechanism worth showing on its own.
