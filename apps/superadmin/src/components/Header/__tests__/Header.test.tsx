import React from "react";
import { render } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import "@testing-library/jest-dom/extend-expect";
import { Header } from "../Header";
import { NavLink } from "../../../types";
import { MockedProvider } from "@apollo/client/testing";
import { MOCK_GET_STUDIES, MOCK_GET_MY_TENANT } from "../../../graphql/mocks";
import { Tenant, Study } from "../../../types";

const tenant: Partial<Tenant> = {
  id: "t01",
  name: "Tenant 01",
};

const study: Partial<Study> = {
  id: "s01",
  tenantId: "t01",
};

const nav: NavLink[] = [
  {
    id: "1",
    title: "Eeny",
    path: "/eeny",
  },
  {
    id: "2",
    title: "Meeny",
    path: "http://meeny",
  },
  {
    id: "3",
    title: "Miny",
    path: "",
    submenu: [
      {
        id: "3.1",
        title: "Moe",
        path: "/moe",
      },
    ],
  },
];

const mocks = [MOCK_GET_STUDIES([study]), MOCK_GET_MY_TENANT([tenant])];

it("render correctly", () => {
  const history = createMemoryHistory();
  const { queryByTestId } = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Router history={history}>
        <Header nav={nav} portalType="researcher" />
      </Router>
    </MockedProvider>
  );

  expect(queryByTestId("header")).toBeTruthy();
});

it("has 4 navigation menu", () => {
  const history = createMemoryHistory();
  const { queryByTestId } = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Router history={history}>
        <Header nav={nav} portalType="researcher" />
      </Router>
    </MockedProvider>
  );

  expect(queryByTestId("nav")?.childElementCount).toBe(4);
});
