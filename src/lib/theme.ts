export const THEME_KEY = "careerchive-theme";
export type Theme = "light" | "dark";
export const DEFAULT_THEME: Theme = "dark";

export const THEME_BOOT_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t!=="dark"&&t!=="light")t="${DEFAULT_THEME}";var r=document.documentElement;r.setAttribute("data-theme",t);r.style.colorScheme=t;}catch(e){try{var r=document.documentElement;r.setAttribute("data-theme","${DEFAULT_THEME}");r.style.colorScheme="${DEFAULT_THEME}";}catch(e2){}}})();`;

const themeListeners = new Set<() => void>();
let animateTimer: number | undefined;

export function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    /* ignore */
  }
  return null;
}

export function subscribeTheme(onChange: () => void) {
  themeListeners.add(onChange);
  function onStorage(event: StorageEvent) {
    if (event.key === THEME_KEY) onChange();
  }
  window.addEventListener("storage", onStorage);
  return () => {
    themeListeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

export function getThemeSnapshot(): Theme {
  return readStoredTheme() ?? DEFAULT_THEME;
}

export function applyDocumentTheme(next: Theme, animate = false) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (animate) {
    root.classList.add("theme-animate");
    window.clearTimeout(animateTimer);
    animateTimer = window.setTimeout(() => {
      root.classList.remove("theme-animate");
    }, 500);
  }
  if (root.getAttribute("data-theme") !== next) {
    root.setAttribute("data-theme", next);
  }
  root.style.colorScheme = next;
}

export function writeTheme(next: Theme) {
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {
    /* ignore */
  }
  applyDocumentTheme(next, true);
  themeListeners.forEach((listener) => listener());
}
