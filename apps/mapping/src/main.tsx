import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { SystemAdminPageMetadata } from "@portal/plugin";
import { App, AppMetadataParams, AppProps } from "./App.tsx";
import "./index.css";

const mockMetadata: SystemAdminPageMetadata<AppMetadataParams> = {
  system: "Local1",
  userId: "Mock user",
  getToken: () => Promise.resolve("MockToken"),
  data: {
    dnBaseUrl: "https://localhost:41100/",
  },
};

const pageProps: AppProps = {
  metadata: mockMetadata,
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App {...pageProps} />
    </BrowserRouter>
  </React.StrictMode>
);
