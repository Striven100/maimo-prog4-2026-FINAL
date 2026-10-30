import { apiError, assertWriteAccess, cleanText, json, readJson, required } from "../../server/http.js";
import { getDatabase, updateSingleton } from "../../server/portfolio.repository.js";

export const prerender = false;

export async function GET() {
  try {
    return json({ ok: true, data: (await getDatabase()).profile });
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT({ request }) {
  try {
    assertWriteAccess(request);
    const body = await readJson(request);
    const data = await updateSingleton("profile", {
      name: required(body.name, "name", "Nombre"),
      role: required(body.role, "role", "Rol profesional"),
      status: cleanText(body.status),
      about: required(body.about, "about", "Descripción")
    });
    return json({ ok: true, data });
  } catch (error) {
    return apiError(error);
  }
}
