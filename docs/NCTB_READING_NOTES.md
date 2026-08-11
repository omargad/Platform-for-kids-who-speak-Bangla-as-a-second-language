# NCTB source reading & verification notes

Date: 11 August 2026. Companion to `docs/NCTB_CONTENT_AUDIT.md` (the team's
read-only endpoint audit) — this file records what has actually been **read**
from the ingested sources and what changed in the app as a result.

## What was ingested

The `Ingest NCTB textbooks` GitHub Actions workflow (runs 4 and 6) plus the
audited Book Bridge links produced **95 extracted text files** in
`content-sources/text/`, spanning: pre-primary (Amar Boi, Eso Likhte Shikhi,
Eso Ankibuki Kori, the 10-story archive), Amar Bangla Boi 1–5, BGS 3–5 in
Bangla and English, Class 6 Charupath/Anandapath/grammar/BGS, Class 8
readers, HSC Shohopath, teacher guides, and mother-tongue pre-primary books
in Chakma, Garo, Tripura and Marma. The full portal catalog
(`discovered-pdfs.json`) lists 2,979 files.

## Readability triage (confirms the team audit)

| Extraction result | Files | Notes |
|---|---|---|
| Real, machine-readable English | **BGS Class 4 EN 2026** (94k chars) | fully read — see below |
| Bangla in legacy Bijoy encoding | Class 3 reader 2024 (Ibtedayee), HSC Shohopath 2018, HSC 2024-era History & Social Science + guides | bytes map to SutonnyMJ glyphs, not Unicode; needs a Bijoy→Unicode converter (future work) before machine reading |
| Image-only scans | everything else (~2k chars each = headers/page numbers) | human reading copies; OCR (Tesseract + ben) would be required for machine text |

## What was read and verified

**Bangladesh and Global Studies, Class 4, English version, 2026** (experimental
edition, Sept 2025) — read in full. Key outcomes:

- **Curriculum discovery:** grades 1–4 now follow the *revised* primary
  curriculum (National Curriculum 2021, revised 2025); the Class 4 book has
  9 chapters, a different structure from the older Class 5 volume. The
  library card for BGS (primary) now shows **both** volume maps, with the
  Class 4 map marked *verified — read from the book*.
- **Topic verification against the book:**
  - *Ethnic communities* ✅ — Chakma largest and Marma second-largest groups,
    Bandarban/Khagrachhari/Rangamati, jhum cultivation, Sangrai water
    festival: all as the platform states. Book also covers Manipuri
    (Moulvibazar/Sylhet), a candidate addition for the topic.
  - *Festivals of many faiths* ✅ — chapter 2 teaches Eid-ul-Fitr/Azha, Durga
    Puja, Buddha Purnima (Baishakhi full moon) and Christmas, matching the
    platform's four-faith framing.
  - *Pohela Boishakh* ✅ — Ramna Batamul programmes, processions, Boishakhi
    Mela, halkhata (settling last year's dues): all confirmed.
  - *Nobanno* ✅ — Agrahayan month, new-rice cakes and payesh: confirmed.
  - *Liberation 1971 / Ekushey* ✅ — the background chapter's timeline
    (1952 Language Movement → 1954 United Front → 1956 state language →
    1966 Six Points → Agartala case → 1969 Mass Uprising with martyrs Asad,
    Dr Shamsuzzoha, Sgt Zahurul Haq, Matiur → 1970 election) is consistent
    with the platform's history topics; no contradictions found.
- **No factual corrections were required** in the 15 classroom topics from
  this book. One structural correction was made in the library:
  **Anandapath is the Class 6 rapid reader** (2025 edition in the ingest),
  not Class 8 as previously assumed.
- **Existence confirmations** from the ingest: Geography and Environment
  9–10 (2026 PDF in hand → status "listed"), mother-tongue books in four
  languages (→ status "listed").

## Poems provenance

The Bangla readers that would show the poems in print are image scans or
Bijoy-encoded, so the `/poems` verses could not be text-verified against
these files. Their public-domain status and authorship are independently
established; textbook-appearance claims remain general ("primary readers")
rather than edition-specific until a human (or OCR pass) checks the scans.

## Future work

1. Bijoy→Unicode converter for the legacy-encoded files (Shohopath, 2024-era
   history books) — unlocks machine reading of ~900k chars of Bangla.
2. OCR pass (Tesseract `ben`) over the image-only current-year readers.
3. Human verification of the Class 5 BGS and History 9–10 chapter maps
   against the image PDFs (minutes of visual checking each).
4. The 2024-era "History & Social Science" texts are the discontinued 2022
   curriculum — useful background, but never cite them as current sources.
