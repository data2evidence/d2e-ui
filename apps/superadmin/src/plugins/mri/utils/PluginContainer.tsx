import React, { FC, ReactNode } from "react";

interface PluginContainerProps {
  getToken?: () => Promise<string>;
  qeSvcUrl?: string;
  studyId?: string;
  children?: ReactNode;
}

const PluginContainer: FC<PluginContainerProps> = ({ children, getToken, qeSvcUrl, studyId }) => (
  <span
    className="plugin-container"
    ref={(node: any) => {
      if (node) {
        node.portalAPI = {
          getToken,
          qeSvcUrl,
          studyId,
        };
      }
    }}
  >
    {children}
  </span>
);

export default PluginContainer;
