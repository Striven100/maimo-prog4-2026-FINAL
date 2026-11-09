import { access, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const database = JSON.parse(await readFile(path.join(root, "data", "portfolio.json"), "utf8"));
const errors = [];

function ensureUnique(items, key, label) {
  const seen = new Set();
  for (const item of items) {
    const value = item[key];
    if (!value) errors.push(`${label}: falta ${key}.`);
    if (seen.has(value)) errors.push(`${label}: ${key} duplicado (${value}).`);
    seen.add(value);
  }
}

async function ensurePublicAsset(url, label) {
  if (!url || !url.startsWith("/")) return;
  try {
    await access(path.join(root, "public", url));
  } catch {
    errors.push(`${label}: no existe public${url}.`);
  }
}

ensureUnique(database.projects ?? [], "id", "Proyectos");
ensureUnique(database.projects ?? [], "slug", "Proyectos");

for (const project of database.projects ?? []) {
  if (!project.title || !project.summary || !project.description) {
    errors.push(`Proyecto ${project.id}: faltan título, resumen o descripción.`);
  }
  await ensurePublicAsset(project.coverImage, `Portada de ${project.title}`);
  for (const frame of project.gallery ?? []) await ensurePublicAsset(frame.url, `Galería de ${project.title}`);
  for (const pdf of project.pdfs ?? []) await ensurePublicAsset(pdf.url, `PDF de ${project.title}`);
}

for (const section of ["experiences", "services", "skills", "tools", "certifications", "education", "interests"]) {
  ensureUnique(database[section] ?? [], "id", section);
}

if (errors.length) {
  console.error(`Validación de contenido fallida (${errors.length}):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Contenido válido: ${database.projects.length} proyectos y ${database.experiences.length} experiencias.`);
