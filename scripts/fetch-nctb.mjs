#!/usr/bin/env node
/**
 * NCTB textbook ingestion pipeline.
 *
 * The development sandbox cannot reach nctb.gov.bd (network egress is
 * blocked), so this script runs on a normal connection (Codespace, laptop):
 *
 *   1. `npm run fetch:nctb`
 *      - downloads every manifest entry that has a `pdfUrl` into
 *        content-sources/pdf/
 *      - extracts plain text from EVERY pdf found in content-sources/pdf/
 *        into content-sources/text/<name>.txt
 *
 *   2. Entries without a `pdfUrl` are listed with their portal hint —
 *      download those by hand (browser) into content-sources/pdf/ using the
 *      manifest id as the filename (e.g. bgs-5-en.pdf), then re-run the
 *      script to extract them.
 *
 *   3. Commit content-sources/text/ (the PDFs themselves stay untracked —
 *      they are large and NCTB already hosts them).
 *
 * The extracted text is the working copy the team reads to verify every
 * classroom topic against the official books, per the client's instruction.
 */

import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { nctbFetch } from "./nctb-http.mjs";

const root = new URL("..", import.meta.url).pathname;
const pdfDir = path.join(root, "content-sources", "pdf");
const textDir = path.join(root, "content-sources", "text");
const manifestPath = path.join(root, "content-sources", "manifest.json");

async function main() {
  await mkdir(pdfDir, { recursive: true });
  await mkdir(textDir, { recursive: true });

  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const missing = [];

  for (const book of manifest.books) {
    for (const version of book.versions) {
      const filename = `${version.file}.pdf`;
      const target = path.join(pdfDir, filename);
      const exists = await readFile(target).then(() => true).catch(() => false);
      if (exists) {
        console.log(`✓ already downloaded: ${filename}`);
        continue;
      }
      if (!version.pdfUrl) {
        missing.push({ book, version, filename });
        continue;
      }
      process.stdout.write(`↓ downloading ${filename} … `);
      try {
        const response = await nctbFetch(version.pdfUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const bytes = Buffer.from(await response.arrayBuffer());
        if (bytes.length < 10_000) throw new Error("response too small to be the textbook PDF");
        await writeFile(target, bytes);
        console.log(`${Math.round(bytes.length / 1024 / 1024)} MB`);
      } catch (error) {
        console.log(`FAILED (${error.message})`);
        missing.push({ book, version, filename });
      }
    }
  }

  // Extract text from every PDF present, however it arrived.
  let PDFParse;
  try {
    ({ PDFParse } = await import("pdf-parse"));
  } catch {
    console.error("\npdf-parse is not installed. Run: npm install --save-dev pdf-parse");
    process.exit(1);
  }

  const pdfs = (await readdir(pdfDir)).filter((name) => name.toLowerCase().endsWith(".pdf"));
  if (pdfs.length === 0) {
    console.log("\nNo PDFs in content-sources/pdf/ yet.");
  }
  for (const name of pdfs) {
    const outName = `${name.replace(/\.pdf$/i, "")}.txt`;
    const outPath = path.join(textDir, outName);
    const already = await readFile(outPath).then(() => true).catch(() => false);
    if (already) {
      console.log(`✓ already extracted: ${outName}`);
      continue;
    }
    process.stdout.write(`⇢ extracting ${name} … `);
    try {
      const parser = new PDFParse({ data: new Uint8Array(await readFile(path.join(pdfDir, name))) });
      const result = await parser.getText();
      await parser.destroy();
      const text = result.text.replace(/\r/g, "").replace(/\n{3,}/g, "\n\n").trim();
      const pageCount = result.total ?? result.pages?.length ?? "?";
      const header = `# Extracted from ${name} — ${pageCount} pages\n# Source: NCTB (nctb.gov.bd). For content verification only; not for republication.\n\n`;
      await writeFile(outPath, header + text, "utf8");
      console.log(`${pageCount} pages → content-sources/text/${outName}`);
      if (text.replace(/\s/g, "").length < 500) {
        console.log(`  ⚠ ${name}: almost no selectable text — likely a scanned/legacy-font PDF; needs OCR or the English version.`);
      }
    } catch (error) {
      console.log(`FAILED (${error.message})`);
    }
  }

  if (missing.length > 0) {
    console.log("\nStill needed — download these by hand from the NCTB portal, save into content-sources/pdf/ with the exact filename, then re-run:");
    for (const item of missing) {
      console.log(`  • ${item.filename}  (${item.book.titleEn} — ${item.version.label})`);
      console.log(`    where: ${item.version.portalHint || manifest.portal}`);
    }
  }

  console.log("\nWhen extraction looks good: git add content-sources/text && commit. The PDFs stay untracked.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
