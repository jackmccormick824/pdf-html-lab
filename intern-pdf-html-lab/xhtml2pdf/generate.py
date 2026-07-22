"""
xhtml2pdf (pisa): an older, simpler HTML-to-PDF converter built on top of
ReportLab. It understands CSS 2.1 plus a handful of CSS3 properties — no
flexbox, no CSS grid — so purchase_order.html deliberately uses
table/float-based layout, the way HTML email templates still do today.
Page numbers use xhtml2pdf's own `<pdf:pagenumber/>` / `<pdf:pagecount/>`
tags inside an `@frame` region, its equivalent of a repeating footer.
"""
import os
from xhtml2pdf import pisa

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(HERE, "sample-output")
os.makedirs(OUT_DIR, exist_ok=True)


def main():
    src_path = os.path.join(HERE, "purchase_order.html")
    out_path = os.path.join(OUT_DIR, "purchase-order.pdf")

    with open(src_path, encoding="utf-8") as f:
        html = f.read()

    with open(out_path, "wb") as f:
        result = pisa.CreatePDF(html, dest=f, path=HERE)

    if result.err:
        raise SystemExit(f"xhtml2pdf reported {result.err} error(s)")
    print(f"Wrote {out_path}")


if __name__ == "__main__":
    main()
