export function initProfilePage() {
  const shell = document.querySelector('[data-profile-shell]');
  if (shell instanceof HTMLElement) shell.dataset.module = 'profile-ready';
}
