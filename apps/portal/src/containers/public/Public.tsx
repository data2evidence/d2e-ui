import React, { FC, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Snackbar } from "@portal/components";
import { Header } from "../../components";
import { PublicOverview } from "./PublicOverview/PublicOverview";
import { PublicInformation } from "./PublicInformation/PublicInformation";
import { Legal } from "../shared/Legal/Legal";
import { useFeedback } from "../../contexts";
import { NavLink } from "../../types";
import "./Public.scss";

const ROUTES = {
  overview: "overview",
  info: "information",
  legal: "legal",
  login: "/login",
  logout: "/logout",
};

const navigations: NavLink[] = [
  {
    id: "legal",
    path: ROUTES.legal,
    title: "Legal",
  },
  {
    id: "login",
    path: ROUTES.login,
    title: "Login",
  },
];

export const Public: FC = () => {
  const { clearFeedback, getFeedback } = useFeedback();
  const feedback = getFeedback();

  useEffect(() => {
    if ((feedback?.autoClose || 0) > 0) setTimeout(() => clearFeedback(), feedback?.autoClose);
  }, [feedback, clearFeedback]);

  return (
    <div className="public__container">
      <Header nav={navigations} portalType="public" />
      <main>
        <Snackbar
          type={feedback?.type}
          handleClose={clearFeedback}
          message={feedback?.message}
          description={feedback?.description}
          visible={feedback?.message != null}
        />
        <Routes>
          <Route path="/">
            <Route index element={<Navigate to={ROUTES.overview} />} />
            <Route path={ROUTES.info} element={<PublicInformation />} />
            <Route path={ROUTES.legal} element={<Legal />} />
            <Route path={ROUTES.overview} element={<PublicOverview />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
};
