import React, { FC, useEffect, useMemo } from "react";
import { InteractionStatus } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import { Loader } from "@portal/components";
import { getLoginRequest } from "./msal";

export const MsalLogin: FC = () => {
  const { instance, inProgress } = useMsal();
  const loginRequest = useMemo(() => getLoginRequest(), []);

  useEffect(() => {
    if (inProgress === InteractionStatus.None) {
      instance.loginRedirect(loginRequest).catch((err) => {
        console.error("[MsalLogin] login redirect error", err);
      });
    }
  }, [instance, loginRequest, inProgress]);

  return <Loader />;
};
