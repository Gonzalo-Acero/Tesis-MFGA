document.addEventListener("DOMContentLoaded", () => {
  const loginTab = document.getElementById("login-tab");
  const registerTab = document.getElementById("register-tab");
  const loginPanel = document.getElementById("login-panel");
  const registerPanel = document.getElementById("register-panel");
  const switchToLogin = document.getElementById("switch-to-login");

  const setActiveTab = (tab) => {
    if (!loginTab || !registerTab || !loginPanel || !registerPanel) {
      return;
    }

    const isLogin = tab === "login";
    loginTab.classList.toggle("border-primary", isLogin);
    loginTab.classList.toggle("border-transparent", !isLogin);
    registerTab.classList.toggle("border-primary", !isLogin);
    registerTab.classList.toggle("border-transparent", isLogin);

    loginPanel.classList.toggle("hidden", !isLogin);
    registerPanel.classList.toggle("hidden", isLogin);
  };

  if (loginTab && registerTab) {
    loginTab.addEventListener("click", () => setActiveTab("login"));
    registerTab.addEventListener("click", () => setActiveTab("register"));
  }

  if (switchToLogin) {
    switchToLogin.addEventListener("click", (event) => {
      event.preventDefault();
      setActiveTab("login");
    });
  }

  setActiveTab("login");

  document.addEventListener("mfga:user-registered", () => {
    setActiveTab("login");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const loginForm = document.querySelector("[data-login-form]");
  const loginEmail = document.getElementById("login-email");
  const loginPassword = document.getElementById("login-password");
  const loginEmailError = document.getElementById("login-email-error");
  const loginPasswordError = document.getElementById("login-password-error");

  if (loginEmail && loginEmailError) {
    loginEmail.addEventListener("blur", () => {
      const isValid = /\S+@\S+\.\S+/.test(loginEmail.value.trim());
      loginEmailError.classList.toggle("hidden", isValid);
    });
  }

  if (loginPassword && loginPasswordError) {
    loginPassword.addEventListener("blur", () => {
      const isValid = loginPassword.value.trim().length >= 6;
      loginPasswordError.classList.toggle("hidden", isValid);
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const emailValid = loginEmail ? /\S+@\S+\.\S+/.test(loginEmail.value.trim()) : true;
      const passwordValid = loginPassword ? loginPassword.value.trim().length >= 6 : true;

      if (!emailValid && loginEmailError) {
        loginEmailError.classList.remove("hidden");
      }
      if (!passwordValid && loginPasswordError) {
        loginPasswordError.classList.remove("hidden");
      }

      if (emailValid && passwordValid) {
        // Placeholder: integrate login API when available.
        console.info("Login form submitted", {
          email: loginEmail?.value.trim(),
        });
      }
    });
  }
});
