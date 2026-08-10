import { eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { knowledgeSources } from "../../../db/schema";
import { getSessionAdult } from "@/lib/auth";
import { libraryBooks } from "../../library-content";
import type { LibraryBook } from "../../library-content";

export const dynamic = "force-dynamic";

// Teacher-editable knowledge sources (client requirement R13): the static
// catalog in app/library-content.ts is the yearly baseline; rows in the
// knowledge_sources table override it (matching id) or extend it (new id).
// An override of { hidden: true } removes a baseline book from display.

export type SourceOverride = Partial<LibraryBook> & { hidden?: boolean; downloadUrl?: string };

export async function GET() {
  try {
    const db = await getDb();
    const rows = await db.select().from(knowledgeSources).where(eq(knowledgeSources.active, true));
    const overrides = new Map<string, SourceOverride>();
    for (const row of rows) {
      try {
        overrides.set(row.id, JSON.parse(row.dataJson) as SourceOverride);
      } catch {
        // Skip malformed rows rather than break the public library.
      }
    }

    const merged: Array<LibraryBook & { downloadUrl?: string; customised: boolean }> = [];
    for (const book of libraryBooks) {
      const override = overrides.get(book.id);
      overrides.delete(book.id);
      if (override?.hidden) continue;
      merged.push({ ...book, ...override, id: book.id, customised: Boolean(override) });
    }
    for (const [id, override] of overrides) {
      if (override.hidden) continue;
      const extra = asFullBook(id, override);
      if (extra) merged.push({ ...extra, customised: true });
    }

    return Response.json({ books: merged });
  } catch {
    // Database not ready — serve the static baseline so the page still works.
    return Response.json({ books: libraryBooks.map((book) => ({ ...book, customised: false })) });
  }
}

export async function PUT(request: Request) {
  const user = await getSessionAdult();
  if (!user) return Response.json({ error: "Sign in to update the knowledge sources." }, { status: 401 });

  try {
    const body = (await request.json().catch(() => ({}))) as { id?: unknown; data?: unknown };
    const id = typeof body.id === "string" ? body.id.trim().slice(0, 60) : "";
    if (!id || !/^[a-z0-9-]+$/.test(id)) {
      return Response.json({ error: "Source id must be lowercase letters, digits and dashes." }, { status: 400 });
    }
    if (typeof body.data !== "object" || body.data === null) {
      return Response.json({ error: "Provide the source fields to store." }, { status: 400 });
    }
    const data = sanitizeOverride(body.data as Record<string, unknown>);
    const isBaseline = libraryBooks.some((book) => book.id === id);
    if (!isBaseline && !data.hidden) {
      const full = asFullBook(id, data);
      if (!full) {
        return Response.json(
          { error: "A new source needs at least both titles and its classes in English and Bangla." },
          { status: 400 },
        );
      }
    }

    const db = await getDb();
    const now = new Date().toISOString();
    await db
      .insert(knowledgeSources)
      .values({ id, updatedBy: user.email, dataJson: JSON.stringify(data), active: true, updatedAt: now })
      .onConflictDoUpdate({
        target: knowledgeSources.id,
        set: { updatedBy: user.email, dataJson: JSON.stringify(data), active: true, updatedAt: now },
      });
    return Response.json({ ok: true });
  } catch (error) {
    return databaseError(error);
  }
}

export async function DELETE(request: Request) {
  const user = await getSessionAdult();
  if (!user) return Response.json({ error: "Sign in to update the knowledge sources." }, { status: 401 });

  try {
    const body = (await request.json().catch(() => ({}))) as { id?: unknown };
    const id = typeof body.id === "string" ? body.id : "";
    if (!id) return Response.json({ error: "Choose a source to reset." }, { status: 400 });

    const db = await getDb();
    await db.delete(knowledgeSources).where(eq(knowledgeSources.id, id));
    return Response.json({ ok: true });
  } catch (error) {
    return databaseError(error);
  }
}

function sanitizeOverride(raw: Record<string, unknown>): SourceOverride {
  const out: SourceOverride = {};
  if (raw.hidden === true) out.hidden = true;
  if (typeof raw.downloadUrl === "string") {
    const url = raw.downloadUrl.trim().slice(0, 500);
    if (url && /^https:\/\//.test(url)) out.downloadUrl = url;
  }
  if (typeof raw.titleBn === "string" && raw.titleBn.trim()) out.titleBn = raw.titleBn.trim().slice(0, 160);
  if (typeof raw.titleEn === "string" && raw.titleEn.trim()) out.titleEn = raw.titleEn.trim().slice(0, 160);
  if (raw.level === "primary" || raw.level === "secondary" || raw.level === "higher-secondary") out.level = raw.level;
  if (raw.status === "listed" || raw.status === "confirm") out.status = raw.status;
  if (typeof raw.hasEnglishVersion === "boolean") out.hasEnglishVersion = raw.hasEnglishVersion;
  for (const key of ["classes", "subjectArea", "covers", "whyItMatters"] as const) {
    const value = raw[key];
    if (typeof value === "object" && value !== null) {
      const pair = value as { en?: unknown; bn?: unknown };
      if (typeof pair.en === "string" && typeof pair.bn === "string" && pair.en.trim() && pair.bn.trim()) {
        out[key] = { en: pair.en.trim().slice(0, 400), bn: pair.bn.trim().slice(0, 400) };
      }
    }
  }
  return out;
}

function asFullBook(id: string, override: SourceOverride): LibraryBook | null {
  if (!override.titleBn || !override.titleEn || !override.classes) return null;
  return {
    id,
    titleBn: override.titleBn,
    titleEn: override.titleEn,
    classes: override.classes,
    level: override.level ?? "secondary",
    subjectArea: override.subjectArea ?? { en: "Added by a teacher", bn: "শিক্ষকের যোগ করা" },
    covers: override.covers ?? { en: "", bn: "" },
    whyItMatters: override.whyItMatters ?? { en: "", bn: "" },
    hasEnglishVersion: override.hasEnglishVersion ?? false,
    status: override.status ?? "confirm",
  };
}

function databaseError(error: unknown) {
  const message = error instanceof Error ? error.message : "Unexpected database error";
  const unavailable = message.includes("no such table") || message.includes("SQLITE");
  return Response.json({ error: unavailable ? "The knowledge-source service is still being set up." : message }, { status: 500 });
}
