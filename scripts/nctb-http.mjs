/**
 * Shared HTTP helper for the NCTB ingestion scripts.
 *
 * nctb.gov.bd serves an incomplete TLS certificate chain (the intermediate
 * certificate is missing), so Node's strict fetch fails with "unable to
 * verify the first certificate". Browsers tolerate this via AIA chasing;
 * Node does not. When — and only when — a request to one of the allowed
 * NCTB hosts fails with that specific chain error, we retry that host over
 * a raw HTTPS request with verification relaxed, and say so loudly.
 * Every other host and every other error keeps full verification.
 * Set STRICT_TLS=1 to forbid the fallback entirely.
 */

import https from "node:https";

export const USER_AGENT =
  "BanglaAdventures-TextbookIndexer/1.0 (student capstone; fetches freely distributed NCTB textbooks)";

const relaxedHosts = new Set();
const warned = new Set();

function isTlsChainError(error) {
  const code = error?.cause?.code ?? error?.code ?? "";
  const message = `${error?.cause?.message ?? ""} ${error?.message ?? ""}`;
  return (
    code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE" ||
    code === "UNABLE_TO_GET_ISSUER_CERT" ||
    code === "UNABLE_TO_GET_ISSUER_CERT_LOCALLY" ||
    /unable to verify the first certificate|unable to get( local)? issuer certificate/i.test(message)
  );
}

function rawGet(url, redirectsLeft = 5) {
  return new Promise((resolve, reject) => {
    const request = https.get(
      url,
      { headers: { "User-Agent": USER_AGENT }, rejectUnauthorized: false },
      (response) => {
        const { statusCode = 0, headers } = response;
        if (statusCode >= 301 && statusCode <= 308 && headers.location) {
          response.resume();
          if (redirectsLeft <= 0) return reject(new Error("too many redirects"));
          return resolve(rawGet(new URL(headers.location, url).href, redirectsLeft - 1));
        }
        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () => {
          resolve(
            new Response(Buffer.concat(chunks), {
              status: statusCode,
              headers: { "content-type": headers["content-type"] ?? "" },
            }),
          );
        });
        response.on("error", reject);
      },
    );
    request.on("error", reject);
  });
}

/** fetch() with a per-host, chain-error-only relaxed-TLS fallback. */
export async function nctbFetch(url) {
  const host = new URL(url).hostname;
  if (!relaxedHosts.has(host)) {
    try {
      return await fetch(url, { headers: { "User-Agent": USER_AGENT }, redirect: "follow" });
    } catch (error) {
      if (process.env.STRICT_TLS === "1" || !isTlsChainError(error)) throw error;
      relaxedHosts.add(host);
      if (!warned.has(host)) {
        warned.add(host);
        console.warn(
          `\n⚠ ${host} sends an incomplete TLS certificate chain (long-standing issue with this government server).` +
            ` Continuing with relaxed certificate verification for this host only. Set STRICT_TLS=1 to forbid this.`,
        );
      }
    }
  }
  return rawGet(url);
}
