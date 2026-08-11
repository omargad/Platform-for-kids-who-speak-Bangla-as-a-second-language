#!/usr/bin/env node
/**
 * NCTB textbook-PDF crawler — run it on a normal network (Codespace/laptop):
 *
 *   npm run crawl:nctb                # discover every PDF linked from nctb.gov.bd
 *   npm run crawl:nctb -- --download  # also download the culture/history/literature matches
 *
 * What it does (equivalent of a requests + BeautifulSoup crawl, in Node):
 *   - breadth-first crawl of nctb.gov.bd (and its asset host nctb.portal.gov.bd),
 *     same-domain only, bounded depth/pages, 500 ms politeness delay
 *   - collects every <a href="*.pdf"> with its link text and the page it was on
 *   - writes content-sources/discovered-pdfs.json (commit this — it is the
 *     evidence of what the portal offers this year)
 *   - with --download: fetches PDFs whose name/link matches the subjects this
 *     platform uses into content-sources/pdf/, ready for `npm run fetch:nctb`
 *     to extract text
 *
 * Notes:
 *   - The cloud dev sandbox cannot run this (its egress proxy blocks the
 *     domain); the script detects that and says so.
 *   - This crawls a public government site that distributes these textbooks
 *     free of charge, at low rate, identifying itself via User-Agent.
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { nctbFetch, USER_AGENT } from "./nctb-http.mjs";

const root = new URL("..", import.meta.url).pathname;
const outDir = path.join(root, "content-sources");
const pdfDir = path.join(outDir, "pdf");

const SEEDS = ["https://nctb.gov.bd/"];
const ALLOWED_HOSTS = new Set(["nctb.gov.bd", "www.nctb.gov.bd", "nctb.portal.gov.bd"]);
const MAX_PAGES = 400;
const MAX_DEPTH = 6;
const DELAY_MS = 300;
void USER_AGENT; // set in nctb-http.mjs, shared by every request

// Textbook-flavoured pages get crawled first so the page budget is spent on
// the book listings, not the news archive.
const PRIORITY = /(পাঠ্যপুস্তক|পুস্তক|পাঠ্যবই|বই|শ্রেণি|প্রাথমিক|মাধ্যমিক|প্রাক|textbook|pustak|book|class|primary|secondary|pre-?primary|higher|download|ডাউনলোড|202[5-6]|১ম|২য়|৩য়|৪র্থ|৫ম|৬ষ্ঠ|৭ম|৮ম|৯ম|১০ম|একাদশ|দ্বাদশ)/i;

function scoreLink(href, text) {
  let decoded = href;
  try {
    decoded = decodeURIComponent(href);
  } catch {
    // keep raw
  }
  const haystack = `${decoded} ${text}`;
  let score = 0;
  if (PRIORITY.test(haystack)) score += 2;
  if (/(পাঠ্যপুস্তক|textbook|পাঠ্যবই|pustak)/i.test(haystack)) score += 4;
  return score;
}

// Subjects this platform draws on — used to decide which PDFs --download grabs.
const RELEVANT = /(বিশ্বপরিচয়|ইতিহাস|চারুপাঠ|সপ্তবর্ণা|সাহিত্য|আনন্দপাঠ|আমার\s*বাংলা|আমার\s*বই|চারু\s*ও\s*কারুকলা|নৃগোষ্ঠ|ভূগোল|সহপাঠ|global\s*studies|history|geograph|arts?\s*and\s*crafts|sahitto|shahitto|charupat)/i;

const shouldDownload = process.argv.includes("--download");

function normalize(url, base) {
  try {
    const resolved = new URL(url, base);
    resolved.hash = "";
    return resolved.href;
  } catch {
    return null;
  }
}

function decodeSafe(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function cleanText(fragment) {
  return fragment
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(text, url) {
  const base = (text || path.basename(new URL(url).pathname, ".pdf"))
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}._-]/gu, "")
    .slice(0, 80);
  return base || `nctb-${Math.abs([...url].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 0))}`;
}

async function politeFetch(url) {
  await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
  return nctbFetch(url);
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const queue = SEEDS.map((url) => ({ url, depth: 0 }));
  const seen = new Set(SEEDS);
  const pdfs = new Map(); // url -> { text, foundOn }
  let visited = 0;

  const visitedSample = [];

  while (queue.length > 0 && visited < MAX_PAGES) {
    // Highest-scoring link first (priority queue over textbook-ish URLs).
    queue.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    const { url, depth } = queue.shift();
    let html;
    try {
      const response = await politeFetch(url);
      if (depth === 0 && visited === 0 && !response.ok) {
        console.error(`\n${url} answered HTTP ${response.status} — the portal is unreachable from this network.`);
        console.error("If you are in the cloud dev sandbox: its egress proxy blocks nctb.gov.bd — run this from a Codespace or your laptop instead.");
        process.exit(1);
      }
      const type = response.headers.get("content-type") ?? "";
      if (!response.ok || !type.includes("text/html")) continue;
      html = await response.text();
      visited += 1;
      if (visitedSample.length < 150) visitedSample.push(url);
      process.stdout.write(`\rcrawled ${visited} pages, found ${pdfs.size} PDFs …`);
    } catch (error) {
      if (visited === 0) {
        console.error(`\nCannot reach ${url} (${error.cause?.message ?? error.message}).`);
        console.error("If you are in the cloud dev sandbox: its egress proxy blocks nctb.gov.bd — run this from a Codespace or your laptop instead.");
        process.exit(1);
      }
      continue;
    }

    const pageTitle = cleanText(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "").slice(0, 120);

    const recordFile = (href, text, rowTitle) => {
      let host;
      try {
        host = new URL(href).hostname;
      } catch {
        return false;
      }
      // Book files live on gov.bd sister portals or (mostly) Google Drive —
      // the portal's tables put the book name in a sibling cell, not the link.
      if (/\.(pdf|zip)(\?|$)/i.test(href) && /(^|\.)gov\.bd$/.test(host)) {
        const kind = /\.zip(\?|$)/i.test(href) ? "zip" : "pdf";
        const existing = pdfs.get(href);
        if (!existing || (!existing.rowTitle && rowTitle)) pdfs.set(href, { text, rowTitle, pageTitle, foundOn: url, kind });
        return true;
      }
      const driveId = host === "drive.google.com" ? href.match(/(?:\/file\/d\/|[?&]id=)([\w-]{10,})/)?.[1] : null;
      if (driveId) {
        const direct = `https://drive.google.com/uc?export=download&id=${driveId}`;
        const existing = pdfs.get(direct);
        if (!existing || (!existing.rowTitle && rowTitle)) pdfs.set(direct, { text, rowTitle, pageTitle, foundOn: url, kind: "drive" });
        return true;
      }
      return false;
    };

    const anchorRe = /<a\b[^>]*href\s*=\s*["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi;

    // Pass 1 — table rows: pair each download link with the row's book title,
    // the way a human reads the portal's book tables.
    for (const rowMatch of html.matchAll(/<tr\b[\s\S]*?<\/tr>/gi)) {
      const row = rowMatch[0];
      const cells = [...row.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((cell) => cleanText(cell[1]));
      const rowTitle =
        cells.find((cell) => cell && cell.length > 2 && !/ডাউনলোড|download|লিংক|link|^\d+$|^[০-৯]+$/i.test(cell)) ?? "";
      for (const match of row.matchAll(anchorRe)) {
        const href = normalize(match[1], url);
        if (href) recordFile(href, cleanText(match[2]), rowTitle);
      }
    }

    // Pass 2 — every anchor: catches non-table downloads and feeds the crawl.
    for (const match of html.matchAll(anchorRe)) {
      const href = normalize(match[1], url);
      if (!href) continue;
      const text = cleanText(match[2]).slice(0, 120);
      if (recordFile(href, text, "")) continue;

      let host;
      try {
        host = new URL(href).hostname;
      } catch {
        continue;
      }
      // Only NCTB's own hosts are crawled for further pages.
      if (!ALLOWED_HOSTS.has(host)) continue;
      if (depth < MAX_DEPTH && !seen.has(href) && !/\.(jpe?g|png|gif|docx?|xlsx?|pptx?|zip|mp4)(\?|$)/i.test(href)) {
        seen.add(href);
        queue.push({ url: href, depth: depth + 1, score: scoreLink(href, text) });
      }
    }
  }

  const report = {
    crawledAt: new Date().toISOString(),
    pagesVisited: visited,
    pdfCount: pdfs.size,
    pdfs: [...pdfs.entries()]
      .map(([url, meta]) => ({
        url,
        bookTitle: meta.rowTitle || meta.text,
        linkText: meta.text,
        pageTitle: meta.pageTitle ?? "",
        foundOn: meta.foundOn,
        kind: meta.kind ?? "pdf",
        relevant: RELEVANT.test(`${decodeSafe(meta.rowTitle ?? "")} ${decodeSafe(meta.text)} ${decodeSafe(meta.pageTitle ?? "")} ${decodeSafe(url)}`),
      }))
      .sort((a, b) => Number(b.relevant) - Number(a.relevant) || a.url.localeCompare(b.url)),
    // Diagnostic: which pages the budget was actually spent on.
    visitedSample,
  };
  const reportPath = path.join(outDir, "discovered-pdfs.json");
  await writeFile(reportPath, JSON.stringify(report, null, 2) + "\n", "utf8");
  const relevant = report.pdfs.filter((item) => item.relevant);
  console.log(`\n\n${report.pdfCount} PDFs discovered across ${visited} pages (${relevant.length} look relevant).`);
  console.log(`Report: content-sources/discovered-pdfs.json — commit it.`);

  if (shouldDownload && relevant.length > 0) {
    await mkdir(pdfDir, { recursive: true });
    // Cap the batch so a single run stays polite and inside runner limits.
    const MAX_DOWNLOADS = 80;
    const batch = relevant.slice(0, MAX_DOWNLOADS);
    if (relevant.length > batch.length) {
      console.log(`\n(only the first ${MAX_DOWNLOADS} of ${relevant.length} relevant files this run — re-run for the rest)`);
    }
    console.log(`\nDownloading ${batch.length} relevant files …`);
    for (const item of batch) {
      const label = [item.bookTitle, item.pageTitle.split("|")[0]].filter(Boolean).join("-");
      const filename = `${slugify(label, item.url)}.${item.kind === "zip" ? "zip" : "pdf"}`;
      const target = path.join(pdfDir, filename);
      process.stdout.write(`  ↓ ${filename} … `);
      try {
        let bytes = await downloadBytes(item.url);
        // Google Drive interposes an HTML confirm page for big files.
        if (looksLikeHtml(bytes) && item.url.includes("drive.google.com")) {
          const id = item.url.match(/[?&]id=([\w-]+)/)?.[1];
          bytes = await downloadBytes(`https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`);
        }
        if (item.kind !== "zip" && !bytes.subarray(0, 5).toString("latin1").startsWith("%PDF")) {
          throw new Error("response is not a PDF (login page or quota notice?)");
        }
        await writeFile(target, bytes);
        console.log(`${(bytes.length / 1024 / 1024).toFixed(1)} MB`);
      } catch (error) {
        console.log(`FAILED (${error.message})`);
      }
    }
    console.log("\nNow run: npm run fetch:nctb   (extracts text from everything in content-sources/pdf/)");
  } else if (!shouldDownload) {
    console.log("Re-run with --download to fetch the relevant ones into content-sources/pdf/.");
  }
}

function looksLikeHtml(bytes) {
  const head = bytes.subarray(0, 200).toString("latin1").trimStart().toLowerCase();
  return head.startsWith("<!doctype") || head.startsWith("<html") || head.startsWith("<");
}

async function downloadBytes(url) {
  const response = await politeFetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
