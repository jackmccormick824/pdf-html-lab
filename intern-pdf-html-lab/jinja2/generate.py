"""Jinja2 templating -> WeasyPrint rendering.

The point of this example is the templating layer, not the PDF engine
(WeasyPrint is already covered in depth in ../weasyprint). Every other
example in this lab that produces HTML writes it by hand, once, with data
baked in. Here the HTML is generated: one base layout, one set of macros,
looped over N customers pulled from a Python data structure — the pattern
you'd actually use behind a FastAPI endpoint that renders a report per
request.
"""

import io
from datetime import date, datetime
from pathlib import Path

import matplotlib

matplotlib.use("svg")
import matplotlib.pyplot as plt
from jinja2 import Environment, FileSystemLoader, select_autoescape
from weasyprint import HTML

ROOT = Path(__file__).parent

CUSTOMERS = [
    {
        "name": "Bramwell & Osei Architects",
        "account_id": "AC-10412",
        "invoices": [
            {"id": "INV-3391", "issued": date(2026, 4, 2), "due": date(2026, 5, 2), "amount": 4200.00, "days_overdue": 81},
            {"id": "INV-3455", "issued": date(2026, 5, 18), "due": date(2026, 6, 17), "amount": 1875.50, "days_overdue": 35},
        ],
    },
    {
        "name": "Coastal Fulfillment Co.",
        "account_id": "AC-10488",
        "invoices": [
            {"id": "INV-3402", "issued": date(2026, 6, 1), "due": date(2026, 7, 1), "amount": 960.00, "days_overdue": 21},
            {"id": "INV-3488", "issued": date(2026, 7, 10), "due": date(2026, 8, 9), "amount": 2310.75, "days_overdue": 0},
        ],
    },
    {
        "name": "Nightingale Veterinary Group",
        "account_id": "AC-10531",
        "invoices": [
            {"id": "INV-3311", "issued": date(2026, 3, 14), "due": date(2026, 4, 13), "amount": 6740.00, "days_overdue": 100},
        ],
    },
    {
        "name": "Third Coast Roasters",
        "account_id": "AC-10577",
        "invoices": [
            {"id": "INV-3470", "issued": date(2026, 6, 20), "due": date(2026, 7, 20), "amount": 512.25, "days_overdue": 2},
            {"id": "INV-3501", "issued": date(2026, 7, 5), "due": date(2026, 8, 4), "amount": 1180.00, "days_overdue": 0},
            {"id": "INV-3388", "issued": date(2026, 4, 10), "due": date(2026, 5, 10), "amount": 2975.40, "days_overdue": 73},
        ],
    },
]


def usd(value):
    return f"${value:,.2f}"


def dateformat(value):
    return value.strftime("%b %-d, %Y")


def build_chart_svg(customers):
    """Portfolio-wide overdue balance by customer, as an inline SVG bar
    chart -- same matplotlib-to-SVG technique as ../weasyprint, so the
    chart stays crisp vector output rather than a rasterized PNG."""
    names = [c["name"].split(" ")[0] + " …" if len(c["name"]) > 18 else c["name"] for c in customers]
    totals = [sum(i["amount"] for i in c["invoices"] if i["days_overdue"] > 0) for c in customers]

    fig, ax = plt.subplots(figsize=(6.4, 2.4))
    bars = ax.barh(names, totals, color="#7c3aed")
    ax.bar_label(bars, labels=[usd(t) for t in totals], padding=4, fontsize=8)
    ax.set_xlabel("Overdue balance (USD)", fontsize=8)
    ax.tick_params(labelsize=8.5)
    ax.spines[["top", "right"]].set_visible(False)
    ax.invert_yaxis()
    fig.tight_layout()

    buf = io.StringIO()
    fig.savefig(buf, format="svg")
    plt.close(fig)
    return buf.getvalue()


def main():
    env = Environment(
        loader=FileSystemLoader(ROOT / "templates"),
        autoescape=select_autoescape(["html", "j2"]),
    )
    env.filters["usd"] = usd
    env.filters["dateformat"] = dateformat

    total_outstanding = sum(i["amount"] for c in CUSTOMERS for i in c["invoices"])
    total_invoice_count = sum(len(c["invoices"]) for c in CUSTOMERS)
    for c in CUSTOMERS:
        c["days_overdue_max"] = max((i["days_overdue"] for i in c["invoices"]), default=0)
    severely_overdue_count = sum(1 for c in CUSTOMERS if c["days_overdue_max"] > 60)

    template = env.get_template("report.html.j2")
    html_out = template.render(
        customers=CUSTOMERS,
        period="July 2026",
        generated_on=datetime.now(),
        total_outstanding=total_outstanding,
        total_invoice_count=total_invoice_count,
        severely_overdue_count=severely_overdue_count,
        chart_svg=build_chart_svg(CUSTOMERS),
    )

    rendered_path = ROOT / "rendered-report.html"
    rendered_path.write_text(html_out)
    print(f"Wrote {rendered_path} (Jinja2 output — plain HTML, viewable on its own)")

    pdf_path = ROOT / "sample-output" / "overdue-invoice-digest.pdf"
    pdf_path.parent.mkdir(exist_ok=True)
    HTML(filename=str(rendered_path)).write_pdf(str(pdf_path))
    print(f"Wrote {pdf_path}")


if __name__ == "__main__":
    main()
