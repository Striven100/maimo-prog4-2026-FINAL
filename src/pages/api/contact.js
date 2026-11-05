import { apiError, assertAdminAccess, assertWriteAccess, cleanText, json, readJson } from "../../server/http.js";
import { getDatabase, updateSingleton } from "../../server/portfolio.repository.js";

export const prerender = false;

export async function GET({ request }) {
  try {
    assertAdminAccess(request);
    return json({ ok: true, data: (await getDatabase()).contact });
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT({ request }) {
  try {
    assertWriteAccess(request);
    const body = await readJson(request);
    const data = await updateSingleton("contact", {
      email: cleanText(body.email),
      phone: cleanText(body.phone),
      phoneHref: cleanText(body.phoneHref),
      linkedin: cleanText(body.linkedin),
      github: cleanText(body.github),
      behance: cleanText(body.behance),
      location: cleanText(body.location),
      availability: cleanText(body.availability)
    });
    return json({ ok: true, data });
  } catch (error) {
    return apiError(error);
  }
}
