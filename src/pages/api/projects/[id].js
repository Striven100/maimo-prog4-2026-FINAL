import { apiError, assertAdminAccess, assertWriteAccess, json } from "../../../server/http.js";
import { deleteRecord, getRecord, updateRecord } from "../../../server/portfolio.repository.js";
import { normalizeProject } from "../../../server/record.normalizers.js";

export const prerender = false;

export async function GET({ request, params }) {
  try {
    assertAdminAccess(request);
    return json({ ok: true, data: await getRecord("projects", params.id) });
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT({ request, params }) {
  try {
    assertWriteAccess(request);
    const existing = await getRecord("projects", params.id);
    const record = await updateRecord(
      "projects",
      existing.id,
      await normalizeProject(await request.formData(), existing)
    );
    return json({ ok: true, data: record });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE({ request, params }) {
  try {
    assertWriteAccess(request);
    const record = await deleteRecord("projects", params.id);
    return json({ ok: true, data: record });
  } catch (error) {
    return apiError(error);
  }
}
