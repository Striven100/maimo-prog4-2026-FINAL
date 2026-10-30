import { apiError, assertWriteAccess, json, readJson } from "../../../server/http.js";
import { insertRecord, listRecords } from "../../../server/portfolio.repository.js";
import { normalizeGeneric } from "../../../server/record.normalizers.js";

export const prerender = false;

export async function GET({ params }) {
  try {
    return json({ ok: true, data: await listRecords(params.section) });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST({ request, params }) {
  try {
    assertWriteAccess(request);
    const body = await readJson(request);
    const record = await insertRecord(params.section, normalizeGeneric(params.section, body));
    return json({ ok: true, data: record }, 201);
  } catch (error) {
    return apiError(error);
  }
}
