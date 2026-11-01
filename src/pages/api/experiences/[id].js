import { apiError, assertAdminAccess, assertWriteAccess, json, readJson } from "../../../server/http.js";
import { deleteRecord, getRecord, updateRecord } from "../../../server/portfolio.repository.js";
import { normalizeExperience } from "../../../server/record.normalizers.js";

export const prerender = false;

export async function GET({ request, params }) {
  try {
    assertAdminAccess(request);
    return json({ ok: true, data: await getRecord("experiences", params.id) });
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT({ request, params }) {
  try {
    assertWriteAccess(request);
    const record = await updateRecord("experiences", params.id, normalizeExperience(await readJson(request)));
    return json({ ok: true, data: record });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE({ request, params }) {
  try {
    assertWriteAccess(request);
    return json({ ok: true, data: await deleteRecord("experiences", params.id) });
  } catch (error) {
    return apiError(error);
  }
}
