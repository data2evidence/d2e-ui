import React, { FC } from "react";
import { OidcApp } from "./containers/auth/oidc/OidcApp";
import "easymde/dist/easymde.min.css";
import "./App.scss";
import { LocaleProvider } from "./contexts/TranslationContext";

export const App: FC = () => {
  return (
    <LocaleProvider>
      <OidcApp />
    </LocaleProvider>
  );
};
