import { createHmac, timingSafeEqual } from "node:crypto";

const ADMIN_COOKIE = "portfolio_admin_session";

export class ApiError extends Error {
  constructor(status, message, details = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export function json(data, status = 200, extraHeaders = {}) {
  const headers = new Headers({
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  });
  Object.entries(extraHeaders).forEach(([name, value]) => headers.set(name, value));
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers
  });
}

export function apiError(error) {
  const status = error instanceof ApiError ? error.status : 500;
  const message = error instanceof ApiError ? error.message : "Ocurrió un error inesperado.";

  if (!(error instanceof ApiError)) console.error(error);

  return json(
    {
      ok: false,
      error: message,
      ...(error instanceof ApiError && error.details ? { details: error.details } : {})
    },
    status
  );
}

export function required(value, field, label = field) {
  if (typeof value !== "string" || !value.trim()) {
    throw new ApiError(400, `El campo \"${label}\" es obligatorio.`, { field });
  }
  return value.trim();
}

export function cleanText(value, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

export function toBoolean(value, fallback = false) {
  if (typeof value === "boolean") return value;
  if (value === "true" || value === "1" || value === "on") return true;
  if (value === "false" || value === "0" || value === "off") return false;
  return fallback;
}

export function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function toList(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value !== "string") return [];
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function slugify(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

function configuredAdminKey() {
  return (process.env.PORTFOLIO_ADMIN_KEY || import.meta.env?.PORTFOLIO_ADMIN_KEY || "").trim();
}

function safeEqual(left, right) {
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));
  return a.length === b.length && timingSafeEqual(a, b);
}

function sessionToken(key) {
  return createHmac("sha256", key).update("portfolio-admin-session-v1").digest("hex");
}

function cookieValue(request, name) {
  const cookie = request.headers.get("cookie") || "";
  for (const part of cookie.split(";")) {
    const [key, ...value] = part.trim().split("=");
    if (key === name) return decodeURIComponent(value.join("="));
  }
  return "";
}

export function isAdminConfigured() {
  return Boolean(configuredAdminKey());
}

export function verifyAdminKey(candidate) {
  const key = configuredAdminKey();
  return Boolean(key && candidate && safeEqual(candidate, key));
}

export function hasAdminSession(request) {
  const key = configuredAdminKey();
  const isProduction = process.env.NODE_ENV === "production";
  if (!key && !isProduction) return true;
  if (!key) return false;
  return safeEqual(cookieValue(request, ADMIN_COOKIE), sessionToken(key));
}

export function createAdminSessionCookie() {
  const key = configuredAdminKey();
  if (!key) throw new ApiError(503, "Configurá PORTFOLIO_ADMIN_KEY en Vercel antes de iniciar sesión.");
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${ADMIN_COOKIE}=${sessionToken(key)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=28800${secure}`;
}

export function clearAdminSessionCookie() {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${ADMIN_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`;
}

export function assertAdminAccess(request) {
  const configuredKey = configuredAdminKey();
  const isProduction = process.env.NODE_ENV === "production";

  if (!configuredKey && !isProduction) return;
  if (!configuredKey) {
    throw new ApiError(
      503,
      "La edición está deshabilitada en producción. Configurá PORTFOLIO_ADMIN_KEY y un almacenamiento persistente."
    );
  }

  if (!verifyAdminKey(request.headers.get("x-admin-key")) && !hasAdminSession(request)) {
    throw new ApiError(401, "Clave de administración incorrecta.");
  }
}

export const assertWriteAccess = assertAdminAccess;

export async function readJson(request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new ApiError(415, "Esta ruta espera un cuerpo JSON.");
  }

  try {
    return await request.json();
  } catch {
    throw new ApiError(400, "El cuerpo JSON no es válido.");
  }
}

