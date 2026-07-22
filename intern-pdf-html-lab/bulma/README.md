# Bulma 1.0 — product launch readiness report

**Category:** CSS framework (HTML/browser polish) · **From starter list:** yes
**License:** MIT · **Language:** CSS (no required JS — the only JS here is the theme toggle)

Bulma is a flexbox-based CSS framework with no JavaScript dependency at all
(Bootstrap needs its JS bundle for interactive components; Bulma is CSS-only).
Class vocabulary (`columns`, `box`, `notification`, `tag`) reads a bit more
like plain English than Bootstrap's. Bulma 1.0 added native dark-mode support
via CSS custom properties, toggled here with a `data-theme` attribute — no
extra framework code needed, unlike Tailwind's custom variant setup.

## Showcase features (7 of the required 4+)

1. **Branded header/footer** — hero banner + logo mark + footer.
2. **Styled data table** — `table is-striped is-hoverable` with tag-pill status column.
3. **Chart/graph** — Chart.js line chart for readiness trend.
4. **Callout boxes** — Bulma `notification` components (info/danger variants).
5. **Print CSS** — `@media print` hides the hero nav bar, sets `@page` margins, avoids breaking boxes/rows across pages.
6. **Custom fonts** — Fraunces (serif, headings) + Inter (body) via Google Fonts,
   showing a framework-agnostic typography upgrade over system fonts.
7. **Dark/light theme** — Bulma 1.0's built-in `data-theme="dark"` support (framework-native, zero custom CSS required).

## How to run

```bash
npm install   # only needed to re-vendor bulma yourself; vendor/ is already populated
open index.html
```

## Install effort

Very low — single CSS file, no JS bundle required for the framework itself (only for the demo's theme toggle and chart).

## Best for

Teams that want more semantic, readable class names than Bootstrap and don't
need Bootstrap's JS-powered components (modals, dropdowns, etc.) — pure
content/report pages are a good fit.

## Limitations

- Smaller ecosystem/plugin availability than Bootstrap.
- No JS components bundled — anything interactive (modals, tabs) you build yourself.
- Same as other CSS frameworks here: HTML/CSS only, still need a PDF step (see the PDF-generation folders) for a file deliverable.
