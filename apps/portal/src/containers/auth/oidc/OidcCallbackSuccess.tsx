import React, { FC } from "react";
import { Loader } from "@portal/components";
import { TranslationContext } from "../../../contexts/TranslationContext";

export const OidcCallbackSuccess: FC = () => {
  const { getText, i18nKeys } = TranslationContext();
  return <Loader text={getText(i18nKeys.OIDC_CALLBACK_SUCCESS__LOADER)} />;
};
