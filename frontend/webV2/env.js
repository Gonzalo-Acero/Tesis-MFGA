(() => {
  // Prefer value injected at build time (Netlify) and fall back to page hint or local dev default.
  const injected =
    (typeof window !== 'undefined' && window.__API_BASE_URL__) ||
    (typeof API_BASE_URL !== 'undefined' && API_BASE_URL) ||
    (typeof process !== 'undefined' && process.env?.API_BASE_URL);

  const pageHint =
    (typeof document !== 'undefined' &&
      document.body?.getAttribute('data-api-base-url')) ||
    '';

  const candidate = injected || pageHint || 'http://localhost:4000/api';
  window.__API_BASE_URL__ = (candidate || '').replace(/\/+$/, '');
})();
