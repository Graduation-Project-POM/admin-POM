import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

export const SUPPORTED_LANGUAGES = ["en", "ar"] as const;
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const STORAGE_KEY = "appLanguage";

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
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../lang/en.json";
import ar from "../lang/ar.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
      ar: {
        translation: ar,
      },
    },
    lng: "en",
    fallbackLng: "en",

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;