import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

export const SUPPORTED_LANGUAGES = ["en", "ar"] as const;
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const STORAGE_KEY = "appLanguage";

/**
 * Auto-load every JSON file under locales/<lng>/ and merge them into a single
 * translation bundle per language. Each feature owns its own file (common.json,
 * admin.json, contest.json, ...) with a distinct top-level namespace, so adding
 * a new feature is just: drop a new file in — no edits needed here.
 */
const enModules = import.meta.glob("./locales/en/*.json", { eager: true });
const arModules = import.meta.glob("./locales/ar/*.json", { eager: true });

const mergeModules = (modules: Record<string, unknown>) =>
  Object.values(modules).reduce<Record<string, unknown>>((acc, mod) => {
    const data = (mod as { default?: Record<string, unknown> }).default ?? mod;
    return { ...acc, ...(data as Record<string, unknown>) };
  }, {});

export const resources = {
  en: { translation: mergeModules(enModules) },
  ar: { translation: mergeModules(arModules) },
};

i18n
  // Reads the saved language from localStorage (and persists changes there).
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: SUPPORTED_LANGUAGES,
    interpolation: {
      escapeValue: false, // React already escapes against XSS
    },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: STORAGE_KEY,
      caches: ["localStorage"],
    },
  });

/**
 * Sets <html dir="..."> and <html lang="..."> so the whole page mirrors
 * for Arabic (rtl) and reverts for English (ltr).
 */
const applyDirection = (lng: string) => {
  const dir = lng === "ar" ? "rtl" : "ltr";
  document.documentElement.setAttribute("dir", dir);
  document.documentElement.setAttribute("lang", lng);
};

// Apply on first load and whenever the language changes.
applyDirection(i18n.resolvedLanguage ?? "en");
i18n.on("languageChanged", applyDirection);

export default i18n;
