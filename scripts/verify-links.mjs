#!/usr/bin/env node
/**
 * Check that every external resource link on /resources still resolves.
 * Run from a network with open web access — sandboxes that block general
 * outbound traffic will report status 0/403 for everything, which is a
 * network problem, not dead links.
 *
 *   npm run verify:links
 */
import { externalResources } from "../app/resources-content.ts";

async function check(url) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15_000);
    // GET, not HEAD: several course sites reject HEAD requests.
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; BanglaAdventuresLinkCheck/1.0)" },
    });
    clearTimeout(timer);
    return { url, status: response.status, ok: response.ok };
  } catch (error) {
    return { url, status: 0, ok: false, error: String(error?.message ?? error) };
  }
}

const results = await Promise.all(externalResources.map((resource) => check(resource.url)));
let failures = 0;
for (const result of results) {
  if (result.ok) {
    console.log(`OK   ${result.url}`);
  } else {
    failures += 1;
    console.log(`FAIL(${result.status}) ${result.url}${result.error ? `  (${result.error})` : ""}`);
  }
}
console.log(`\nSummary: ${results.length - failures}/${results.length} links resolve.`);
if (failures > 0 && results.every((r) => !r.ok && (r.status === 0 || r.status === 403))) {
  console.log("Every link failed with 0/403 — the network blocked outbound web here. Rerun elsewhere.");
}
process.exit(failures ? 1 : 0);
