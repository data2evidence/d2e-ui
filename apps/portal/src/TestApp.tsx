import React, { FC } from "react";
import { TranslationContext } from "./contexts/TranslationContext";

export const TestApp: FC = () => {
  return <LanguageApp />;
};

/*
TODO
- translate portal
- update tests values after using a real default dictionary
- dont forget to make PR with gateway routing changes
*/

const LanguageApp = () => {
  const { changeLocale, getText, i18nKeys } = TranslationContext();

  const onClickLocale = async (locale: string) => {
    changeLocale(locale);
  };

  return (
    <div>
      <div onClick={() => onClickLocale("en")}>English</div>
      <div onClick={() => onClickLocale("es")}>Spanish</div>
      <div onClick={() => onClickLocale("fr-US")}>French</div>
      <div style={{ fontSize: 30 }}>{getText(i18nKeys.greeting)}</div>
    </div>
  );
};
