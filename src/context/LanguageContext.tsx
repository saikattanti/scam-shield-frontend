/* eslint-disable */
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { translations } from "../i18n/translations";

export type Language =
  | "en"
  | "hi"
  | "bn"
  | "ta"
  | "te"
  | "mr"
  | "gu"
  | "kn"
  | "ml"
  | "pa"
  | "ur"
  | "or";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof (typeof translations)["en"]) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem(
      "scamshield-language",
    ) as Language | null;
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("scamshield-language", language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: keyof (typeof translations)["en"]) => {
    return translations[language][key] || translations["en"][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
