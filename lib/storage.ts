import fs from "node:fs/promises";
import path from "node:path";

/**
 * Filesystem-backed media store for reviewed pronunciation audio.
 * Keys look like `human-audio/<lessonId>/<slot>/<uuid>.<ext>`.
 * Swap this module for an S3/GCS/R2 client if the deployment moves to
 * object storage; the database only records the object key.
 */

function mediaRoot() {
  return process.env.MEDIA_ROOT ?? path.join(process.cwd(), ".data", "media");
}

function resolveKey(key: string) {
  const root = mediaRoot();
  const absolute = path.resolve(root, key);
  if (absolute !== root && !absolute.startsWith(root + path.sep)) {
    throw new Error("Invalid media key.");
  }
  return absolute;
}

export async function putMediaObject(key: string, data: Buffer): Promise<void> {
  const file = resolveKey(key);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, data);
}

export async function getMediaObject(key: string): Promise<Buffer | null> {
  try {
    return await fs.readFile(resolveKey(key));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

export async function deleteMediaObject(key: string): Promise<void> {
  try {
    await fs.unlink(resolveKey(key));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}
