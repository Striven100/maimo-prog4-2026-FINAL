const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const openButtons = document.querySelectorAll("[data-dialog-open]");
const dialogs = document.querySelectorAll("[data-portfolio-dialog]");
const closeButtons = document.querySelectorAll("[data-dialog-close]");
let returnFocus = null;
let previousHash = "";

function openDialog(button, updateHash = true) {
  const dialog = document.getElementById(button.dataset.dialogOpen);
  if (!(dialog instanceof HTMLDialogElement)) return;
  returnFocus = button;
  previousHash = location.hash;
  dialog.classList.remove("is-closing");
  dialog.showModal();
  document.body.dataset.modalOpen = "true";
  document.dispatchEvent(new CustomEvent("portfolio:modal", { detail: { open: true } }));
  if (updateHash) history.replaceState(null, "", `#${dialog.id}`);
}

function closeDialog(dialog) {
  if (!(dialog instanceof HTMLDialogElement) || !dialog.open || dialog.classList.contains("is-closing")) return;
  if (prefersReducedMotion.matches) {
    dialog.close();
    return;
  }
  dialog.classList.add("is-closing");
  window.setTimeout(() => dialog.open && dialog.close(), 170);
}

openButtons.forEach((button) => button.addEventListener("click", () => openDialog(button)));
closeButtons.forEach((button) => button.addEventListener("click", () => closeDialog(button.closest("dialog"))));
dialogs.forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog(dialog);
  });
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeDialog(dialog);
  });
  dialog.addEventListener("close", () => {
    dialog.classList.remove("is-closing");
    delete document.body.dataset.modalOpen;
    document.dispatchEvent(new CustomEvent("portfolio:modal", { detail: { open: false } }));
    if (location.hash === `#${dialog.id}`) history.replaceState(null, "", previousHash || location.pathname);
    if (returnFocus instanceof HTMLElement) returnFocus.focus();
    returnFocus = null;
  });
  dialog.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener("click", () => closeDialog(dialog)));
});

const deepLinkedDialog = location.hash
  ? document.querySelector(`[data-dialog-open="${CSS.escape(location.hash.slice(1))}"]`)
  : null;
if (deepLinkedDialog) openDialog(deepLinkedDialog, false);

const filterButtons = document.querySelectorAll("[data-project-filter]");
const projectCards = document.querySelectorAll("[data-project-card]");
const projectEmpty = document.querySelector("[data-project-empty]");
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.projectFilter;
    let visibleCount = 0;
    filterButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    projectCards.forEach((card) => {
      const tags = card.dataset.projectTags?.split(" ") ?? [];
      const visible = filter === "all" || tags.includes(filter);
      card.hidden = !visible;
      if (visible) visibleCount += 1;
      if (visible) card.animate?.([{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }], { duration: 260, easing: "cubic-bezier(.2,.8,.2,1)" });
    });
    if (projectEmpty) projectEmpty.hidden = visibleCount > 0;
  });
});

document.querySelectorAll("[data-case-preview]").forEach((preview) => {
  const tabs = [...preview.querySelectorAll("[data-case-tab]")];
  const frames = [...preview.querySelectorAll("[data-case-frame]")];
  const viewport = preview.querySelector("[data-case-viewport]");
  const activate = (index, focus = false) => {
    tabs.forEach((tab, tabIndex) => {
      const selected = tabIndex === index;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && focus) tab.focus();
    });
    frames.forEach((frame, frameIndex) => {
      const selected = frameIndex === index;
      frame.hidden = !selected;
      frame.classList.toggle("is-active", selected);
      if (selected && viewport) viewport.dataset.mode = frame.dataset.caseMode || "mobile";
    });
    viewport?.scrollTo({ top: 0, behavior: prefersReducedMotion.matches ? "auto" : "smooth" });
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activate(index));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
      activate(next, true);
    });
  });
  activate(0);
});

const navigationLinks = document.querySelectorAll("[data-nav-link]");
const sections = document.querySelectorAll("[data-section]");
const sectionObserver = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  navigationLinks.forEach((link) => link.toggleAttribute("aria-current", link.dataset.navLink === visible.target.dataset.section));
}, { rootMargin: "-25% 0px -60% 0px", threshold: [0, 0.15, 0.4] });
sections.forEach((section) => sectionObserver.observe(section));

document.querySelectorAll("[data-project-gallery]").forEach((gallery) => {
  const frames = [...gallery.querySelectorAll("[data-gallery-frame]")];
  const counter = gallery.querySelector("[data-gallery-current]");
  if (frames.length < 2) return;
  let activeIndex = 0;
  let timer;
  let modalOpen = false;
  const autoplay = gallery.dataset.autoplay !== "false" && !prefersReducedMotion.matches;
  const show = (nextIndex) => {
    frames[activeIndex].classList.remove("is-active");
    activeIndex = (nextIndex + frames.length) % frames.length;
    frames[activeIndex].classList.add("is-active");
    if (counter) counter.textContent = String(activeIndex + 1).padStart(2, "0");
  };
  const stop = () => window.clearInterval(timer);
  const start = () => {
    stop();
    if (!autoplay || modalOpen || document.hidden) return;
    timer = window.setInterval(() => show(activeIndex + 1), 3600);
  };
  gallery.querySelector("[data-gallery-prev]")?.addEventListener("click", () => show(activeIndex - 1));
  gallery.querySelector("[data-gallery-next]")?.addEventListener("click", () => show(activeIndex + 1));
  gallery.addEventListener("mouseenter", stop);
  gallery.addEventListener("mouseleave", start);
  gallery.addEventListener("focusin", stop);
  gallery.addEventListener("focusout", start);
  document.addEventListener("portfolio:modal", (event) => { modalOpen = event.detail.open; modalOpen ? stop() : start(); });
  document.addEventListener("visibilitychange", start);
  start();
});

document.addEventListener("keydown", (event) => {
  const dialog = document.querySelector("[data-project-dialog][open]");
  if (!dialog) return;
  if (event.key === "ArrowLeft") dialog.querySelector("[data-gallery-prev]")?.click();
  if (event.key === "ArrowRight") dialog.querySelector("[data-gallery-next]")?.click();
});

const revealItems = document.querySelectorAll("[data-reveal]");
if (prefersReducedMotion.matches) {
  revealItems.forEach((item) => item.classList.add("is-revealed"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-revealed");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
  revealItems.forEach((item) => revealObserver.observe(item));
}

const progress = document.querySelector("[data-page-progress]");
const topbar = document.querySelector("[data-topbar]");
function updateScrollState() {
  const available = document.documentElement.scrollHeight - innerHeight;
  const ratio = available > 0 ? Math.min(1, scrollY / available) : 0;
  if (progress) progress.style.transform = `scaleX(${ratio})`;
  topbar?.classList.toggle("is-scrolled", scrollY > 20);
}
addEventListener("scroll", updateScrollState, { passive: true });
updateScrollState();

const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
function setMenu(open) {
  if (!menuToggle || !mobileMenu) return;
  menuToggle.setAttribute("aria-expanded", String(open));
  mobileMenu.hidden = !open;
  document.body.dataset.menuOpen = open ? "true" : "false";
}
menuToggle?.addEventListener("click", () => setMenu(menuToggle.getAttribute("aria-expanded") !== "true"));
document.querySelectorAll("[data-mobile-link]").forEach((link) => link.addEventListener("click", () => setMenu(false)));
addEventListener("resize", () => { if (innerWidth > 840) setMenu(false); });
