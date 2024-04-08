import React, { FC } from "react";
import { LocaleProvider, TranslationContext } from "./contexts/TranslationContext";
import { api } from "./axios/api";

export const TestApp: FC = () => {
  return <LanguageApp />;
};


const LanguageApp = () => {
  const { locale, changeLocale, getText, i18nKeys, addTranslation } = TranslationContext();

  const onClickLocale = async (locale: string) => {
    const newTranslation = await api.translation.getTranslation(locale);
    addTranslation(locale, newTranslation);
    changeLocale(locale);
  };

  return (
    <div>
      <div onClick={() => onClickLocale("en")}>English</div>
      <div onClick={() => onClickLocale("es")}>Spanish</div>
      <div onClick={() => onClickLocale("fr")}>French</div>
      <div style={{ fontSize: 30 }}>{getText(i18nKeys.greeting)}</div>
    </div>
  );
};
