import { BlobPreconditionFailedError, get, put } from "@vercel/blob";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { ApiError } from "./http.js";

export const DATA_FILE = process.env.PORTFOLIO_DATA_FILE
  ? path.resolve(process.env.PORTFOLIO_DATA_FILE)
  : path.join(process.cwd(), "data", "portfolio.json");

const DATABASE_BLOB_PATH = process.env.PORTFOLIO_BLOB_PATH || "portfolio-data/portfolio.json";
const BLOB_ACCESS = "public";

export function isBlobConfigured() {
  const token = process.env.BLOB_READ_WRITE_TOKEN || import.meta.env?.BLOB_READ_WRITE_TOKEN;
  const storeId = process.env.BLOB_STORE_ID || import.meta.env?.BLOB_STORE_ID;
  const oidcToken = process.env.VERCEL_OIDC_TOKEN || import.meta.env?.VERCEL_OIDC_TOKEN;
  return Boolean(
    token || (storeId && oidcToken)
  );
}

export function blobAuthOptions() {
  const storeId = process.env.BLOB_STORE_ID || import.meta.env?.BLOB_STORE_ID;
  const oidcToken = process.env.VERCEL_OIDC_TOKEN || import.meta.env?.VERCEL_OIDC_TOKEN;
  if (storeId && oidcToken) return { storeId, oidcToken };
  const token = process.env.BLOB_READ_WRITE_TOKEN || import.meta.env?.BLOB_READ_WRITE_TOKEN;
  return token ? { token } : {};
}

export function getStorageStatus() {
  const blob = isBlobConfigured();
  const onVercel = (process.env.VERCEL || import.meta.env?.VERCEL) === "1";
  return {
    mode: blob ? "vercel-blob" : "local-json",
    label: blob ? "Vercel Blob conectado" : onVercel ? "Vercel Blob pendiente" : "Base local conectada",
    persistent: blob || !onVercel,
    configured: blob,
    onVercel
  };
}

async function readLocalDatabase() {
  try {
    return JSON.parse(await readFile(DATA_FILE, "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") throw new ApiError(500, "No se encontró data/portfolio.json.");
    if (error instanceof SyntaxError) throw new ApiError(500, "data/portfolio.json contiene JSON inválido.");
    throw error;
  }
}

async function readBlobDatabase() {
  const result = await get(DATABASE_BLOB_PATH, {
    access: BLOB_ACCESS,
    useCache: false,
    ...blobAuthOptions()
  });
  if (!result?.stream) return null;

  try {
    return {
      database: JSON.parse(await new Response(result.stream).text()),
      etag: result.blob.etag
    };
  } catch (error) {
    if (error instanceof SyntaxError) throw new ApiError(500, "El archivo del portfolio en Vercel Blob contiene JSON inválido.");
    throw error;
  }
}

export async function readDatabaseState() {
  if (isBlobConfigured()) {
    const remote = await readBlobDatabase();
    if (remote) return remote;
  }

  return {
    database: await readLocalDatabase(),
    etag: null
  };
}

async function writeLocalDatabase(database) {
  await mkdir(path.dirname(DATA_FILE), { recursive: true });
  const temporaryFile = `${DATA_FILE}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(temporaryFile, `${JSON.stringify(database, null, 2)}\n`, "utf8");
  await rename(temporaryFile, DATA_FILE);
}

async function writeBlobDatabase(database, etag) {
  try {
    await put(DATABASE_BLOB_PATH, `${JSON.stringify(database, null, 2)}\n`, {
      access: BLOB_ACCESS,
      contentType: "application/json; charset=utf-8",
      allowOverwrite: true,
      cacheControlMaxAge: 60,
      ...blobAuthOptions(),
      ...(etag ? { ifMatch: etag } : {})
    });
  } catch (error) {
    if (error instanceof BlobPreconditionFailedError) {
      throw new ApiError(409, "El portfolio fue modificado en otra sesión. Recargá el panel y volvé a intentarlo.");
    }
    throw error;
  }
}

export async function writeDatabaseState(database, etag = null) {
  database.meta = {
    ...database.meta,
    storage: isBlobConfigured() ? "vercel-blob" : "local-json",
    updatedAt: new Date().toISOString()
  };

  if (isBlobConfigured()) {
    await writeBlobDatabase(database, etag);
    return;
  }

  if ((process.env.VERCEL || import.meta.env?.VERCEL) === "1") {
    throw new ApiError(
      503,
      "Vercel Blob todavía no está conectado. Creá un Blob público en Storage y vinculalo a este proyecto."
    );
  }

  await writeLocalDatabase(database);
}

export { DATABASE_BLOB_PATH };
