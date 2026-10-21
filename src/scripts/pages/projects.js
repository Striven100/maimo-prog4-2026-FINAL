export function initProjectsPage() {
  const buttons = [...document.querySelectorAll('[data-project-filter]')];
  const cards = [...document.querySelectorAll('[data-placeholder-card]')];
  const status = document.querySelector('[data-project-count]');

  buttons.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.projectFilter || 'all';
    let visible = 0;
    buttons.forEach(item => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    cards.forEach(card => {
      const show = filter === 'all' || card.dataset.type === filter;
      card.hidden = !show;
      if (show) visible += 1;
    });
    if (status) status.textContent = `${visible} ${visible === 1 ? 'bloque visible' : 'bloques visibles'}`;
  }));
}
