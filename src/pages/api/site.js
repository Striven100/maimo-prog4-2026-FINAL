import { apiError, assertAdminAccess, assertWriteAccess, cleanText, json, readJson, required, toList } from "../../server/http.js";
import { getDatabase, updateSingleton } from "../../server/portfolio.repository.js";

export const prerender = false;

export async function GET({ request }) {
  try {
    assertAdminAccess(request);
    return json({ ok: true, data: (await getDatabase()).site ?? {} });
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT({ request }) {
  try {
    assertWriteAccess(request);
    const body = await readJson(request);
    const data = await updateSingleton("site", {
      eyebrow: cleanText(body.eyebrow),
      heroLine: required(body.heroLine, "heroLine", "Título principal"),
      heroAccent: required(body.heroAccent, "heroAccent", "Título destacado"),
      specialties: toList(body.specialties),
      projectsTitle: required(body.projectsTitle, "projectsTitle", "Título de proyectos"),
      projectsIntro: cleanText(body.projectsIntro),
      capabilitiesTitle: required(body.capabilitiesTitle, "capabilitiesTitle", "Título de capacidades"),
      experienceTitle: required(body.experienceTitle, "experienceTitle", "Título de experiencia"),
      educationTitle: required(body.educationTitle, "educationTitle", "Título de formación"),
      contactTitle: required(body.contactTitle, "contactTitle", "Título de contacto"),
      contactBody: cleanText(body.contactBody),
      footerNote: cleanText(body.footerNote)
    });
    return json({ ok: true, data });
  } catch (error) {
    return apiError(error);
  }
}
