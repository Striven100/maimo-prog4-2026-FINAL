import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { ApiError, slugify } from "./http.js";

const RULES = {
  image: {
    folder: "images",
    maxBytes: 8 * 1024 * 1024,
    mimeTypes: new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]),
    extensions: new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"])
  },
  pdf: {
    folder: "pdfs",
    maxBytes: 15 * 1024 * 1024,
    mimeTypes: new Set(["application/pdf"]),
    extensions: new Set([".pdf"])
  }
};

export async function storeUpload(file, kind) {
  if (!(file instanceof File) || file.size === 0) return null;
  const rule = RULES[kind];
  if (!rule) throw new ApiError(500, "Tipo de carga no configurado.");

  const extension = path.extname(file.name).toLowerCase();
  if (!rule.mimeTypes.has(file.type) || !rule.extensions.has(extension)) {
    throw new ApiError(415, kind === "image" ? "La imagen debe ser JPG, PNG, WebP, GIF o SVG." : "El archivo debe ser PDF.");
  }
  if (file.size > rule.maxBytes) {
    throw new ApiError(413, kind === "image" ? "Cada imagen puede pesar hasta 8 MB." : "Cada PDF puede pesar hasta 15 MB.");
  }

  const publicFolder = path.join(process.cwd(), "public", "uploads", rule.folder);
  await mkdir(publicFolder, { recursive: true });
  const stem = slugify(path.basename(file.name, extension)) || kind;
  const filename = `${stem}-${randomUUID().slice(0, 10)}${extension}`;
  await writeFile(path.join(publicFolder, filename), Buffer.from(await file.arrayBuffer()));

  return {
    url: `/uploads/${rule.folder}/${filename}`,
    name: file.name,
    size: file.size,
    type: file.type
  };
}

export async function storeMany(files, kind) {
  const results = [];
  for (const file of files) {
    const saved = await storeUpload(file, kind);
    if (saved) results.push(saved);
  }
  return results;
}
