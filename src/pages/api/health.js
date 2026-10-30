import { apiError, json } from "../../server/http.js";
import { getDatabase } from "../../server/portfolio.repository.js";

export const prerender = false;

export async function GET() {
  try {
    const database = await getDatabase();
    return json({
      ok: true,
      stage: database.meta?.stage,
      updatedAt: database.meta?.updatedAt,
      counts: {
        projects: database.projects?.length ?? 0,
        experiences: database.experiences?.length ?? 0
      }
    });
  } catch (error) {
    return apiError(error);
  }
}
