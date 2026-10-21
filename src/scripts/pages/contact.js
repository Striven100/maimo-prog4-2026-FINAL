export function initContactPage() {
  const form = document.querySelector('[data-contact-form]');
  const status = document.querySelector('[data-form-status]');
  if (!(form instanceof HTMLFormElement)) return;

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (status) status.textContent = 'Estado de respuesta probado. No se enviaron datos.';
    form.dataset.state = 'demonstrated';
  });
}
