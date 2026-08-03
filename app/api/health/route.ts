import { sql } from "drizzle-orm";
import { getDb } from "../../../db";

export const dynamic = "force-dynamic";

/**
 * Liveness/readiness probe for load balancers and uptime monitors.
 * Returns 200 only when the database is reachable, 503 otherwise.
 */
export async function GET() {
  try {
    const db = await getDb();
    await db.run(sql`SELECT 1`);
    return Response.json(
      { status: "ok", time: new Date().toISOString() },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { status: "degraded", reason: "database-unreachable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
