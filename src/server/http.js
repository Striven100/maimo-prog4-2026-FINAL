export class ApiError extends Error {
  constructor(status, message, details = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
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

export function assertWriteAccess(request) {
  const configuredKey = process.env.PORTFOLIO_ADMIN_KEY?.trim();
  const isProduction = process.env.NODE_ENV === "production";

  if (!configuredKey && !isProduction) return;
  if (!configuredKey) {
    throw new ApiError(
      503,
      "La edición está deshabilitada en producción. Configurá PORTFOLIO_ADMIN_KEY y un almacenamiento persistente."
    );
  }

  if (request.headers.get("x-admin-key") !== configuredKey) {
    throw new ApiError(401, "Clave de administración incorrecta.");
  }
}

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
