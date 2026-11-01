import {
  ApiError,
  apiError,
  clearAdminSessionCookie,
  createAdminSessionCookie,
  hasAdminSession,
  isAdminConfigured,
  json,
  readJson,
  verifyAdminKey
} from "../../../server/http.js";
import { getStorageStatus } from "../../../server/portfolio.repository.js";

export const prerender = false;

export async function GET({ request }) {
  return json({
    ok: true,
    data: {
      configured: isAdminConfigured(),
      authenticated: hasAdminSession(request),
      storage: getStorageStatus()
    }
  });
}

export async function POST({ request }) {
  try {
    const body = await readJson(request);
    if (!isAdminConfigured()) throw new ApiError(503, "La clave de administración todavía no está configurada en Vercel.");
    if (!verifyAdminKey(body.key)) throw new ApiError(401, "La clave ingresada no es correcta.");
    return json(
      { ok: true, data: { authenticated: true } },
      200,
      { "set-cookie": createAdminSessionCookie() }
    );
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE() {
  return json(
    { ok: true, data: { authenticated: false } },
    200,
    { "set-cookie": clearAdminSessionCookie() }
  );
}
