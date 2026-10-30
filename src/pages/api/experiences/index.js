import { apiError, assertWriteAccess, json, readJson } from "../../../server/http.js";
import { insertRecord, listRecords } from "../../../server/portfolio.repository.js";
import { normalizeExperience } from "../../../server/record.normalizers.js";

export const prerender = false;

export async function GET() {
  try {
    return json({ ok: true, data: await listRecords("experiences") });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST({ request }) {
  try {
    assertWriteAccess(request);
    const record = await insertRecord("experiences", normalizeExperience(await readJson(request)));
    return json({ ok: true, data: record }, 201);
  } catch (error) {
    return apiError(error);
  }
}
