import { apiError, assertWriteAccess, json } from "../../../server/http.js";
import { insertRecord, listRecords } from "../../../server/portfolio.repository.js";
import { normalizeProject } from "../../../server/record.normalizers.js";

export const prerender = false;

export async function GET() {
  try {
    return json({ ok: true, data: await listRecords("projects") });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST({ request }) {
  try {
    assertWriteAccess(request);
    const record = await insertRecord("projects", await normalizeProject(await request.formData()));
    return json({ ok: true, data: record }, 201);
  } catch (error) {
    return apiError(error);
  }
}
