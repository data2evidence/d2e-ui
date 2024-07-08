import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { LinkTables } from "./LinkTables/LinkTables.tsx";
import { LinkFields } from "./LinkFields/LinkFields.tsx";
import Flow from "./Flow/Flow.tsx";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        index: true,
        // element: <LinkTables />,
        element: <Flow />,
      },
      {
        path: "link-fields",
        element: <LinkFields />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
