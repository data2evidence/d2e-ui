import React, { createContext, useState, useContext, ReactNode } from "react";
import { i18n, i18nKeys } from "../utils/i18n";

type Locale = keyof typeof i18n;
type LanguageMappings = {
  [key in keyof typeof i18nKeys]: string;
};

interface LocaleContextType {
  locale: Locale;
  changeLocale: (newLocale: Locale) => void;
  i18nText: LanguageMappings;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const LocaleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>("en");

  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale);
  };

  const i18nText = i18n[locale];

  return <LocaleContext.Provider value={{ locale, changeLocale, i18nText }}>{children}</LocaleContext.Provider>;
};

const useLocale = () => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
};

export { LocaleProvider, useLocale };
