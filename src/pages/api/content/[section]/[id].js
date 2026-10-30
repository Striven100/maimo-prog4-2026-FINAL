import { apiError, assertWriteAccess, json, readJson } from "../../../../server/http.js";
import { deleteRecord, getRecord, updateRecord } from "../../../../server/portfolio.repository.js";
import { normalizeGeneric } from "../../../../server/record.normalizers.js";

export const prerender = false;

export async function GET({ params }) {
  try {
    return json({ ok: true, data: await getRecord(params.section, params.id) });
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT({ request, params }) {
  try {
    assertWriteAccess(request);
    const record = await updateRecord(
      params.section,
      params.id,
      normalizeGeneric(params.section, await readJson(request))
    );
    return json({ ok: true, data: record });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE({ request, params }) {
  try {
    assertWriteAccess(request);
    return json({ ok: true, data: await deleteRecord(params.section, params.id) });
  } catch (error) {
    return apiError(error);
  }
}
