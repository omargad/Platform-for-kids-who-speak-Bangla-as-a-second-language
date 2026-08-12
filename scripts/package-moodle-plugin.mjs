import { execFileSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pluginRoot, repositoryRoot, verifyMoodlePlugin } from "./verify-moodle-plugin.mjs";

function outputArgument() {
  const index = process.argv.indexOf("--output");
  if (index === -1) return path.join(repositoryRoot, "dist", "local_banglapilot.zip");
  if (!process.argv[index + 1] || process.argv[index + 1].startsWith("--")) {
    throw new Error("--output requires a ZIP path");
  }
  return path.resolve(process.argv[index + 1]);
}

async function normalise(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const epoch = new Date("2026-08-12T00:00:00.000Z");
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await normalise(absolute);
      await fs.chmod(absolute, 0o755);
    } else {
      await fs.chmod(absolute, 0o644);
    }
    await fs.utimes(absolute, epoch, epoch);
  }
  await fs.utimes(directory, epoch, epoch);
}

async function packagePlugin() {
  await verifyMoodlePlugin();
  const output = outputArgument();
  if (path.extname(output).toLowerCase() !== ".zip") throw new Error("Plugin output must end in .zip");

  const temporary = await fs.mkdtemp(path.join(os.tmpdir(), "banglapilot-package-"));
  try {
    const packageRoot = path.join(temporary, "banglapilot");
    await fs.cp(pluginRoot, packageRoot, { recursive: true, verbatimSymlinks: true });
    await normalise(packageRoot);
    await fs.mkdir(path.dirname(output), { recursive: true });
    await fs.rm(output, { force: true });

    execFileSync("zip", ["-X", "-q", "-r", output, "banglapilot"], {
      cwd: temporary,
      env: { ...process.env, TZ: "UTC" },
    });

    const archive = await fs.readFile(output);
    const digest = crypto.createHash("sha256").update(archive).digest("hex");
    await fs.writeFile(`${output}.sha256`, `${digest}  ${path.basename(output)}\n`, { mode: 0o644 });
    console.log(`Created ${path.relative(repositoryRoot, output)} (${archive.length} bytes)`);
    console.log(`SHA-256 ${digest}`);
  } finally {
    await fs.rm(temporary, { recursive: true, force: true });
  }
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectRun) await packagePlugin();
