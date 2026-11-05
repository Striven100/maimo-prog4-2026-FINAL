import { apiError, assertAdminAccess, assertWriteAccess, cleanText, json, required, toBoolean } from "../../server/http.js";
import { getDatabase, updateSingleton } from "../../server/portfolio.repository.js";
import { storeUpload } from "../../server/upload.service.js";

export const prerender = false;

export async function GET({ request }) {
  try {
    assertAdminAccess(request);
    return json({ ok: true, data: (await getDatabase()).profile });
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT({ request }) {
  try {
    assertWriteAccess(request);
    const form = await request.formData();
    const current = (await getDatabase()).profile;
    const portrait = await storeUpload(form.get("portraitImage"), "image");
    const removePortrait = toBoolean(form.get("removePortraitImage"), false);
    const data = await updateSingleton("profile", {
      name: required(form.get("name"), "name", "Nombre"),
      role: required(form.get("role"), "role", "Rol profesional"),
      status: cleanText(form.get("status")),
      about: required(form.get("about"), "about", "Descripción"),
      portraitImage: portrait?.url || (removePortrait ? "" : current.portraitImage || "")
    });
    return json({ ok: true, data });
  } catch (error) {
    return apiError(error);
  }
}
