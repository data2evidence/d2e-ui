import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from "react";
import { i18nDefault, i18nKeys } from "../utils/i18n";
import { api } from "../axios/api";
import { AxiosError } from "axios";
import env from "../env";

type LanguageMappings = {
  [key in keyof typeof i18nKeys]: string;
};

interface LocaleContextType {
  i18nKeys: typeof i18nKeys;
  locale: string;
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

const TranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<string>("default");
  const [translations, setTranslations] = useState<{ [key: string]: typeof i18nDefault.default }>(i18nDefault);
  const [ready, setReady] = useState(false);

  const changeLocale = (newLocale: string) => {
    const addTranslation = async (localeName: string, translation: { [key: string]: string }): Promise<void> => {
      const newTranslation = { ...i18nDefault.default, ...translation };
      const updatedTranslations = JSON.parse(JSON.stringify(translations)) as typeof translations;
      updatedTranslations[localeName] = newTranslation;
      setTranslations(updatedTranslations);
    };

    const getTranslation = async (localeToGet: string) => {
      if (localeToGet in translations) {
        console.log(`Using cached version of locale ${localeToGet}`);
        setLocale(localeToGet);
        setReady(true);
        return;
      }
      try {
        const newTranslation = await api.translation.getTranslation(localeToGet);
        addTranslation(localeToGet, newTranslation.data);
        setLocale(localeToGet);
        setReady(true);
        console.log(`Using translations for "${localeToGet}"`);
      } catch (e: any) {
        if (e instanceof AxiosError && e.response?.status === 404) {
          const fallbackLocale = getFallbackLocale(localeToGet);
          console.log(`Locale "${localeToGet}" not found, trying fallback locale "${fallbackLocale}"`);
          getTranslation(fallbackLocale);
          return;
        }
        setLocale("default");
        setReady(true);
        return;
      }
    };
    getTranslation(newLocale);
  };

  // Temporarily exposing function for demo. Remove when language selector is added
  //@ts-ignore
  // window.changeLocale = changeLocale;

  const getText = useCallback(
    (phraseKey: keyof LanguageMappings, params?: string[]) => {
      const values = translations?.[locale] ?? translations.default;
      const phrase = values[phraseKey] ?? translations.default[phraseKey] ?? phraseKey;
      const text = replaceParams(phrase, params);
      return text;
    },
    [translations, locale]
  );

  useEffect(() => {
    if (env.REACT_APP_LOCALE) {
      changeLocale(env.REACT_APP_LOCALE);
    } else {
      setReady(true);
    }
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <LocaleContext.Provider value={{ locale, changeLocale, getText, i18nKeys }}>{children}</LocaleContext.Provider>
  );
};

const TranslationContext = () => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error("useLocale must be used within a TranslationProvider");
  }
  return context;
};

export { TranslationProvider, TranslationContext };
