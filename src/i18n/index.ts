import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

export const SUPPORTED_LANGUAGES = ["en", "ar"] as const;
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const STORAGE_KEY = "appLanguage";

const enModules = import.meta.glob("./locales/en/*.json", { eager: true });
const arModules = import.meta.glob("./locales/ar/*.json", { eager: true });

// Deep-merge so namespaces shared across files (e.g. `errors` lives in
// common/login/signup) are combined instead of the last file overwriting the
// whole object — which would silently drop keys from a locale.
const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const deepMerge = (
  target: Record<string, unknown>,
  source: Record<string, unknown>,
): Record<string, unknown> => {
  for (const [key, value] of Object.entries(source)) {
    if (isObject(value) && isObject(target[key])) {
      target[key] = deepMerge({ ...(target[key] as Record<string, unknown>) }, value);
    } else {
      target[key] = value;
    }
  }
  return target;
};

const mergeModules = (modules: Record<string, unknown>) =>
  Object.values(modules).reduce<Record<string, unknown>>((acc, mod) => {
    const data = (mod as { default?: Record<string, unknown> }).default ?? mod;
    return deepMerge(acc, data as Record<string, unknown>);
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