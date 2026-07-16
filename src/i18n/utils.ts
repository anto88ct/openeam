import { ui, type UiKey } from './ui';

export type Lang = 'it' | 'en';
export const DEFAULT_LANG: Lang = 'it';

/** Reads the locale from a URL's pathname (root = it, /en/* = en). */
export function getLangFromUrl(url: URL): Lang {
  return url.pathname === '/en' || url.pathname.startsWith('/en/') ? 'en' : 'it';
}

/**
 * Given any pathname (with or without an /en prefix) and a target lang,
 * returns the equivalent path in that lang. Assumes it/en share the same
 * slug for a given piece of content.
 */
export function getLocalizedPath(lang: Lang, pathname: string): string {
  const withoutLangPrefix = pathname.replace(/^\/en(?=\/|$)/, '') || '/';
  if (lang === 'en') {
    return withoutLangPrefix === '/' ? '/en' : `/en${withoutLangPrefix}`;
  }
  return withoutLangPrefix;
}

/** Returns a `t(key)` lookup into the shared ui.ts dictionary for the given lang. */
export function useTranslations(lang: Lang) {
  return function t(key: UiKey): string {
    return ui[lang][key] ?? ui[DEFAULT_LANG][key];
  };
}
