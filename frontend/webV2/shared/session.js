(function initializeMfgaSession(windowObject) {
  const STORAGE_KEY = 'mfga_session';

  const safeParse = (value) => {
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  };

  const serialize = (value) => {
    try {
      return JSON.stringify(value ?? null);
    } catch {
      return null;
    }
  };

  const load = () => {
    const fromSession = safeParse(windowObject.sessionStorage.getItem(STORAGE_KEY));
    if (fromSession) return fromSession;
    return safeParse(windowObject.localStorage.getItem(STORAGE_KEY));
  };

  const save = (data) => {
    const serialized = serialize(data);
    if (serialized === null) {
      return;
    }
    windowObject.sessionStorage.setItem(STORAGE_KEY, serialized);
    windowObject.localStorage.setItem(STORAGE_KEY, serialized);
  };

  const clear = () => {
    windowObject.sessionStorage.removeItem(STORAGE_KEY);
    windowObject.localStorage.removeItem(STORAGE_KEY);
  };

  windowObject.mfgaSession = {
    key: STORAGE_KEY,
    load,
    save,
    clear,
  };
})(window);
