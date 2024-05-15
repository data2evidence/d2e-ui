import React, { FC, ReactNode, useEffect } from "react";
import { useUser } from "../../../contexts";

interface PluginContainerProps {
  getToken?: () => Promise<string>;
  qeSvcUrl?: string;
  studyId?: string;
  releaseId?: string;
  children?: ReactNode;
}

const PluginContainer: FC<PluginContainerProps> = ({ children, getToken, qeSvcUrl, studyId, releaseId }) => {
  const { user } = useUser();

  useEffect(() => {
    const pluginEvent = new CustomEvent("dataset");
    window.dispatchEvent(pluginEvent);
  }, [studyId, releaseId]);

  return (
    <span
      className="plugin-container"
      ref={(node: any) => {
        if (node) {
          node.portalAPI = {
            getToken,
            qeSvcUrl,
            studyId,
            releaseId,
            userId: user.userId,
          };
        }
      }}
    >
      {children}
    </span>
  );
};

export default PluginContainer;
