import assert from "node:assert/strict";
import test from "node:test";

const {
  nctbAssessmentFramework,
  nctbAuditSummary,
  nctbCommunityDiscovery,
  nctbConditionalTeenResources,
  nctbCoreBooks,
  nctbCoreStats,
  nctbEducatorDocuments,
  nctbPrePrimaryResources,
  nctbTeacherGuideCollections,
} = await import("../app/nctb-books.ts");
const {
  class5BanglaContents,
  lessonSourceBridges,
  nctbPdfAuditFindings,
  nctbTeenSubjectOutlines,
} = await import("../app/nctb-content.ts");
const { lessons } = await import("../app/curriculum.ts");

test("core NCTB shelf represents eight titles and eleven PDF versions", () => {
  assert.equal(nctbCoreBooks.length, 8);
  assert.equal(nctbCoreStats.titles, 8);
  assert.equal(nctbCoreStats.pdfVariants, 11);
  assert.equal(nctbCoreStats.uniqueContentPages, 956);
  assert.equal(nctbCoreStats.variantPages, 1362);
  assert.equal(new Set(nctbCoreBooks.map((book) => book.id)).size, nctbCoreBooks.length);
});

test("Bangladesh and Global Studies titles pair Bangla and English versions", () => {
  const bgs = nctbCoreBooks.filter((book) => book.subject === "bangladesh-and-global-studies");
  assert.equal(bgs.length, 3);
  for (const book of bgs) {
    assert.deepEqual(new Set(book.variants.map((variant) => variant.language)), new Set(["bn", "en"]));
    assert.equal(book.variants[0].pages, book.variants[1].pages);
  }
});

test("Class 5 Bangla contents are complete, ordered and page-addressable", () => {
  assert.equal(class5BanglaContents.length, 23);
  assert.deepEqual(class5BanglaContents.map((entry) => entry.number), Array.from({ length: 23 }, (_, index) => index + 1));
  assert.ok(class5BanglaContents.every((entry, index, list) => index === 0 || entry.page > list[index - 1].page));
  assert.equal(class5BanglaContents.at(0).titleBn, "বৈচিত্র্যময় বাংলাদেশ");
  assert.equal(class5BanglaContents.at(-1).titleBn, "পোস্টার লিখি, প্ল্যাকার্ড লিখি");
  assert.equal(class5BanglaContents.at(-1).page, 130);
});

test("pre-primary collection accounts for three PDFs and ten archived PDFs", () => {
  assert.equal(nctbPrePrimaryResources.length, 4);
  const directPdfs = nctbPrePrimaryResources.filter((item) => item.format === "pdf").length;
  const archivedPdfs = nctbPrePrimaryResources.reduce((sum, item) => sum + (item.containedPdfCount ?? 0), 0);
  assert.equal(directPdfs + archivedPdfs, 13);
  assert.equal(nctbPrePrimaryResources.reduce((sum, item) => sum + item.pages, 0), 558);
});

test("educator sources cover bilingual curricula and all five guide grades", () => {
  assert.equal(nctbEducatorDocuments.length, 4);
  assert.deepEqual(new Set(nctbEducatorDocuments.map((document) => document.language)), new Set(["bn", "en"]));
  assert.deepEqual(nctbTeacherGuideCollections.map((collection) => collection.grade), [1, 2, 3, 4, 5]);
  for (const row of nctbAssessmentFramework) {
    assert.equal(row.continuous + row.summative, 100);
  }
});

test("lesson source bridges refer only to existing lessons and source records", () => {
  const lessonIds = new Set(lessons.map((lesson) => lesson.id));
  const sourceIds = new Set([
    ...nctbCoreBooks.map((book) => book.id),
    ...nctbPrePrimaryResources.map((book) => book.id),
  ]);
  for (const bridge of lessonSourceBridges) {
    assert.ok(lessonIds.has(bridge.lessonId), `unknown lesson ${bridge.lessonId}`);
    assert.equal(bridge.approvalStatus, "pending-educator-review");
    for (const sourceId of bridge.sourceIds) {
      assert.ok(sourceIds.has(sourceId), `${bridge.lessonId}: unknown source ${sourceId}`);
    }
  }
});

test("teen and community records cannot be mistaken for approved core content", () => {
  assert.ok(nctbConditionalTeenResources.length >= 6);
  assert.ok(nctbConditionalTeenResources.every((item) => item.status === "conditional-teen-extension"));
  assert.ok(nctbTeenSubjectOutlines.every((item) => item.status === "conditional-teen-extension"));
  assert.equal(nctbCommunityDiscovery.length, 5);
  assert.ok(nctbCommunityDiscovery.every((item) => item.status === "community-governed-discovery"));
});

test("NCTB source links use HTTPS and audited official-host pathways", () => {
  const allowedHosts = new Set([
    "nctb.gov.bd",
    "drive.egovcloud.gov.bd",
    "drive.google.com",
    "objectstorage.ap-dcc-gazipur-1.oraclecloud15.com",
  ]);
  const urls = [
    ...nctbCoreBooks.flatMap((book) => [book.officialPage, ...book.variants.map((variant) => variant.url)]),
    ...nctbPrePrimaryResources.flatMap((item) => [item.officialPage, item.url]),
    ...nctbEducatorDocuments.flatMap((item) => [item.officialPage, item.url]),
    ...nctbTeacherGuideCollections.flatMap((item) => [item.officialPage, item.banglaGuide, item.socialStudiesGuide]),
    ...nctbConditionalTeenResources.flatMap((item) => [item.officialPage, item.url]),
    ...nctbCommunityDiscovery.flatMap((item) => [item.prePrimaryPage, item.primaryPage]),
  ];
  for (const value of urls) {
    const url = new URL(value);
    assert.equal(url.protocol, "https:", `non-HTTPS source ${value}`);
    assert.ok(allowedHosts.has(url.hostname), `unapproved host ${url.hostname}`);
  }
});

test("audit record preserves the scope and safety boundary", () => {
  assert.equal(nctbAuditSummary.officialPagesChecked, 25);
  assert.equal(nctbAuditSummary.uniqueDownloadEndpoints, 143);
  assert.equal(nctbAuditSummary.pdfEndpoints, 142);
  assert.equal(nctbAuditSummary.zipEndpoints, 1);
  assert.equal(nctbAuditSummary.activeContentFindings, 0);
  assert.ok(nctbPdfAuditFindings.some((finding) => finding.includes("accessible HTML")));
});
