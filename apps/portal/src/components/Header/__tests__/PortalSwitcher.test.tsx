import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import PortalSwitcher from "../PortalSwitcher/PortalSwitcher";
import * as userContext from "../../../contexts/UserContext";

afterEach(() => {
  jest.clearAllMocks();
});

it("renders without switcher", () => {
  jest.spyOn(userContext, "useUserInfo").mockImplementation(() => ({
    user: {
      userId: 1,
      canAccessSystemAdminPortal: false,
      canAccessResearcherPortal: true,
    },
    getUserId: undefined,
    clearUserContext: undefined,
  }));

  const { queryByTestId } = render(
    <MemoryRouter>
      <PortalSwitcher portalType="researcher" />
    </MemoryRouter>
  );

  expect(queryByTestId("portal-switcher-many")).toBeNull();
});

it("renders switcher as link", () => {
  jest.spyOn(userContext, "useUserInfo").mockImplementation(() => ({
    user: {
      userId: 2,
      canAccessSystemAdminPortal: true,
      canAccessResearcherPortal: true,
    },
    getUserId: undefined,
    clearUserContext: undefined,
  }));

  const { queryByTestId, queryAllByTestId } = render(
    <MemoryRouter>
      <PortalSwitcher portalType="researcher" />
    </MemoryRouter>
  );

  expect(queryByTestId("portal-switcher-one")).toBeNull();
  expect(queryByTestId("portal-switcher-many")).toBeTruthy();
  expect(queryAllByTestId("portal-switcher-item").length).toBe(1);
});
