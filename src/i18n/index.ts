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
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: SUPPORTED_LANGUAGES,
    interpolation: {
      escapeValue: false, 
    },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: STORAGE_KEY,
      caches: ["localStorage"],
    },
  });

const applyDirection = (lng: string) => {
  const dir = lng === "ar" ? "rtl" : "ltr";
  document.documentElement.setAttribute("dir", dir);
  document.documentElement.setAttribute("lang", lng);
};

applyDirection(i18n.resolvedLanguage ?? "en");
i18n.on("languageChanged", applyDirection);

export default i18n;