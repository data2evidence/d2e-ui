import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { i18nDefault, i18nKeys } from "../utils/i18n";

type Locale = keyof typeof i18nDefault;
type LanguageMappings = {
  [key in keyof typeof i18nKeys]: string;
};

interface LocaleContextType {
  locale: string;
  changeLocale: (newLocale: string) => void;
  getText: (phraseKey: keyof LanguageMappings, params?: string[]) => string;
  i18nKeys: typeof i18nKeys;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const LocaleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<string>("default");
  const [translations, setTranslations] = useState<{ [key: string]: typeof i18nDefault.default }>(i18nDefault);

  const changeLocale = (newLocale: string) => {
    setLocale(newLocale);
  };

  const addTranslation = async (localeName: string, translation: { [key: string]: string }) => {
    // TODO: Do api call to get translations
    const newTranslation = { ...i18nDefault.default, ...translation };
    const updatedTranslations = JSON.parse(JSON.stringify(translations)) as typeof translations;
    updatedTranslations[localeName] = newTranslation;
    setTranslations(updatedTranslations);
  };

  const getText = (phraseKey: keyof LanguageMappings, params?: string[]) => {
    const values = translations?.[locale] ?? translations.default;
    const phrase = values[phraseKey] ?? translations.default[phraseKey] ?? phraseKey;
    return phrase;
  };

  return (
    <LocaleContext.Provider value={{ locale, changeLocale, getText, i18nKeys }}>{children}</LocaleContext.Provider>
  );
};

const useLocale = () => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
};

export { LocaleProvider, useLocale };
