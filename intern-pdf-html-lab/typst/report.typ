// Typst: a modern markup-based typesetting language and compiler
// (single static binary, Rust-based, no LaTeX toolchain) that compiles
// directly to PDF. Where ../pandoc gives you polished-but-generic default
// styling from plain Markdown, this file shows what native Typst markup
// can do when you want real control: a custom page template function
// (branded running header/footer), native footnotes, native math
// typesetting, a hand-drawn chart, and a reusable callout function.

#let accent = rgb("#6d28d9")
#let accent-light = rgb("#f3f0fc")
#let ink = rgb("#1a1a1a")
#let muted = rgb("#6b6b6b")

#let callout(title, body, color: accent, bg: accent-light) = block(
  fill: bg,
  stroke: (left: 3pt + color),
  inset: (left: 14pt, right: 14pt, top: 10pt, bottom: 10pt),
  radius: 3pt,
  width: 100%,
)[
  #text(weight: "bold", fill: color, size: 10pt)[#title] \
  #text(size: 9.5pt)[#body]
]

// A tiny hand-drawn bar chart using Typst's native drawing primitives —
// no chart library, no image file, fully vector.
// block(breakable: false) is Typst's equivalent of CSS `break-inside:
// avoid` — without it, a grid that doesn't quite fit the remaining page
// height splits mid-row: the first bug found while building this example
// had "Filter"/"Agg" silently jump to the next page while the rest of the
// row stayed put, orphaning bars from their labels.
#let bar-chart(data, max-value: 100, bar-color: accent) = block(breakable: false)[
  #let bar-width = 62pt
  #let max-height = 90pt
  #grid(
    columns: data.len(),
    column-gutter: 14pt,
    ..data.map(((label, value)) => align(bottom)[
      #text(size: 8pt)[#value%] \
      #rect(width: bar-width, height: max-height * value / max-value, fill: bar-color, radius: 2pt)
      #v(4pt)
      #text(size: 8pt, fill: muted)[#label]
    ])
  )
]

#let report(title, subtitle, body) = {
  set document(title: title)
  set text(font: "Inter", size: 10.5pt, fill: ink)
  set page(
    paper: "a4",
    margin: (top: 2.6cm, bottom: 2.2cm, x: 2cm),
    header: context {
      if counter(page).get().first() > 1 {
        set text(size: 8pt, fill: muted, font: "Inter")
        grid(
          columns: (1fr, 1fr),
          [Nimbus Analytics — R&D],
          align(right)[#title],
        )
        v(-6pt)
        line(length: 100%, stroke: 0.6pt + accent)
      }
    },
    footer: context {
      if counter(page).get().first() > 1 {
        set text(size: 8pt, fill: muted, font: "Inter")
        align(center)[Page #counter(page).display() of #counter(page).final().first()]
      }
    },
  )
  set heading(numbering: "1.1")
  show heading.where(level: 1): it => {
    set text(font: "Fraunces", size: 16pt, weight: "bold", fill: accent)
    v(14pt) + it + v(6pt)
  }

  // ---- Cover ----
  align(center + horizon)[
    #text(font: "Fraunces", size: 11pt, fill: accent, tracking: 2pt)[NIMBUS ANALYTICS · R&D]
    #v(6pt)
    #text(font: "Fraunces", size: 30pt, weight: "bold")[#title]
    #v(4pt)
    #text(size: 13pt, fill: muted)[#subtitle]
  ]
  pagebreak()

  outline(title: "Contents", indent: auto)
  pagebreak()

  body
}

#show: doc => report(
  "Query Engine Performance Report",
  "Vectorized Execution Pilot — Q2 2026",
  doc,
)

= Executive Summary

The vectorized execution pilot reduced median query latency by 34% across
the top 200 production query shapes, with the largest gains on aggregation-
heavy workloads (see @tbl-results). This was a controlled rollout to 12%
of production traffic over six weeks; full rollout is recommended pending
one more week of tail-latency monitoring.

#callout("Tail latency needs one more week", [
  P99 latency improved but is noisier than P50/P95 — largely one query
  shape (a wide join against the events table) that benefits less from
  vectorization. Recommend holding full rollout until that shape is
  profiled separately.
])

= Methodology

Query cost in the vectorized path is modeled as a function of batch size
$b$, column width $w$, and the SIMD lane count $l$ available on the
executing host:
$
  "cost"(b, w, l) = c_0 + c_1 dot ceil(b / l) dot w
$
where $c_0$ is fixed per-batch overhead and $c_1$ is the marginal per-lane
cost, both fit from the pilot's telemetry via ordinary least squares
(see @sec-appendix). This is a simplification — it doesn't model cache
effects — but it fit the observed data with $R^2 = 0.91$ across the
sampled query shapes, which was accurate enough to guide the rollout decision.#footnote[
  An earlier model that ignored column width entirely fit at $R^2 = 0.62$
  — width turned out to matter more than initial intuition suggested,
  which is the main reason this pilot took two extra weeks.
]

= Results

#figure(
  table(
    columns: (auto, auto, auto, auto),
    align: (left, right, right, right),
    stroke: (x, y) => if y == 0 { (bottom: 1pt + accent) } else { (bottom: 0.5pt + luma(220)) },
    fill: (x, y) => if y == 0 { accent-light } else { white },
    table.header([Query shape], [P50 (ms)], [P95 (ms)], [Improvement]),
    [Simple filter + scan], [12], [31], [-41%],
    [Aggregation (GROUP BY)], [84], [210], [-48%],
    [Join (2 tables)], [156], [402], [-29%],
    [Wide join (events table)], [340], [980], [-11%],
    [Window function], [95], [240], [-37%],
  ),
  caption: [Latency by query shape, vectorized vs. baseline],
) <tbl-results>

#v(8pt)
#text(size: 10.5pt, weight: "bold")[Median latency improvement by query shape]
#v(6pt)
#bar-chart((
  ("Filter", 41),
  ("Agg", 48),
  ("Join", 29),
  ("Wide join", 11),
  ("Window", 37),
), max-value: 50)

= Recommendation

Proceed to 50% traffic for two weeks, with the wide-join query shape
explicitly excluded from vectorized execution until it has its own
profiling pass. Full rollout decision at the following infra review.

#callout("Owner and timeline", [
  R. Okafor owns the wide-join profiling work, targeting results before
  the August infra review. Full rollout blocked on that finding, not on
  anything else in this report.
], color: rgb("#b45309"), bg: rgb("#fdf1e3"))

= Appendix: Model Fit Detail <sec-appendix>

Coefficients were fit via ordinary least squares against 4,200 sampled
query executions across the pilot's 12% traffic slice, stratified by query
shape to avoid over-weighting high-frequency simple scans. Full
coefficient table and residual plots are available in the internal
`query-perf-pilot` notebook, not reproduced here for length.
