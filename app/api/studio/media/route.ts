import { and, eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { mediaAssets } from "../../../../db/schema";
import { lessons } from "../../../curriculum";
import { getSessionAdult } from "@/lib/auth";
import { putMediaObject } from "@/lib/storage";

export const dynamic = "force-dynamic";
const maxBytes = 12 * 1024 * 1024;
const slots = /^(dialogue|reading|word-[1-6]|pattern-[1-2])$/;

export async function POST(request: Request) {
  const user = await getSessionAdult();
  if (!user) return Response.json({ error: "Sign in required." }, { status: 401 });
  const form = await request.formData();
  const file = form.get("file");
  const lessonId = value(form.get("lessonId"), 60);
  const slot = value(form.get("slot"), 30);
  const speakerName = value(form.get("speakerName"), 80);
  const dialect = value(form.get("dialect"), 80) || "Bangladesh standard";
  const consentConfirmed = form.get("consentConfirmed") === "true";
  if (!(file instanceof File) || !lessons.some((lesson) => lesson.id === lessonId) || !slots.test(slot)) return Response.json({ error: "Choose a valid lesson, audio slot and file." }, { status: 400 });
  if (!file.type.startsWith("audio/") || file.size <= 0 || file.size > maxBytes) return Response.json({ error: "Upload an audio file no larger than 12 MB." }, { status: 400 });
  if (!speakerName || !consentConfirmed) return Response.json({ error: "Speaker credit and recorded consent confirmation are required." }, { status: 400 });

  const extension = safeExtension(file.name, file.type);
  const objectKey = `human-audio/${lessonId}/${slot}/${crypto.randomUUID()}.${extension}`;
  await putMediaObject(objectKey, Buffer.from(await file.arrayBuffer()));
  const db = await getDb();
  const [asset] = await db.insert(mediaAssets).values({
    id: crypto.randomUUID(),
    ownerEmail: user.email,
    lessonId,
    slot,
    objectKey,
    originalName: file.name.slice(0, 180),
    contentType: file.type,
    byteSize: file.size,
    speakerName,
    dialect,
    consentConfirmed,
    reviewStatus: "pending",
  }).returning();
  return Response.json({ asset }, { status: 201 });
}

export async function PATCH(request: Request) {
  const user = await getSessionAdult();
  if (!user) return Response.json({ error: "Sign in required." }, { status: 401 });
  const body = (await request.json()) as Record<string, unknown>;
  const id = value(body.id, 80);
  const reviewStatus = value(body.reviewStatus, 30);
  const notes = value(body.notes, 1500);
  if (!id || !["pending", "changes-requested", "approved", "retired"].includes(reviewStatus)) return Response.json({ error: "Invalid media review update." }, { status: 400 });
  const db = await getDb();
  const [owned] = await db.select().from(mediaAssets).where(and(eq(mediaAssets.id, id), eq(mediaAssets.ownerEmail, user.email))).limit(1);
  if (!owned) return Response.json({ error: "Audio asset not found." }, { status: 404 });
  if (reviewStatus === "approved" && !owned.consentConfirmed) return Response.json({ error: "Consent must be confirmed before approval." }, { status: 400 });
  if (reviewStatus === "approved") {
    await db.update(mediaAssets).set({ reviewStatus: "retired", updatedAt: new Date().toISOString() }).where(and(eq(mediaAssets.ownerEmail, user.email), eq(mediaAssets.lessonId, owned.lessonId), eq(mediaAssets.slot, owned.slot), eq(mediaAssets.reviewStatus, "approved")));
  }
  const [asset] = await db.update(mediaAssets).set({ reviewStatus, notes, updatedAt: new Date().toISOString() }).where(eq(mediaAssets.id, id)).returning();
  return Response.json({ asset });
}

function value(input: FormDataEntryValue | unknown, maxLength: number) {
  return typeof input === "string" ? input.trim().slice(0, maxLength) : "";
}

function safeExtension(name: string, contentType: string) {
  const raw = name.split(".").at(-1)?.toLowerCase();
  if (raw && ["mp3", "wav", "ogg", "m4a", "webm", "aac"].includes(raw)) return raw;
  if (contentType.includes("ogg")) return "ogg";
  if (contentType.includes("wav")) return "wav";
  if (contentType.includes("mpeg")) return "mp3";
  return "webm";
}
