import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { ApiError, slugify } from "./http.js";

const DATA_FILE = process.env.PORTFOLIO_DATA_FILE
  ? path.resolve(process.env.PORTFOLIO_DATA_FILE)
  : path.join(process.cwd(), "data", "portfolio.json");

const COLLECTIONS = new Set([
  "projects",
  "experiences",
  "services",
  "skills",
  "tools",
  "certifications",
  "education",
  "interests"
]);

let mutationQueue = Promise.resolve();

function ensureCollection(section) {
  if (!COLLECTIONS.has(section)) throw new ApiError(404, "La categoría solicitada no existe.");
}

function byOrder(items = []) {
  return [...items].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

async function writeDatabase(database) {
  await mkdir(path.dirname(DATA_FILE), { recursive: true });
  const temporaryFile = `${DATA_FILE}.${process.pid}.${Date.now()}.tmp`;
  database.meta = {
    ...database.meta,
    updatedAt: new Date().toISOString()
  };
  await writeFile(temporaryFile, `${JSON.stringify(database, null, 2)}\n`, "utf8");
  await rename(temporaryFile, DATA_FILE);
}

function queueMutation(callback) {
  const next = mutationQueue.then(callback, callback);
  mutationQueue = next.catch(() => undefined);
  return next;
}

export async function getDatabase() {
  try {
    return JSON.parse(await readFile(DATA_FILE, "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") throw new ApiError(500, "No se encontró data/portfolio.json.");
    if (error instanceof SyntaxError) throw new ApiError(500, "data/portfolio.json contiene JSON inválido.");
    throw error;
  }
}

export async function getPublicPortfolio() {
  const database = await getDatabase();
  const visible = (items) => byOrder(items).filter((item) => item.visible !== false);
  return {
    meta: database.meta,
    profile: database.profile,
    contact: database.contact,
    projects: visible(database.projects),
    experiences: visible(database.experiences),
    services: visible(database.services),
    skills: visible(database.skills),
    tools: visible(database.tools),
    certifications: visible(database.certifications),
    education: visible(database.education),
    interests: visible(database.interests)
  };
}

export async function listRecords(section) {
  ensureCollection(section);
  const database = await getDatabase();
  return byOrder(database[section] ?? []);
}

export async function getRecord(section, idOrSlug) {
  ensureCollection(section);
  const database = await getDatabase();
  const record = (database[section] ?? []).find(
    (item) => item.id === idOrSlug || (section === "projects" && item.slug === idOrSlug)
  );
  if (!record) throw new ApiError(404, "No se encontró el registro solicitado.");
  return record;
}

export async function insertRecord(section, input) {
  ensureCollection(section);
  return queueMutation(async () => {
    const database = await getDatabase();
    const now = new Date().toISOString();
    const base = slugify(input.slug || input.title || input.role || input.name || section) || section;
    const record = {
      ...input,
      id: `${section.replace(/s$/, "")}-${base}-${randomUUID().slice(0, 8)}`,
      createdAt: now,
      updatedAt: now
    };

    if (section === "projects" && database.projects.some((item) => item.slug === record.slug)) {
      throw new ApiError(409, "Ya existe un proyecto con ese slug.", { field: "slug" });
    }

    database[section] = [...(database[section] ?? []), record];
    await writeDatabase(database);
    return record;
  });
}

export async function updateRecord(section, id, input) {
  ensureCollection(section);
  return queueMutation(async () => {
    const database = await getDatabase();
    const index = (database[section] ?? []).findIndex((item) => item.id === id);
    if (index === -1) throw new ApiError(404, "No se encontró el registro solicitado.");

    if (
      section === "projects" &&
      input.slug &&
      database.projects.some((item, itemIndex) => itemIndex !== index && item.slug === input.slug)
    ) {
      throw new ApiError(409, "Ya existe otro proyecto con ese slug.", { field: "slug" });
    }

    const record = {
      ...database[section][index],
      ...input,
      id,
      createdAt: database[section][index].createdAt,
      updatedAt: new Date().toISOString()
    };
    database[section][index] = record;
    await writeDatabase(database);
    return record;
  });
}

export async function deleteRecord(section, id) {
  ensureCollection(section);
  return queueMutation(async () => {
    const database = await getDatabase();
    const index = (database[section] ?? []).findIndex((item) => item.id === id);
    if (index === -1) throw new ApiError(404, "No se encontró el registro solicitado.");
    const [removed] = database[section].splice(index, 1);
    await writeDatabase(database);
    return removed;
  });
}

export async function updateSingleton(section, input) {
  if (!new Set(["profile", "contact"]).has(section)) {
    throw new ApiError(404, "La sección solicitada no existe.");
  }
  return queueMutation(async () => {
    const database = await getDatabase();
    database[section] = { ...database[section], ...input };
    await writeDatabase(database);
    return database[section];
  });
}

export { COLLECTIONS, DATA_FILE };
