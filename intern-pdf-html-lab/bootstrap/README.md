# Bootstrap 5.3 — field ops dashboard report

**Category:** CSS framework (HTML/browser polish) · **From starter list:** yes
**License:** MIT · **Language:** CSS/JS components

Bootstrap ships pre-built components (navbar, cards, tables, badges, alerts)
rather than Tailwind's raw utilities — faster to assemble a dashboard-style
report, less granular control over spacing/typography than a utility-first
approach. Local `vendor/` copies of `bootstrap.min.css` and
`bootstrap.bundle.min.js` are vendored from the npm package so the page runs
fully offline (no CDN dependency for the framework itself; Chart.js is still CDN-loaded).

## Showcase features (6 of the required 4+)

1. **Branded header/footer** — navbar + logo mark + footer strip.
2. **Styled data table** — `table-striped table-hover`, right-aligned numeric columns, status badges.
3. **Chart/graph** — Chart.js bar chart of weekly ticket volume.
4. **Callout boxes** — Bootstrap `alert-info` / `alert-warning` components.
5. **Print CSS** — `@media print` + `@page { size: landscape; }` so this wide
   table prints/exports in landscape automatically, with the navbar hidden.
6. **Dark/light theme** — Bootstrap 5.3's native `data-bs-theme` color-mode
   attribute (no custom CSS variant needed, unlike Tailwind's approach in `../tailwind`).

## How to run

```bash
npm install        # only needed if you want to re-vendor bootstrap yourself
open index.html    # vendor/ is already populated, works standalone
```

Print to PDF via Chrome's print dialog to see the landscape `@page` rule in action.

## Install effort

Very low — drop in the CSS/JS, write markup with Bootstrap's class vocabulary. No build step required (unlike Tailwind).

## Best for

Fast, consistent-looking internal dashboards and reports where you want
recognizable, accessible components (navbar, cards, badges, alerts) without
designing a system from scratch. Bootstrap's utility classes are less granular
than Tailwind's, so highly custom brand designs are more work.

## Limitations

- Class names bake in more visual opinion than a utility framework — reskinning
  away from "looks like Bootstrap" takes real effort (SASS variable overrides).
- Like Tailwind, it only produces HTML/CSS — pair with Puppeteer/Playwright or
  a browser print dialog to get an actual PDF file.
