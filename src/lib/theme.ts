export type ThemeMode = 'light' | 'dark';

const THEME_KEY = 'founderos:theme:v1';

function canUseDom() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

export function readTheme(): ThemeMode {
  if (!canUseDom()) return 'light';

  const storedTheme = window.localStorage.getItem(THEME_KEY);
  if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme;

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(theme: ThemeMode) {
  if (!canUseDom()) return;

  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.dataset.theme = theme;
}

export function writeTheme(theme: ThemeMode) {
  if (!canUseDom()) return;

  window.localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
  window.dispatchEvent(new CustomEvent('founderos:theme-updated', { detail: theme }));
}

export function initTheme() {
  applyTheme(readTheme());
}
