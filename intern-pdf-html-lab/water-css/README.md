# Water.css — customer onboarding health report

**Category:** CSS framework, classless (HTML/browser polish) · **From starter list:** yes
**License:** MIT · **Language:** CSS only

Same classless idea as Pico (see `../pico-css`): plain semantic HTML, no
utility classes. The difference worth showing separately is *how* dark mode
works — Water.css's `water.css`/`water.min.css` build has no toggle mechanism
at all. It uses a bare `@media (prefers-color-scheme: dark)` query, so it
just follows whatever the OS/browser is set to, with zero JavaScript and zero
`data-theme` attribute. (Water.css also ships `light.css`/`dark.css` if you
want to force one mode — not used here, to demonstrate the automatic behavior.)

## Showcase features (5 of the required 4+)

1. **Branded header/footer** — plain semantic `<header>`/`<footer>`.
2. **Styled data table** — automatic styling on a bare `<table>`.
3. **Chart/graph** — Chart.js bar chart of activation time.
4. **Callout boxes** — ~8 lines of custom CSS for the two note boxes (Water.css has no notification component either).
5. **Print CSS** + **dark/light theme** — `@media print` for layout, and the
   dark/light behavior is entirely CSS-native (verified by flipping the
   emulated OS color scheme in devtools — no interaction required).

## How to run

```bash
npm install   # only to re-vendor water.css yourself; vendor/ is already populated
open index.html
```

To see the theme change, switch your OS/browser to dark mode (or in Chrome
DevTools: Rendering tab → "Emulate CSS media feature prefers-color-scheme").

## Install effort

Trivial — same as Pico, one `<link>` tag.

## Best for

Anywhere you want to respect the reader's system theme with literally zero
code, and don't need a manual toggle. Good fit for internal docs/reports
consumed primarily on personal devices where OS theme is meaningful.

## Limitations

- No manual toggle without adding your own JS + `light.css`/`dark.css` swap logic.
- Same classless trade-offs as Pico: minimal built-in layout/grid tooling,
  no component library.
- MVP.css (starter list) sits in the same "classless" space as this and
  Pico — not built as a third separate folder since it wouldn't demonstrate
  anything meaningfully new; noted here and in `COMPARISON.md` instead.
