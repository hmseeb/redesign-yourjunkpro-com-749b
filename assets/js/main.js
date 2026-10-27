/* Your Junk Pro — site scripts */
(function () {
  "use strict";

  /* ---------------------------------------------------- mobile nav --- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* -------------------------------------------------------- forms ---- */
  var forms = document.querySelectorAll("form[data-leadr-form]");
  var SUCCESS = "Thanks, your message was sent. We'll get back to you shortly with your free estimate.";

  // Current page URL, without a leftover ?submitted=1 from an earlier post.
  function pageUrl() {
    var href = window.location.href;
    var clean = href
      .replace(/([?&])submitted=1&/, "$1")
      .replace(/[?&]submitted=1\b/, "");
    return clean || href;
  }

  function stampPageFields(scope) {
    Array.prototype.forEach.call(scope.querySelectorAll('input[name="_page"]'), function (input) {
      input.value = pageUrl();
    });
  }

  // Stamp the page URL into every _page field (works before submit).
  stampPageFields(document);

  function statusBox(form) {
    var card = form.closest ? form.closest(".form-card") : null;
    return form.querySelector(".form-status") || (card || form.parentNode).querySelector(".form-status");
  }

  function showStatus(form, message, kind) {
    var box = statusBox(form);
    if (!box) return;
    box.textContent = message;
    box.classList.remove("is-success", "is-error");
    box.classList.add("is-visible", kind === "error" ? "is-error" : "is-success");
    box.setAttribute("role", "status");
    try {
      box.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (e) {
      box.scrollIntoView();
    }
  }

  // If the visitor came back from a plain (non-JS) submission, confirm it.
  if (window.location.search.indexOf("submitted=1") !== -1) {
    Array.prototype.forEach.call(forms, function (form) {
      showStatus(form, SUCCESS, "success");
    });
  }

  Array.prototype.forEach.call(forms, function (form) {
    form.addEventListener("submit", function (event) {
      if (!window.fetch || !form.reportValidity || !form.reportValidity()) {
        return; // fall back to a normal browser POST
      }
      event.preventDefault();

      var button = form.querySelector('button[type="submit"]');
      var label = button ? button.textContent : "";
      if (button) {
        button.disabled = true;
        button.textContent = "Sending…";
      }

      var data = {};
      var entries = new FormData(form);
      entries.forEach(function (value, key) {
        if (typeof value === "string") data[key] = value;
      });
      data._page = pageUrl();

      fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data)
      })
        .then(function (response) {
          return response.json().catch(function () {
            return { ok: response.ok };
          });
        })
        .then(function (result) {
          if (result && result.ok) {
            form.reset();
            stampPageFields(form);
            showStatus(form, SUCCESS, "success");
          } else {
            throw new Error("Submission rejected");
          }
        })
        .catch(function () {
          showStatus(
            form,
            "Sorry, something went wrong sending your request. Please call us at 813-731-0155 or email bookyourjunkpro@gmail.com.",
            "error"
          );
        })
        .then(function () {
          if (button) {
            button.disabled = false;
            button.textContent = label;
          }
        });
    });
  });

  /* ------------------------------------------------ footer year ------ */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
