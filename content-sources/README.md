# Content sources — the NCTB textbooks

Per the client's direction, the platform's culture/history/literature content
must trace to the official NCTB textbooks (nctb.gov.bd). This folder is the
ingestion point for those books.

**Why this exists:** the cloud dev environment cannot reach nctb.gov.bd (its
network egress is restricted), so the download + text-extraction step runs on
a normal connection — your Codespace or laptop — and the extracted text gets
committed so content verification can happen anywhere.

## How to ingest the books (5 minutes in a Codespace)

```bash
npm install            # picks up the pdf-parse dev dependency
npm run fetch:nctb     # downloads what it can, extracts every PDF it finds
```

For books the script can't fetch automatically (NCTB moves its deep links
every year): open https://nctb.gov.bd/ → পাঠ্যপুস্তক → 2026 → class → book,
download the PDF in your browser, save it into `content-sources/pdf/` using
the filename listed by the script (e.g. `bgs-5-en.pdf`), and run
`npm run fetch:nctb` again — it extracts anything new it finds.

Then commit the extracted text:

```bash
git add content-sources/text && git commit -m "Add extracted NCTB textbook text for verification"
git push
```

## What the text is for (and not for)

- ✅ Verifying every classroom topic's facts against the official books
- ✅ Selecting which chapters/topics to adapt next (log choices in
  `docs/CLIENT_REQUIREMENTS_2026-08-10.md`)
- ✅ Confirming chapter maps shown on `/library`
- ❌ NOT for pasting into the app — platform text stays original and
  kid-adapted; only public-domain literature is reproduced verbatim (see
  `/poems`)

Notes:
- The PDFs themselves are `.gitignore`d (large, and NCTB already hosts them);
  only the extracted `text/` is committed.
- Some Bangla-version PDFs use legacy fonts or scans and extract garbage —
  the script warns when that happens. Prefer the English versions for
  machine-readable text; the Bangla originals are still the reading copy.
