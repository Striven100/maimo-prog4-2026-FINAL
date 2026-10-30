import { apiError, json } from "../../server/http.js";
import { getPublicPortfolio } from "../../server/portfolio.repository.js";

export const prerender = false;

export async function GET() {
  try {
    return json({ ok: true, data: await getPublicPortfolio() });
  } catch (error) {
    return apiError(error);
  }
}
