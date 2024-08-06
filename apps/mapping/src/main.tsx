import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { FieldMapLayout } from "./Field/FieldMapLayout.tsx";
import { TableMapLayout } from "./Table/TableMapLayout.tsx";
import "./index.css";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        index: true,
        element: <TableMapLayout />,
      },
      {
        path: "link-fields",
        element: <FieldMapLayout />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
