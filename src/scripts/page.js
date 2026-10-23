const openButtons = document.querySelectorAll("[data-dialog-open]");
const dialogs = document.querySelectorAll("[data-project-dialog]");
const closeButtons = document.querySelectorAll("[data-dialog-close]");
let returnFocus = null;

function openDialog(button) {
  const dialog = document.getElementById(button.dataset.dialogOpen);
  if (!(dialog instanceof HTMLDialogElement)) return;

  returnFocus = button;
  dialog.showModal();
  document.body.dataset.modalOpen = "true";
}

function closeDialog(dialog) {
  if (!(dialog instanceof HTMLDialogElement) || !dialog.open) return;
  dialog.close();
}

openButtons.forEach((button) => {
  button.addEventListener("click", () => openDialog(button));
});

closeButtons.forEach((button) => {
  button.addEventListener("click", () => closeDialog(button.closest("dialog")));
});

dialogs.forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog(dialog);
  });

  dialog.addEventListener("close", () => {
    delete document.body.dataset.modalOpen;
    if (returnFocus instanceof HTMLElement) returnFocus.focus();
    returnFocus = null;
  });
});

const filterButtons = document.querySelectorAll("[data-project-filter]");
const projectCards = document.querySelectorAll("[data-project-card]");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.projectFilter;

    filterButtons.forEach((item) => {
      item.setAttribute("aria-pressed", String(item === button));
    });

    projectCards.forEach((card) => {
      const tags = card.dataset.projectTags?.split(" ") ?? [];
      card.hidden = filter !== "all" && !tags.includes(filter);
    });
  });
});

const navigationLinks = document.querySelectorAll("[data-nav-link]");
const sections = document.querySelectorAll("[data-section]");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navigationLinks.forEach((link) => {
      const active = link.dataset.navLink === visible.target.dataset.section;
      link.toggleAttribute("aria-current", active);
    });
  },
  { rootMargin: "-25% 0px -60% 0px", threshold: [0, 0.15, 0.4] }
);

sections.forEach((section) => sectionObserver.observe(section));

