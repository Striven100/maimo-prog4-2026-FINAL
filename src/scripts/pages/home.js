export function initHomePage() {
  const button = document.querySelector('[data-view-toggle]');
  const board = document.querySelector('[data-structure-board]');
  if (!(button instanceof HTMLButtonElement) || !(board instanceof HTMLElement)) return;

  button.addEventListener('click', () => {
    const listView = board.dataset.view !== 'list';
    board.dataset.view = listView ? 'list' : 'map';
    button.setAttribute('aria-pressed', String(listView));
    button.textContent = listView ? 'Vista mapa' : 'Vista índice';
  });
}
