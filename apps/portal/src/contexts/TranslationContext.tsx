import React, { createContext, useState, useContext, ReactNode } from "react";
import { i18nDefault, i18nKeys } from "../utils/i18n";
import { api } from "../axios/api";
import { AxiosError } from "axios";

type LanguageMappings = {
  [key in keyof typeof i18nKeys]: string;
};

interface LocaleContextType {
  i18nKeys: typeof i18nKeys;
  locale: string;
  addTranslation(localeName: string, translation: { [key: string]: string }): Promise<void>;
  changeLocale: (newLocale: string) => void;
  getText: (phraseKey: keyof LanguageMappings, params?: string[]) => string;
}

export const replaceParams = (phrase: string, params?: string[]) => {
  if (!params?.length) {
    return phrase;
  }
  let text = phrase;
  if (Array.isArray(params)) {
    for (let i = 0; i < params.length; i += 1) {
      text = text.replace(`{${i}}`, params[i]);
    }
  }
  return text;
};

export const getFallbackLocale = (locale: string) => {
  const arr = locale.split("-");
  if (arr.length === 1) {
    return "default";
  }
  const fallbackLocale = arr.slice(0, arr.length - 1).join("-");
  return fallbackLocale;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const LocaleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<string>("default");
  const [translations, setTranslations] = useState<{ [key: string]: typeof i18nDefault.default }>(i18nDefault);

  const changeLocale = (newLocale: string) => {
    const getTranslation = async (locale: string) => {
      try {
        if (locale === "default") {
          setLocale("default");
          return;
        }
        const newTranslation = await api.translation.getTranslation(locale);
        addTranslation(locale, newTranslation.data);
        setLocale(locale);
        console.log(`Using translations for "${locale}"`);
      } catch (e: any) {
        if (e instanceof AxiosError && e.response?.status === 404) {
          const fallbackLocale = getFallbackLocale(locale);
          console.log(`Locale "${locale}" not found, trying fallback locale "${fallbackLocale}"`);
          getTranslation(fallbackLocale);
          return;
        } else {
          setLocale("default");
          return;
        }
      }
    };
    getTranslation(newLocale);
  };

  const addTranslation = async (localeName: string, translation: { [key: string]: string }): Promise<void> => {
    // TODO: Do api call to get translations
    const newTranslation = { ...i18nDefault.default, ...translation };
    const updatedTranslations = JSON.parse(JSON.stringify(translations)) as typeof translations;
    updatedTranslations[localeName] = newTranslation;
    setTranslations(updatedTranslations);
  };

  const getText = (phraseKey: keyof LanguageMappings, params?: string[]) => {
    const values = translations?.[locale] ?? translations.default;
    const phrase = values[phraseKey] ?? translations.default[phraseKey] ?? phraseKey;
    const text = replaceParams(phrase, params);
    return text;
  };

  return (
    <LocaleContext.Provider value={{ locale, changeLocale, getText, i18nKeys, addTranslation }}>
      {children}
    </LocaleContext.Provider>
  );
};

const TranslationContext = () => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
};

export { LocaleProvider, TranslationContext };
