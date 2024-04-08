import React, { FC } from "react";
import { LocaleProvider, useLocale } from "./contexts/LocaleContext";
import { api } from "./axios/api";

export const TestApp: FC = () => {
  return (
    <LocaleProvider>
      <LanguageApp />
    </LocaleProvider>
  );
};

const LanguageApp = () => {
  const { locale, changeLocale, getText, i18nKeys, addTranslation } = useLocale();

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
