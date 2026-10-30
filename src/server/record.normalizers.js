import { cleanText, required, slugify, toBoolean, toList, toNumber } from "./http.js";
import { storeMany, storeUpload } from "./upload.service.js";

export function normalizeExperience(body) {
  const current = toBoolean(body.current, false);
  return {
    role: required(body.role, "role", "Puesto o rol"),
    company: required(body.company, "company", "Empresa u organización"),
    employmentType: cleanText(body.employmentType, "No especificado"),
    workMode: cleanText(body.workMode, "No especificado"),
    location: cleanText(body.location),
    startDate: cleanText(body.startDate),
    endDate: current ? "" : cleanText(body.endDate),
    current,
    summary: required(body.summary, "summary", "Descripción breve"),
    responsibilities: toList(body.responsibilities),
    achievements: toList(body.achievements),
    skills: toList(body.skills),
    companyUrl: cleanText(body.companyUrl),
    visible: toBoolean(body.visible, true),
    order: toNumber(body.order, 999)
  };
}

export async function normalizeProject(form, existing = null) {
  const title = required(form.get("title"), "title", "Título");
  const slug = slugify(cleanText(form.get("slug")) || title);
  const coverUpload = await storeUpload(form.get("coverImage"), "image");
  const galleryUploads = await storeMany(form.getAll("galleryImages"), "image");
  const pdfUploads = await storeMany(form.getAll("pdfFiles"), "pdf");
  const galleryAlt = cleanText(form.get("galleryAlt"), `Vista del proyecto ${title}`);

  const newGallery = galleryUploads.map((file, index) => ({
    ...file,
    alt: index === 0 ? galleryAlt : `${galleryAlt} — vista ${index + 1}`
  }));
  const newPdfs = pdfUploads.map((file) => ({ ...file, title: file.name.replace(/\.pdf$/i, "") }));

  return {
    slug,
    title,
    subtitle: cleanText(form.get("subtitle")),
    category: required(form.get("category"), "category", "Categoría"),
    projectType: cleanText(form.get("projectType"), "Proyecto personal"),
    status: cleanText(form.get("status"), "Finalizado"),
    summary: required(form.get("summary"), "summary", "Resumen"),
    description: required(form.get("description"), "description", "Descripción"),
    role: cleanText(form.get("role")),
    challenge: cleanText(form.get("challenge")),
    process: cleanText(form.get("process")),
    result: cleanText(form.get("result")),
    tools: toList(form.get("tools")),
    tags: toList(form.get("tags")),
    coverImage: coverUpload?.url || existing?.coverImage || newGallery[0]?.url || "",
    gallery: [...(existing?.gallery ?? []), ...newGallery],
    pdfs: [...(existing?.pdfs ?? []), ...newPdfs],
    links: {
      live: cleanText(form.get("liveUrl")),
      repository: cleanText(form.get("repositoryUrl")),
      caseStudy: cleanText(form.get("caseStudyUrl"))
    },
    featured: toBoolean(form.get("featured"), false),
    visible: toBoolean(form.get("visible"), false),
    order: toNumber(form.get("order"), 999)
  };
}

export function normalizeGeneric(section, body) {
  const visible = toBoolean(body.visible, true);
  const order = toNumber(body.order, 999);
  const common = { visible, order };

  if (section === "services") {
    return { ...common, name: required(body.name, "name", "Nombre"), category: cleanText(body.category), icon: cleanText(body.icon, "spark") };
  }
  if (section === "skills") {
    return { ...common, name: required(body.name, "name", "Nombre"), category: cleanText(body.category), level: cleanText(body.level) };
  }
  if (section === "tools") {
    return { ...common, name: required(body.name, "name", "Nombre"), category: cleanText(body.category), level: cleanText(body.level), icon: cleanText(body.icon, "spark") };
  }
  if (section === "certifications") {
    return { ...common, title: required(body.title, "title", "Título"), issuer: cleanText(body.issuer), date: cleanText(body.date), url: cleanText(body.url), description: cleanText(body.description) };
  }
  if (section === "education") {
    return { ...common, title: required(body.title, "title", "Título"), institution: required(body.institution, "institution", "Institución"), startDate: cleanText(body.startDate), endDate: cleanText(body.endDate), description: cleanText(body.description) };
  }
  if (section === "interests") {
    return { ...common, name: required(body.name, "name", "Nombre"), icon: cleanText(body.icon, "spark") };
  }
  return body;
}
