const dataNode = document.getElementById("admin-data");
const portfolio = dataNode ? JSON.parse(dataNode.textContent || "{}") : {};
const toast = document.querySelector("[data-admin-toast]");

function notify(message, type = "success") {
  if (!toast) return;
  toast.textContent = message;
  toast.dataset.type = type;
  toast.hidden = false;
  window.clearTimeout(notify.timer);
  notify.timer = window.setTimeout(() => {
    toast.hidden = true;
  }, 4500);
}

async function apiFetch(url, options = {}) {
  const headers = new Headers(options.headers || {});

  const response = await fetch(url, { ...options, headers });
  let payload;
  try {
    payload = await response.json();
  } catch {
    payload = { error: "La API devolvió una respuesta no válida." };
  }
  if (!response.ok) throw new Error(payload.error || `Error ${response.status}`);
  return payload;
}

function activateTab(name) {
  document.querySelectorAll("[data-admin-tab]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.adminTab === name);
  });
  document.querySelectorAll("[data-admin-view]").forEach((view) => {
    const active = view.dataset.adminView === name;
    view.classList.toggle("is-active", active);
    view.hidden = !active;
  });
  history.replaceState(null, "", `#${name}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll("[data-admin-tab]").forEach((button) => {
  button.addEventListener("click", () => activateTab(button.dataset.adminTab));
});
document.querySelectorAll("[data-go-tab]").forEach((button) => {
  button.addEventListener("click", () => activateTab(button.dataset.goTab));
});

const requestedTab = location.hash.slice(1);
if (document.querySelector(`[data-admin-view="${requestedTab}"]`)) activateTab(requestedTab);

function setValue(form, name, value) {
  const field = form.elements.namedItem(name);
  if (!field) return;
  if (field instanceof RadioNodeList) return;
  if (field.type === "checkbox") {
    field.checked = Boolean(value);
  } else if (field.type !== "file") {
    field.value = Array.isArray(value) ? value.join("\n") : (value ?? "");
  }
}

function formObject(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function startBusy(form, busy, label = "Guardando…") {
  form.setAttribute("aria-busy", String(busy));
  form.querySelectorAll("button, input, select, textarea").forEach((element) => {
    if (element.type !== "hidden") element.disabled = busy;
  });
  const submitLabel = form.querySelector("[data-submit-label]");
  if (submitLabel) {
    if (!submitLabel.dataset.defaultText) submitLabel.dataset.defaultText = submitLabel.textContent;
    submitLabel.textContent = busy ? label : submitLabel.dataset.defaultText;
  }
}

function focusForm(form) {
  form.scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(() => form.querySelector("input:not([type=hidden]), textarea, select")?.focus(), 350);
}

const projectForm = document.querySelector("[data-project-form]");
let projectMedia = { gallery: [], pdfs: [], coverImage: "" };

function syncProjectMedia() {
  if (!projectForm) return;
  setValue(projectForm, "existingGallery", JSON.stringify(projectMedia.gallery));
  setValue(projectForm, "existingPdfs", JSON.stringify(projectMedia.pdfs));
}

function moveMedia(kind, index, direction) {
  const list = projectMedia[kind];
  const nextIndex = index + direction;
  if (!list?.[index] || nextIndex < 0 || nextIndex >= list.length) return;
  [list[index], list[nextIndex]] = [list[nextIndex], list[index]];
  renderProjectMedia();
}

function mediaRow(item, index, kind) {
  const row = document.createElement("article");
  row.className = "admin-media-item";

  const preview = document.createElement(kind === "gallery" ? "img" : "span");
  if (preview instanceof HTMLImageElement) {
    preview.src = item.url;
    preview.alt = "";
  } else {
    preview.textContent = "PDF";
  }

  const field = document.createElement("label");
  field.textContent = kind === "gallery" ? "Texto alternativo" : "Título";
  const input = document.createElement("input");
  input.value = kind === "gallery" ? (item.alt || "") : (item.title || item.name || "");
  input.addEventListener("input", () => {
    projectMedia[kind][index][kind === "gallery" ? "alt" : "title"] = input.value;
    syncProjectMedia();
  });
  field.append(input);

  const actions = document.createElement("div");
  actions.className = "admin-media-item__actions";
  [
    ["↑", -1, "Subir"],
    ["↓", 1, "Bajar"]
  ].forEach(([symbol, direction, label]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = symbol;
    button.title = label;
    button.disabled = direction === -1 ? index === 0 : index === projectMedia[kind].length - 1;
    button.addEventListener("click", () => moveMedia(kind, index, direction));
    actions.append(button);
  });
  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "is-danger";
  remove.textContent = "Quitar";
  remove.addEventListener("click", () => {
    projectMedia[kind].splice(index, 1);
    renderProjectMedia();
  });
  actions.append(remove);

  row.append(preview, field, actions);
  return row;
}

function renderMediaGroup(container, kind, label) {
  if (!container) return;
  container.replaceChildren();
  const items = projectMedia[kind];
  if (!items.length) return;
  const title = document.createElement("strong");
  title.textContent = `${label} · ${items.length}`;
  container.append(title, ...items.map((item, index) => mediaRow(item, index, kind)));
}

function renderProjectMedia() {
  if (!projectForm) return;
  const files = projectForm.querySelector("[data-project-files]");
  const coverRemove = projectForm.querySelector("[data-cover-remove]");
  renderMediaGroup(projectForm.querySelector("[data-gallery-manager]"), "gallery", "Galería");
  renderMediaGroup(projectForm.querySelector("[data-pdf-manager]"), "pdfs", "Documentos");
  const hasMedia = Boolean(projectMedia.coverImage || projectMedia.gallery.length || projectMedia.pdfs.length);
  files.hidden = !hasMedia;
  coverRemove.hidden = !projectMedia.coverImage;
  if (!projectMedia.coverImage) {
    const checkbox = coverRemove.querySelector("input");
    if (checkbox) checkbox.checked = false;
  }
  syncProjectMedia();
}

function resetProjectForm() {
  if (!projectForm) return;
  projectForm.reset();
  setValue(projectForm, "id", "");
  setValue(projectForm, "order", 99);
  setValue(projectForm, "visible", true);
  projectForm.querySelector("[data-project-form-kicker]").textContent = "Nuevo proyecto";
  projectForm.querySelector("[data-project-form-title]").textContent = "Crear ficha";
  projectForm.querySelector("[data-submit-label]").textContent = "Guardar proyecto";
  setValue(projectForm, "accent", "#3151ff");
  setValue(projectForm, "year", new Date().getFullYear());
  projectMedia = { gallery: [], pdfs: [], coverImage: "" };
  renderProjectMedia();
}

document.querySelectorAll("[data-form-reset=project], [data-new-record=project]").forEach((button) => {
  button.addEventListener("click", () => {
    activateTab("projects");
    resetProjectForm();
    focusForm(projectForm);
  });
});

document.querySelectorAll("[data-edit-project]").forEach((button) => {
  button.addEventListener("click", () => {
    const project = portfolio.projects.find((item) => item.id === button.dataset.editProject);
    if (!project || !projectForm) return;
    const values = {
      ...project,
      liveUrl: project.links?.live,
      repositoryUrl: project.links?.repository,
      caseStudyUrl: project.links?.caseStudy
    };
    Object.entries(values).forEach(([name, value]) => setValue(projectForm, name, value));
    projectForm.querySelector("[data-project-form-kicker]").textContent = "Editar proyecto";
    projectForm.querySelector("[data-project-form-title]").textContent = project.title;
    projectForm.querySelector("[data-submit-label]").textContent = "Actualizar proyecto";

    projectMedia = {
      gallery: structuredClone(project.gallery || []),
      pdfs: structuredClone(project.pdfs || []),
      coverImage: project.coverImage || ""
    };
    renderProjectMedia();
    focusForm(projectForm);
  });
});

projectForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const id = projectForm.elements.namedItem("id").value;
  const body = new FormData(projectForm);
  body.delete("id");
  if (!projectForm.elements.namedItem("featured").checked) body.set("featured", "false");
  if (!projectForm.elements.namedItem("visible").checked) body.set("visible", "false");

  try {
    startBusy(projectForm, true);
    await apiFetch(id ? `/api/projects/${id}` : "/api/projects", { method: id ? "PUT" : "POST", body });
    notify(id ? "Proyecto actualizado correctamente." : "Proyecto creado correctamente.");
    window.setTimeout(() => location.reload(), 650);
  } catch (error) {
    notify(error.message, "error");
    startBusy(projectForm, false);
  }
});

const experienceForm = document.querySelector("[data-experience-form]");
const currentRole = experienceForm?.querySelector("[data-current-role]");
const endDate = experienceForm?.querySelector("[data-end-date]");

function syncCurrentRole() {
  if (!currentRole || !endDate) return;
  endDate.disabled = currentRole.checked;
  if (currentRole.checked) endDate.value = "";
}
currentRole?.addEventListener("change", syncCurrentRole);

function resetExperienceForm() {
  if (!experienceForm) return;
  experienceForm.reset();
  setValue(experienceForm, "id", "");
  setValue(experienceForm, "order", 99);
  setValue(experienceForm, "visible", true);
  experienceForm.querySelector("[data-experience-form-kicker]").textContent = "Nueva experiencia";
  experienceForm.querySelector("[data-experience-form-title]").textContent = "Completar perfil";
  experienceForm.querySelector("[data-submit-label]").textContent = "Guardar experiencia";
  syncCurrentRole();
}

document.querySelectorAll("[data-form-reset=experience], [data-new-record=experience]").forEach((button) => {
  button.addEventListener("click", () => {
    activateTab("experiences");
    resetExperienceForm();
    focusForm(experienceForm);
  });
});

document.querySelectorAll("[data-edit-experience]").forEach((button) => {
  button.addEventListener("click", () => {
    const experience = portfolio.experiences.find((item) => item.id === button.dataset.editExperience);
    if (!experience || !experienceForm) return;
    Object.entries(experience).forEach(([name, value]) => setValue(experienceForm, name, value));
    experienceForm.querySelector("[data-experience-form-kicker]").textContent = "Editar experiencia";
    experienceForm.querySelector("[data-experience-form-title]").textContent = experience.role;
    experienceForm.querySelector("[data-submit-label]").textContent = "Actualizar experiencia";
    syncCurrentRole();
    focusForm(experienceForm);
  });
});

experienceForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const id = experienceForm.elements.namedItem("id").value;
  const body = formObject(experienceForm);
  delete body.id;
  body.current = experienceForm.elements.namedItem("current").checked;
  body.visible = experienceForm.elements.namedItem("visible").checked;

  try {
    startBusy(experienceForm, true);
    await apiFetch(id ? `/api/experiences/${id}` : "/api/experiences", {
      method: id ? "PUT" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body)
    });
    notify(id ? "Experiencia actualizada correctamente." : "Experiencia añadida correctamente.");
    window.setTimeout(() => location.reload(), 650);
  } catch (error) {
    notify(error.message, "error");
    startBusy(experienceForm, false);
  }
});

function resetGenericForm(section) {
  const form = document.querySelector(`[data-generic-form="${section}"]`);
  if (!form) return;
  form.reset();
  setValue(form, "id", "");
  setValue(form, "order", 99);
  setValue(form, "visible", true);
  form.querySelector("[data-generic-form-mode]").textContent = "Nuevo";
}

document.querySelectorAll("[data-reset-generic]").forEach((button) => {
  button.addEventListener("click", () => resetGenericForm(button.dataset.resetGeneric));
});

document.querySelectorAll("[data-edit-generic]").forEach((button) => {
  button.addEventListener("click", () => {
    const { section, id } = button.dataset;
    const record = portfolio[section]?.find((item) => item.id === id);
    const form = document.querySelector(`[data-generic-form="${section}"]`);
    if (!record || !form) return;
    Object.entries(record).forEach(([name, value]) => setValue(form, name, value));
    form.querySelector("[data-generic-form-mode]").textContent = "Editar";
    focusForm(form);
  });
});

document.querySelectorAll("[data-generic-form]").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const section = form.dataset.genericForm;
    const body = formObject(form);
    const id = body.id;
    delete body.id;
    body.visible = form.elements.namedItem("visible").checked;

    try {
      startBusy(form, true);
      await apiFetch(id ? `/api/content/${section}/${id}` : `/api/content/${section}`, {
        method: id ? "PUT" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body)
      });
      notify(id ? "Dato actualizado correctamente." : "Dato añadido correctamente.");
      window.setTimeout(() => location.reload(), 650);
    } catch (error) {
      notify(error.message, "error");
      startBusy(form, false);
    }
  });
});

document.querySelectorAll("[data-delete-record]").forEach((button) => {
  button.addEventListener("click", async () => {
    const { section, id, name } = button.dataset;
    const confirmed = window.confirm(`¿Eliminar “${name}”? Esta acción no se puede deshacer desde el panel.`);
    if (!confirmed) return;
    const url = section === "projects" || section === "experiences"
      ? `/api/${section}/${id}`
      : `/api/content/${section}/${id}`;
    try {
      button.disabled = true;
      await apiFetch(url, { method: "DELETE" });
      notify("Registro eliminado correctamente.");
      window.setTimeout(() => location.reload(), 650);
    } catch (error) {
      notify(error.message, "error");
      button.disabled = false;
    }
  });
});

async function submitSingleton(form, endpoint, successMessage) {
  const body = formObject(form);
  try {
    startBusy(form, true);
    await apiFetch(endpoint, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body)
    });
    notify(successMessage);
  } catch (error) {
    notify(error.message, "error");
  } finally {
    startBusy(form, false);
  }
}

document.querySelectorAll("[data-site-form], [data-site-contact-form]").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const body = { ...(portfolio.site || {}), ...formObject(form) };
    try {
      startBusy(form, true);
      const payload = await apiFetch("/api/site", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body)
      });
      portfolio.site = payload.data;
      notify("Textos de la página actualizados correctamente.");
      window.setTimeout(() => location.reload(), 650);
    } catch (error) {
      notify(error.message, "error");
      startBusy(form, false);
    }
  });
});

document.querySelector("[data-profile-form]")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const body = new FormData(form);
  startBusy(form, true);
  apiFetch("/api/profile", { method: "PUT", body })
    .then(() => {
      notify("Perfil actualizado correctamente.");
      window.setTimeout(() => location.reload(), 650);
    })
    .catch((error) => {
      notify(error.message, "error");
      startBusy(form, false);
    });
});
document.querySelector("[data-contact-form]")?.addEventListener("submit", (event) => {
  event.preventDefault();
  submitSingleton(event.currentTarget, "/api/contact", "Contacto actualizado correctamente.");
});

document.querySelector("[data-admin-logout]")?.addEventListener("click", async () => {
  try {
    await apiFetch("/api/admin/session", { method: "DELETE" });
    location.href = "/admin/login";
  } catch (error) {
    notify(error.message, "error");
  }
});
