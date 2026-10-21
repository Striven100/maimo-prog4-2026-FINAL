async function requestStructure(panel) {
  const message = panel.querySelector('[data-api-message]');
  const retry = panel.querySelector('[data-api-retry]');
  panel.dataset.state = 'loading';
  if (message) message.textContent = 'Conectando estructura…';
  if (retry instanceof HTMLButtonElement) retry.hidden = true;

  try {
    const response = await fetch('/api/portfolio.json');
    if (!response.ok) throw new Error('API unavailable');
    const payload = await response.json();
    const isEmpty = payload.meta?.contentStatus === 'empty-by-design';
    panel.dataset.state = isEmpty ? 'empty' : 'content';
    if (message) message.textContent = isEmpty ? 'Back conectado · contenido vacío por diseño' : 'Back conectado';
  } catch {
    panel.dataset.state = 'error';
    if (message) message.textContent = 'No se pudo consultar la estructura';
    if (retry instanceof HTMLButtonElement) retry.hidden = false;
  }
}

export function initApiStatus() {
  const panel = document.querySelector('[data-api-panel]');
  if (!(panel instanceof HTMLElement) || panel.dataset.initialized === 'true') return;
  panel.dataset.initialized = 'true';
  panel.querySelector('[data-api-retry]')?.addEventListener('click', () => requestStructure(panel));
  requestStructure(panel);
}
