import React, { FC, useCallback, useState } from "react";
import { PageProps, SystemAdminPageMetadata } from "@portal/plugin";
import "./SystemAdminPage.scss";

interface SystemAdminPageProps extends PageProps<SystemAdminPageMetadata> {}

export const SystemAdminPage: FC<SystemAdminPageProps> = ({ metadata }) => {
  const [token, setToken] = useState<string>();

  const handleClick = useCallback(async () => {
    if (metadata) {
      setToken(await metadata.getToken());
    }
  }, [metadata]);

  return (
    <div className="sa-plugin">
      <h1>[Built-in] System admin plugin page</h1>
      <header>
        <div className="sa-plugin__subtitle">Sub header</div>
        <div className="sa-plugin__description">Hello {metadata?.userId || "there!"}</div>
      </header>
      <nav>Side navigation</nav>
      <section>
        <button onClick={handleClick}>Get JWT token</button>
        <div>{token}</div>
      </section>
    </div>
  );
};
