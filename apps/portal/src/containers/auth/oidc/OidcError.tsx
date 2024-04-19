import React, { FC } from "react";
import { TranslationContext } from "../../../contexts/TranslationContext";

export const OidcError: FC = () => {
  const { getText, i18nKeys } = TranslationContext();
  return <div style={{ padding: 10 }}>{getText(i18nKeys.OIDC_ERROR__MESSAGE)}</div>;
};
