#!/usr/bin/env node
/**
 * NCTB textbook-PDF crawler/annotator — run on a normal network:
 *
 *   npm run crawl:nctb                # discover (or re-annotate) the catalog
 *   npm run crawl:nctb -- --download  # …and download the relevant books
 *   npm run crawl:nctb -- --fresh     # force a full re-crawl from scratch
 *
 * Two modes, picked automatically:
 *   1. FULL CRAWL (no catalog yet, or --fresh): breadth-first sweep of
 *      nctb.gov.bd with textbook-flavoured links prioritised.
 *   2. ANNOTATE (content-sources/discovered-pdfs.json already has entries):
 *      re-fetches only the ~50 portal pages the files were found on, pairs
 *      every download link with its book-title table cell and the page
 *      title (class), and updates the catalog in place. Much smaller attack
 *      surface against the origin server's flaky minutes — and the books
 *      themselves download from Google Drive, which is dependable.
 *
 * The portal's tables put the book name in a sibling cell, not the link
 * (anchors just say "ডাউনলোড লিংক-১"), so rows are parsed the way a human
 * reads them. Google Drive's large-file confirm page is followed, and every
 * download is verified to start with %PDF before it is kept.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { nctbFetch, USER_AGENT } from "./nctb-http.mjs";

const root = new URL("..", import.meta.url).pathname;
const outDir = path.join(root, "content-sources");
const pdfDir = path.join(outDir, "pdf");
const reportPath = path.join(outDir, "discovered-pdfs.json");

const SEEDS = ["https://nctb.gov.bd/"];
const ALLOWED_HOSTS = new Set(["nctb.gov.bd", "www.nctb.gov.bd", "nctb.portal.gov.bd"]);
const MAX_PAGES = 400;
const MAX_DEPTH = 6;
const DELAY_MS = 300;
const MAX_DOWNLOADS = 80;
void USER_AGENT; // set in nctb-http.mjs, shared by every request

// Subjects this platform draws on — used to decide which files --download grabs.
const RELEVANT = /(বিশ্বপরিচয়|ইতিহাস|চারুপাঠ|সপ্তবর্ণা|সাহিত্য|আনন্দপাঠ|আমার\s*বাংলা|আমার\s*বই|চারু\s*ও\s*কারুকলা|নৃগোষ্ঠ|ভূগোল|সহপাঠ|বাংলা\s*ব্যাকরণ|global\s*studies|history|geograph|arts?\s*and\s*crafts|sahitto|shahitto|charupat)/i;

// Textbook-flavoured pages get crawled first so the page budget is spent on
// the book listings, not the news archive.
const PRIORITY = /(পাঠ্যপুস্তক|পুস্তক|পাঠ্যবই|বই|শ্রেণি|প্রাথমিক|মাধ্যমিক|প্রাক|textbook|pustak|book|class|primary|secondary|pre-?primary|higher|download|ডাউনলোড|202[5-6]|১ম|২য়|৩য়|৪র্থ|৫ম|৬ষ্ঠ|৭ম|৮ম|৯ম|১০ম|একাদশ|দ্বাদশ)/i;

const shouldDownload = process.argv.includes("--download");
const forceFresh = process.argv.includes("--fresh");

// pdfs: url -> { text, rowTitle, pageTitle, foundOn, kind }
const pdfs = new Map();

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

function normalize(url, base) {
  try {
    const resolved = new URL(url, base);
    resolved.hash = "";
    return resolved.href;
  } catch {
    return null;
  }
}

function scoreLink(href, text) {
  const haystack = `${decodeSafe(href)} ${text}`;
  let score = 0;
  if (PRIORITY.test(haystack)) score += 2;
  if (/(পাঠ্যপুস্তক|textbook|পাঠ্যবই|pustak)/i.test(haystack)) score += 4;
  return score;
}

function slugify(text, url) {
  const base = (text || path.basename(new URL(url).pathname, ".pdf"))
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}._-]/gu, "")
    .slice(0, 90);
  return base || `nctb-${Math.abs([...url].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 0))}`;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function politeFetch(url, options) {
  await sleep(DELAY_MS);
  return nctbFetch(url, options);
}

function recordFile(href, text, rowTitle, pageTitle, foundOn) {
  let host;
  try {
    host = new URL(href).hostname;
  } catch {
    return false;
  }
  const put = (key, kind) => {
    const existing = pdfs.get(key);
    if (!existing) {
      pdfs.set(key, { text, rowTitle, pageTitle, foundOn, kind });
    } else if (!existing.rowTitle && rowTitle) {
      pdfs.set(key, { ...existing, rowTitle, pageTitle: pageTitle || existing.pageTitle });
    }
  };
  if (/\.(pdf|zip)(\?|$)/i.test(href) && /(^|\.)gov\.bd$/.test(host)) {
    put(href, /\.zip(\?|$)/i.test(href) ? "zip" : "pdf");
    return true;
  }
  const driveId = host === "drive.google.com" ? href.match(/(?:\/file\/d\/|[?&]id=)([\w-]{10,})/)?.[1] : null;
  if (driveId) {
    put(`https://drive.google.com/uc?export=download&id=${driveId}`, "drive");
    return true;
  }
  return false;
}

const anchorRe = /<a\b[^>]*href\s*=\s*["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi;

/** Extracts files (with row/page titles) and crawlable links from a page. */
function processHtml(html, url, { collectLinks } = { collectLinks: false }) {
  const pageTitle = cleanText(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "").slice(0, 120);
  const links = [];

  // Pass 1 — table rows: pair each download link with the row's book title.
  for (const rowMatch of html.matchAll(/<tr\b[\s\S]*?<\/tr>/gi)) {
    const row = rowMatch[0];
    const cells = [...row.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((cell) => cleanText(cell[1]));
    const rowTitle =
      cells.find((cell) => cell && cell.length > 2 && !/ডাউনলোড|download|লিংক|link|^\d+$|^[০-৯]+$/i.test(cell)) ?? "";
    for (const match of row.matchAll(anchorRe)) {
      const href = normalize(match[1], url);
      if (href) recordFile(href, cleanText(match[2]), rowTitle, pageTitle, url);
    }
  }

  // Pass 2 — every anchor: non-table downloads plus links to keep crawling.
  for (const match of html.matchAll(anchorRe)) {
    const href = normalize(match[1], url);
    if (!href) continue;
    const text = cleanText(match[2]).slice(0, 120);
    if (recordFile(href, text, "", pageTitle, url)) continue;
    if (!collectLinks) continue;
    let host;
    try {
      host = new URL(href).hostname;
    } catch {
      continue;
    }
    if (!ALLOWED_HOSTS.has(host)) continue;
    if (!/\.(jpe?g|png|gif|docx?|xlsx?|pptx?|zip|mp4)(\?|$)/i.test(href)) {
      links.push({ href, score: scoreLink(href, text) });
    }
  }
  return links;
}

async function fullCrawl() {
  const queue = SEEDS.map((url) => ({ url, depth: 0, score: 0 }));
  const seen = new Set(SEEDS);
  const visitedSample = [];
  let visited = 0;

  while (queue.length > 0 && visited < MAX_PAGES) {
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
      process.stdout.write(`\rcrawled ${visited} pages, found ${pdfs.size} files …`);
    } catch (error) {
      if (visited === 0) {
        console.error(`\nCannot reach ${url} (${error.cause?.message ?? error.message}).`);
        console.error("If you are in the cloud dev sandbox: its egress proxy blocks nctb.gov.bd — run this from a Codespace or your laptop instead.");
        process.exit(1);
      }
      continue;
    }

    for (const link of processHtml(html, url, { collectLinks: true })) {
      if (depth < MAX_DEPTH && !seen.has(link.href)) {
        seen.add(link.href);
        queue.push({ url: link.href, depth: depth + 1, score: link.score });
      }
    }
  }
  return { visited, visitedSample };
}

async function annotateExisting(existing) {
  // Seed the map with what we already know.
  for (const item of existing.pdfs) {
    pdfs.set(item.url, {
      text: item.linkText ?? "",
      rowTitle: item.bookTitle && item.bookTitle !== item.linkText ? item.bookTitle : "",
      pageTitle: item.pageTitle ?? "",
      foundOn: item.foundOn,
      kind: item.kind ?? "pdf",
    });
  }
  // Incremental: only pages that still have title-less files need fetching,
  // so successive runs accumulate annotations across the origin's bad spells.
  const needy = new Set(
    existing.pdfs.filter((item) => !item.bookTitle || /ডাউনলোড|download|লিংক|^$/i.test(item.bookTitle)).map((item) => item.foundOn),
  );
  const pages = [...needy];
  console.log(
    `Annotate mode: ${pdfs.size} known files; ${pages.length} portal pages still need book titles — re-reading those.`,
  );
  if (pages.length === 0) {
    console.log("Catalog fully annotated already.");
    return { visited: 0, visitedSample: [] };
  }
  let done = 0;
  let failed = 0;
  for (const page of pages) {
    try {
      const response = await politeFetch(page, { attempts: 6 });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      processHtml(await response.text(), page);
      done += 1;
    } catch {
      failed += 1;
    }
    process.stdout.write(`\rannotated ${done}/${pages.length} pages (${failed} unreachable) …`);
  }
  if (done === 0) {
    console.error("\nNo portal page answered this run — keeping the existing catalog; try again later.");
  }
  return { visited: done, visitedSample: pages.slice(0, 150) };
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

async function main() {
  await mkdir(outDir, { recursive: true });
  const existing = forceFresh ? null : await readFile(reportPath, "utf8").then(JSON.parse).catch(() => null);
  const stats = existing?.pdfs?.length ? await annotateExisting(existing) : await fullCrawl();

  const report = {
    crawledAt: new Date().toISOString(),
    pagesVisited: stats.visited,
    pdfCount: pdfs.size,
    pdfs: [...pdfs.entries()]
      .map(([url, meta]) => ({
        url,
        bookTitle: meta.rowTitle || meta.text,
        linkText: meta.text,
        pageTitle: meta.pageTitle ?? "",
        foundOn: meta.foundOn,
        kind: meta.kind ?? "pdf",
        relevant: RELEVANT.test(
          `${decodeSafe(meta.rowTitle ?? "")} ${decodeSafe(meta.text)} ${decodeSafe(meta.pageTitle ?? "")} ${decodeSafe(url)}`,
        ),
      }))
      .sort((a, b) => Number(b.relevant) - Number(a.relevant) || a.url.localeCompare(b.url)),
    visitedSample: stats.visitedSample,
  };
  await writeFile(reportPath, JSON.stringify(report, null, 2) + "\n", "utf8");
  const relevant = report.pdfs.filter((item) => item.relevant);
  console.log(`\n\n${report.pdfCount} files in the catalog (${relevant.length} relevant).`);
  console.log("Report: content-sources/discovered-pdfs.json — commit it.");

  if (shouldDownload && relevant.length > 0) {
    await mkdir(pdfDir, { recursive: true });
    const batch = relevant.slice(0, MAX_DOWNLOADS);
    if (relevant.length > batch.length) {
      console.log(`\n(only the first ${MAX_DOWNLOADS} of ${relevant.length} relevant files this run — re-run for the rest)`);
    }
    console.log(`\nDownloading ${batch.length} relevant files …`);
    for (const item of batch) {
      const label = [item.bookTitle, item.pageTitle.split("|")[0]].filter(Boolean).join("-");
      const filename = `${slugify(label, item.url)}.${item.kind === "zip" ? "zip" : "pdf"}`;
      const target = path.join(pdfDir, filename);
      const already = await readFile(target).then(() => true).catch(() => false);
      if (already) {
        console.log(`  ✓ already have ${filename}`);
        continue;
      }
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

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
