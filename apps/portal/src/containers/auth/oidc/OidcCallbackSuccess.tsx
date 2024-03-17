import React, { FC } from "react";
import { Loader } from "@portal/components";

export const OidcCallbackSuccess: FC = () => {
  return <Loader text="Authentication completed. Redirecting..." />;
};
