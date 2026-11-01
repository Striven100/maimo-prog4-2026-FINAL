const form = document.querySelector("[data-admin-login]");
const errorNode = document.querySelector("[data-login-error]");

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submit = form.querySelector("button[type=submit]");
  const key = new FormData(form).get("key");
  errorNode.hidden = true;
  submit.disabled = true;
  submit.setAttribute("aria-busy", "true");

  try {
    const response = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ key })
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "No fue posible iniciar sesión.");
    location.href = "/admin";
  } catch (error) {
    errorNode.textContent = error.message;
    errorNode.hidden = false;
    submit.disabled = false;
    submit.removeAttribute("aria-busy");
  }
});
