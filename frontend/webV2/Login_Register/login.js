import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://TU-PROYECTO.supabase.co'; // <- replace
const SUPABASE_ANON_KEY = 'TU_ANON_KEY'; // <- replace

// Resolve base URL for the custom API
const resolveApiBaseUrl = () => {
  const candidate =
    window._API_BASE_URL_ ||
    window.__API_BASE_URL__ ||
    document.body.getAttribute("data-api-base-url") ||
    "http://localhost:4000/api";
  return candidate.replace(/\/+$/, "");
};
const API_BASE_URL = resolveApiBaseUrl();
const useCustomApi = !!(document.body.getAttribute("data-api-base-url") || window._API_BASE_URL_ || window.__API_BASE_URL__);
// End custom API base URL resolution

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const saveSession = (session) => {
  if (!session) {
    return;
  }

  try {
    if (window.mfgaSession?.save) {
      window.mfgaSession.save(session);
    } else {
      const serialized = JSON.stringify(session);
      window.sessionStorage.setItem("mfga_session", serialized);
      window.localStorage.setItem("mfga_session", serialized);
    }
  } catch (error) {
    console.warn("Could not persist the session:", error);
  }
};

const buildSessionPayload = ({ provider, user, token = null, raw = null }) => ({
  provider,
  token,
  user,
  raw,
  createdAt: Date.now(),
});

const normalizeUserData = (user, { email = "", name = "" } = {}) => {
  if (user) {
    return user;
  }
  const fallbackEmail = email ?? "";
  return {
    UserId: null,
    Name: name || fallbackEmail.split("@")[0] || "MFGA Explorer",
    Email: fallbackEmail,
  };
};

const mapSupabaseUser = (user) => {
  if (!user) {
    return normalizeUserData(null);
  }

  return {
    UserId: user.id ?? null,
    Name:
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "MFGA Explorer",
    Email: user.email ?? "",
  };
};

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
  const loginGeneralError = document.getElementById("login-general-error");

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

  const setGeneralError = (message) => {
    if (!loginGeneralError) {
      return;
    }
    loginGeneralError.textContent = message ?? "";
    loginGeneralError.classList.toggle("hidden", !message);
  };

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      setGeneralError("");
      const email = loginEmail ? loginEmail.value.trim() : '';
      const password = loginPassword ? loginPassword.value.trim() : '';

      const emailValid = /\S+@\S+\.\S+/.test(email);
      const passwordValid = password.length >= 6;

      if (!emailValid && loginEmailError) loginEmailError.classList.remove("hidden");
      if (!passwordValid && loginPasswordError) loginPasswordError.classList.remove("hidden");
      if (!emailValid || !passwordValid) return;
      // Disable submit button if present
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      try {
        if (useCustomApi) {
          // Validate against your backend (POST /auth/login) - adjust route as needed
          const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          const payload = await res.json().catch(() => ({}));
          if (!res.ok) {
            const message = payload?.message || 'Invalid credentials';
            setGeneralError(message);
            if (submitBtn) submitBtn.disabled = false;
            return;
          }
          const sessionPayload = buildSessionPayload({
            provider: 'custom-api',
            user: normalizeUserData(payload?.user, {
              email,
              name: payload?.user?.Name ?? payload?.user?.name ?? payload?.Name,
            }),
            token: payload?.token ?? null,
            raw: payload,
          });
          saveSession(sessionPayload);
          setGeneralError("");
          window.location.href = '../after_login/logged_in.html';
        } else {
          // Fallback: use Supabase Auth if preferred
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) {
            console.error('Login error', error);
            setGeneralError(error.message || 'Error signing in');
            if (submitBtn) submitBtn.disabled = false;
            return;
          }
          if (data?.user) {
            const sessionPayload = buildSessionPayload({
              provider: 'supabase',
              user: mapSupabaseUser(data.user),
              token: data.session?.access_token ?? null,
              raw: data,
            });
            saveSession(sessionPayload);
            setGeneralError("");
            window.location.href = '../after_login/logged_in.html';
          } else {
            setGeneralError('Could not sign in with these credentials.');
            if (submitBtn) submitBtn.disabled = false;
          }
        }
       } catch (err) {
         console.error(err);
         setGeneralError('Unexpected sign-in error.');
         if (submitBtn) submitBtn.disabled = false;
        }
    });
  }
});
