const resolveApiBaseUrl = () => {
  const candidate =
    window.__API_BASE_URL__ ||
    document.body.getAttribute("data-api-base-url") ||
    "http://localhost:4000/api";
  return candidate.replace(/\/+$/, "");
};

const API_BASE_URL = resolveApiBaseUrl();

const emailRegex = /\S+@\S+\.\S+/;

const setVisibility = (element, hidden) => {
  if (!element) {
    return;
  }
  element.classList.toggle("hidden", hidden);
};

const setFeedback = (form, message, variant) => {
  const feedback = form.querySelector("[data-feedback]");
  if (!feedback) {
    return;
  }

  const baseClasses = "mt-4 px-4 py-3 rounded-lg text-sm font-medium";
  const variants = {
    success: "bg-green-100 text-green-800",
    error: "bg-red-100 text-red-800",
  };

  feedback.className = `${baseClasses} ${variants[variant] ?? ""}`;
  feedback.textContent = message;
  feedback.classList.remove("hidden");
};

const clearFeedback = (form) => {
  const feedback = form.querySelector("[data-feedback]");
  if (feedback) {
    feedback.classList.add("hidden");
    feedback.textContent = "";
  }
};

const getFormValues = (form) => {
  const valueOf = (selector) =>
    form.querySelector(selector)?.value.trim() ?? "";

  return {
    Name: valueOf("#register-name"),
    Email: valueOf("#register-email"),
    PhoneNumber: valueOf("#register-phone"),
    Password: valueOf("#register-password"),
    PasswordConfirmation: valueOf("#register-confirm"),
    TermsAccepted: form.querySelector("#terms-check")?.checked ?? false,
  };
};

const toggleButtonState = (button, loading) => {
  if (!button) {
    return;
  }

  button.disabled = loading;
  button.classList.toggle("opacity-70", loading);
  button.classList.toggle("cursor-not-allowed", loading);

  if (loading) {
    button.dataset.originalHtml = button.dataset.originalHtml || button.innerHTML;
    button.innerHTML = `<svg class="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg> Registering...`;
  } else if (button.dataset.originalHtml) {
    button.innerHTML = button.dataset.originalHtml;
    delete button.dataset.originalHtml;
    if (window.feather?.replace) {
      window.feather.replace();
    }
  }
};

const validateInputs = (form, values) => {
  let valid = true;

  const show = (selector, condition) => {
    const element = form.querySelector(selector);
    if (!element) {
      return;
    }
    setVisibility(element, condition);
    valid = condition && valid;
  };

  show("#register-name-error", Boolean(values.Name));
  show("#register-email-error", emailRegex.test(values.Email));
  const passwordValid = values.Password.length >= 8;
  show("#register-password-error", passwordValid);
  show("#register-confirm-error", passwordValid && values.Password === values.PasswordConfirmation);

  const hasTerms = form.querySelector("#register-terms-error");
  if (hasTerms) {
    show("#register-terms-error", values.TermsAccepted);
  }

  return valid;
};

const resetErrors = (form) => {
  form
    .querySelectorAll(
      "#register-name-error, #register-email-error, #register-password-error, #register-confirm-error, #register-terms-error",
    )
    .forEach((element) => setVisibility(element, true));
};

const attachRegisterHandlers = () => {
  const forms = Array.from(document.querySelectorAll("[data-register-form]"));
  if (!forms.length) {
    return;
  }

  forms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      resetErrors(form);
      clearFeedback(form);

      const submitButton = form.querySelector("[data-register-submit]");
      const values = getFormValues(form);

      const isValid = validateInputs(form, values);
      if (!isValid) {
        setFeedback(form, "Please review the highlighted fields.", "error");
        return;
      }

      toggleButtonState(submitButton, true);

      try {
        const response = await fetch(`${API_BASE_URL}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Name: values.Name,
            Email: values.Email,
            PhoneNumber: values.PhoneNumber || null,
            Password: values.Password,
          }),
        });

        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          const message =
            typeof payload?.error === "string"
              ? payload.error
              : "We could not register your account. Please try again.";
          throw new Error(message);
        }

        try {
          window.localStorage.setItem("mfgaCurrentUser", JSON.stringify(payload));
        } catch (storageError) {
          console.warn("Could not persist mfgaCurrentUser", storageError);
        }

        setFeedback(form, "Registration completed! You can log in now.", "success");
        resetErrors(form);
        form.reset();
        document.dispatchEvent(
          new CustomEvent("mfga:user-registered", {
            detail: payload,
          }),
        );
      } catch (error) {
        console.error("Registration failed", error);
        setFeedback(
          form,
          error instanceof Error ? error.message : "Unexpected error while registering.",
          "error",
        );
      } finally {
        toggleButtonState(submitButton, false);
      }
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  attachRegisterHandlers();
});
