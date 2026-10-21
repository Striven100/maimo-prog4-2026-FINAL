import { getPortfolioStructure } from '../../server/portfolio.service.js';

export const prerender = false;

export async function GET({ url }) {
  const requestedState = url.searchParams.get('state');
  if (requestedState === 'error') {
    return new Response(JSON.stringify({ message: 'Error controlado de la etapa estructural.' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

  return new Response(JSON.stringify(getPortfolioStructure()), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
    }
  });
}
