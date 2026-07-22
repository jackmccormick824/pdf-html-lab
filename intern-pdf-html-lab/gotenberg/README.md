# Gotenberg — Docker-based HTML/Office-to-PDF microservice

**Category:** JS/language-agnostic HTML-to-PDF (service) · **From starter list:** yes
**License:** MIT · **Status in this lab: not built — Docker is unavailable in this environment.**

## What it is

Gotenberg is a small API server (runs as a Docker container) that wraps
Chromium (for HTML-to-PDF, same underlying engine as Puppeteer/Playwright),
LibreOffice (for Office document conversion — .docx/.xlsx/.pptx to PDF),
and PDFtk-style tools (merge, etc.) behind one HTTP API. You `POST` HTML
or a URL to an endpoint and get a PDF back — completely language-agnostic
(curl, Python, Node, Ruby, anything that can make an HTTP request can use it).

## Why it's not built here

This lab's environment doesn't have Docker installed (`docker: command not
found`), and Gotenberg is only distributed as a container image — there's
no standalone binary or pip/npm package. Installing Docker Desktop wasn't
in scope for a research lab meant to run with lightweight, easily
reproducible dependencies (every other example here needs at most a
Homebrew package or a language package manager).

## How you'd actually use it

```bash
docker run --rm -p 3000:3000 gotenberg/gotenberg:8

curl --request POST 'http://localhost:3000/forms/chromium/convert/html' \
  --form 'files=@index.html' \
  -o output.pdf
```

Because the conversion happens in an isolated container, Gotenberg is a
strong choice when you want the Puppeteer/Playwright rendering quality
(real Chromium) but don't want a browser binary living inside your
application's own process/container — useful in a microservices
architecture, or from a language with no good native headless-browser
library. It's also one of the few free tools here that converts actual
Office documents (not just HTML) to PDF, via its bundled LibreOffice.

## Best for

Teams already comfortable running Docker in production who want a single
shared PDF-rendering service multiple applications/languages can call,
rather than every service embedding its own Puppeteer/Playwright/WeasyPrint
dependency. Also the most practical free option here for converting
uploaded Office files to PDF.

## Limitations

- Requires running and operating a container (or using a hosted version) —
  meaningfully more infrastructure than any library in this lab.
- Adds network-call latency/failure modes (timeouts, service being down)
  that an in-process library doesn't have.
