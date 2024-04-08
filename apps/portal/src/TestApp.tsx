import React, { FC } from "react";
import { LocaleProvider, useLocale } from "./contexts/LocaleContext";

export const TestApp: FC = () => {
  return (
    <LocaleProvider>
      <LanguageApp />
    </LocaleProvider>
  );
};

const LanguageApp = () => {
  const { locale, changeLocale, getText, i18nKeys } = useLocale();
  return (
    <div>
      <div onClick={() => changeLocale("en")}>English</div>
      <div onClick={() => changeLocale("es")}>Spanish</div>
      <div onClick={() => changeLocale("fr")}>French</div>
      <div style={{ fontSize: 30 }}>{getText(i18nKeys.greeting)}</div>
    </div>
  );
};
