# NCTB source-content audit

Audit date: 11 August 2026  
Implementation surface: `/books`, `app/nctb-books.ts`, `app/nctb-content.ts`  
Publication state: source records are verified; learner adaptations remain gated

## Outcome

The application now has a traceable NCTB Book Bridge rather than an unlabelled list of PDF links. It distinguishes:

1. eight current Class 1–5 source titles for the 6–12 pathway;
2. eleven PDF variants, pairing Bangla and English versions of Bangladesh and Global Studies;
3. a separate pre-primary collection;
4. educator-only curricula and teacher guides;
5. a conditional Class 6–10 extension; and
6. community-governed discovery records for five small ethnic-group languages.

The bridge records source title, grade, subject, official catalogue page, direct download, language, page count, proposed use and approval status. It does not reproduce textbook prose, poems, illustrations or exercise banks.

## Audit method

The review was a read-only audit of public NCTB pages and their public download targets.

- Python `requests` retrieved public page markup and checked discovered endpoints.
- BeautifulSoup extracted and normalised links from 25 official NCTB pages.
- File signatures and response metadata distinguished PDFs from the ZIP archive.
- PDF metadata, encryption flags, catalogue objects, actions, attachments, form dictionaries, page counts and text-layer availability were inspected with PDF tooling.
- Representative pages were rendered with Poppler so visual-only books were not mistaken for empty files.
- The pre-primary ZIP central directory was inspected and its ten contained PDFs were counted and reviewed separately.

No authentication bypass, form submission, high-rate scanning or modification of the government site was performed. A browser automation or OSINT graph framework was not necessary for the public, server-rendered catalogue flow and would not make the educational or copyright review more authoritative.

## Coverage and technical findings

| Measure | Result |
|---|---:|
| Official NCTB pages checked | 25 |
| Unique download endpoints discovered | 143 |
| PDF endpoints | 142 |
| ZIP endpoints | 1 |
| Representative PDFs deeply inspected | 26 |
| Encrypted representative PDFs | 0 |
| JavaScript, launch-action, embedded-file or rich-media findings | 0 |
| Primary curriculum form fields/widgets | 0 |

All 143 endpoints returned successfully during the audit. The 26-file deep sample covered primary Bangla, Bangladesh and Global Studies, pre-primary books, the story archive, revised curricula and secondary extension candidates. This is not a claim that every sentence in all 142 PDFs has received professional educational approval.

Most learner PDFs are image- or vector-heavy. Their reading order, searchability and screen-reader experience are insufficient for use as the platform’s main lesson interface. The implementation therefore links the official file for provenance but requires original accessible HTML, short exact citations, alt text or descriptions, and reviewed human audio for the child experience.

The 1,097-page primary curriculum exposed an empty `/AcroForm` dictionary. There were no fields or widgets, so this was not treated as an interactive form or active-content finding.

## Current Class 1–5 source shelf

The shelf contains eight titles and eleven verified PDF variants. Unique book content totals 956 pages; counting both Bangla and English BGS files gives 1,362 PDF-variant pages.

| Class | Title | Contents | Version(s) | Pages per version | Official NCTB page |
|---:|---|---:|---|---:|---|
| 1 | আমার বাংলা বই | 54 | Bangla | 90 | <https://nctb.gov.bd/pages/static-pages/695b9adec4774958d7b708cd> |
| 2 | আমার বাংলা বই | 29 | Bangla | 74 | <https://nctb.gov.bd/pages/static-pages/695b9935c4774958d7b70508> |
| 3 | আমার বাংলা বই | 30 | Bangla | 110 | <https://nctb.gov.bd/pages/static-pages/695b9980c4774958d7b70591> |
| 3 | বাংলাদেশ ও বিশ্বপরিচয় | 13 | Bangla, English | 118 | <https://nctb.gov.bd/pages/static-pages/695b9980c4774958d7b70591> |
| 4 | আমার বাংলা বই | 23 | Bangla | 134 | <https://nctb.gov.bd/pages/static-pages/695b99ccc4774958d7b70680> |
| 4 | বাংলাদেশ ও বিশ্বপরিচয় | 15 | Bangla, English | 122 | <https://nctb.gov.bd/pages/static-pages/695b99ccc4774958d7b70680> |
| 5 | আমার বাংলা বই | 23 | Bangla | 142 | <https://nctb.gov.bd/pages/static-pages/695b9a68c4774958d7b707a5> |
| 5 | বাংলাদেশ ও বিশ্বপরিচয় | 17 | Bangla, English | 166 | <https://nctb.gov.bd/pages/static-pages/695b9a68c4774958d7b707a5> |

The Class 5 Bangla reader’s 23 titles and starting pages are transcribed in `app/nctb-content.ts` and rendered on `/books`. This is enough to cite an adaptation precisely without copying the source work.

## Pre-primary collection

Official page: <https://nctb.gov.bd/pages/static-pages/695b9a96c4774958d7b70809>

| Resource | Age | Format | Pages | Implementation decision |
|---|---:|---|---:|---|
| আমার বই | 5+ | PDF | 174 | Separate play/readiness pathway; 13 curriculum areas require activity-level review. |
| এসো লিখতে শিখি | 5+ | PDF | 138 | Candidate for motor and first-mark activities, not an oral-language substitute. |
| এসো আঁকিবুঁকি করি | 4+ | PDF | 70 | Candidate visual-motor source pending child and accessibility testing. |
| Illustrated story archive | 4+ | ZIP containing 10 PDFs | 176 | Create HTML transcripts, descriptions and human audio before use. |

The story archive contains `Amader Bari`, `Amra Apno Jon`, `Guchie Rakhi`, `Lal Pokar Golpo`, `Shabbash Shabdhani`, `Chutto Pakhi`, `Jhorer Pore`, `Oishir Ful`, `Putu Gutu` and `Schooler Prothom Din`. These names are archive identifiers, not approved English translations.

## Educator evidence

The revised curriculum page is <https://nctb.gov.bd/pages/static-pages/6922dd0b933eb65569e13492>. It links the Bangla and English pre-primary curriculum and the revised National Curriculum 2021 for the primary level.

The primary curriculum provides detailed Bangla and Social Science competencies, outcomes, active or experiential learning suggestions and assessment tools for Classes 1–5. The assessment proportions recorded in the Book Bridge are:

- Classes 1–2, textbook-and-guide subjects: 50% continuous and 50% summative;
- Classes 3–5, textbook-and-guide subjects: 30% continuous and 70% summative; and
- teacher-guide-only subjects: 100% continuous.

These percentages describe the NCTB framework. They do not validate the platform’s placement score or require the diaspora app to imitate a school examination.

The 2026 teacher-guide index is <https://nctb.gov.bd/pages/static-pages/primary-and-secondary-level-teachers-guide-list-for-the-academic-year-2026-c7wlhh-69afb72b7ce407d4d4fdd16e>. The Book Bridge includes the official Class 1–5 collection pages and separate Bangla and social-studies guide links. Guides remain adult-facing and behind professional review.

## Conditional teen extension

The inspected secondary candidates are:

- Class 6: `চারুপাঠ`, `আনন্দপাঠ`, `বাংলা ব্যাকরণ ও নির্মিতি`, and Bangla `বাংলাদেশ ও বিশ্বপরিচয়`;
- Class 8: `সাহিত্য-কণিকা` and Bangla `বাংলাদেশ ও বিশ্বপরিচয়`; and
- catalogue-only follow-up pages for Class 7 and Classes 9–10.

These records are explicitly conditional. They must not expand the current 6–12 learner promise unless the client confirms a teen pathway and an educator approves each selected text. The Class 6 and Class 8 BGS theme indexes are shown only as review summaries.

## Community-governed sources

NCTB publishes pre-primary and primary resources for Chakma, Marma, Garo, Sadri and Tripura language communities:

- pre-primary: <https://nctb.gov.bd/pages/static-pages/695b9ab5c4774958d7b70861>
- primary: <https://nctb.gov.bd/pages/static-pages/695b993bc4774958d7b7050e>

These materials are discovery records only. Adaptation, translation, pronunciation, metadata labels and representation require named reviewers from the relevant community plus language specialists. “Bangladesh culture” must not erase or absorb these languages into a generic Bangla narrative.

## Lesson mapping and publication gates

`app/nctb-content.ts` maps ten existing lessons to candidate NCTB evidence anchors. Every mapping is `pending-educator-review`. A release must remain blocked until the reviewer records:

1. the exact source title, edition and page;
2. whether the proposed interpretation is supported by that source;
3. original wording suitable for Bangla second-language learners;
4. Bangla spelling, register, transliteration and translation approval;
5. cultural, historical, religious and age suitability;
6. copyright or permission for any non-trivial extract or image;
7. screen-reader reading order, descriptions, captions and keyboard access; and
8. child-pilot feedback and the resulting revision.

## Known limits and next review work

- Endpoint discovery is broader than deep educational reading. A professional team has not line-reviewed all 142 PDFs.
- Book page counts and contents indexes are evidence metadata, not proficiency-level equivalence.
- The Class 5 mapping is the most precise current source-to-lesson crosswalk. Class 1–4 units need the same title/page transcription before fine-grained publication.
- The NCTB assessment page at <https://nctb.gov.bd/pages/static-pages/6988638a3121d2f262f0eab3> exposed no downloadable file during the audit and is not treated as ingestible evidence.
- External file hosts used by official NCTB pages can change. A scheduled link and checksum review should be added to CI before launch.
- NCTB publication does not remove copyright, accessibility, safeguarding or Australian child-privacy obligations.

