// Daybook landing page interactions. No dependencies.
(() => {
  "use strict";
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  // ---- Footer year ----
  $("#year").textContent = new Date().getFullYear();

  // ---- Mobile menu ----
  const toggle = $("#navToggle");
  const menu = $("#menu");
  const setMenu = (open) => {
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "Close" : "Menu";
  };
  toggle.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
  menu.addEventListener("click", (e) => e.target.closest("a") && setMenu(false));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

  // ---- Pricing: monthly / yearly toggle ----
  $$(".switch button").forEach((btn) =>
    btn.addEventListener("click", () => {
      const period = btn.dataset.billing; // "monthly" | "yearly"
      $$(".switch button").forEach((b) => {
        const on = b === btn;
        b.classList.toggle("is-on", on);
        b.setAttribute("aria-pressed", String(on));
      });
      $$(".plan__price span").forEach((s) => (s.textContent = s.dataset[period]));
    })
  );

  // ---- Pricing buttons pre-select the plan in the form ----
  $$("[data-plan]").forEach((btn) =>
    btn.addEventListener("click", () => ($("#plan").value = btn.dataset.plan))
  );

  // ---- Demo form ----
  const form = $("#demoForm");
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // Returns an object of error messages keyed by field name.
  function validate({ name, email, message }) {
    const errors = {};
    if (name.trim().length < 2) errors.name = "Enter your name (at least 2 characters).";
    if (!EMAIL_RE.test(email.trim())) errors.email = "Enter a valid email, like you@company.com.";
    if (message.trim().length < 10) errors.message = "Tell us a little more (at least 10 characters).";
    return errors;
  }

  function showError(field, msg = "") {
    $(`#${field}-err`).textContent = msg;
    $(`#${field}`).setAttribute("aria-invalid", msg ? "true" : "false");
  }

  const values = () => ({ name: form.name.value, email: form.email.value, message: form.message.value });

  // Once a field shows an error, re-check it live as the user types.
  ["name", "email", "message"].forEach((f) =>
    form[f].addEventListener("input", () => {
      if (form[f].getAttribute("aria-invalid") === "true") showError(f, validate(values())[f]);
    })
  );

  let submitting = false;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (submitting) return; // guard against double submit
    const errors = validate(values());
    ["name", "email", "message"].forEach((f) => showError(f, errors[f]));
    const firstBad = Object.keys(errors)[0];
    if (firstBad) return form[firstBad].focus();

    // Simulated request (no backend required).
    submitting = true;
    const btn = $("#submitBtn");
    btn.disabled = true;
    btn.textContent = "Sending…";
    setTimeout(() => {
      $("#successName").textContent = form.name.value.trim().split(" ")[0];
      $("#successEmail").textContent = form.email.value.trim();
      form.hidden = true;
      $("#success").hidden = false;
      submitting = false;
    }, 900);
  });

  $("#resetBtn").addEventListener("click", () => {
    form.reset();
    ["name", "email", "message"].forEach((f) => showError(f));
    $("#submitBtn").disabled = false;
    $("#submitBtn").textContent = "Request demo";
    $("#success").hidden = true;
    form.hidden = false;
    form.name.focus();
  });
})();
