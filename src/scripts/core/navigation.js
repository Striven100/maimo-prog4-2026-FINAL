export function initNavigation() {
  const toggle = document.querySelector('[data-site-header] .menu-toggle');
  const navigation = document.querySelector('#primary-navigation');
  if (!(toggle instanceof HTMLButtonElement) || !(navigation instanceof HTMLElement)) return;

  toggle.addEventListener('click', () => {
    const nextState = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(nextState));
    navigation.dataset.open = String(nextState);
  });
}
