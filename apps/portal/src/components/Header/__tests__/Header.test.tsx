import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import { Header } from "../Header";
import { MockedProvider } from "@apollo/client/testing";
import { MOCK_GET_STUDIES, MOCK_GET_MY_TENANT } from "../../../graphql/mocks";
import { Tenant, Study } from "../../../types";
import { LocaleProvider } from "../../../contexts/TranslationContext";

const tenant: Tenant = {
  id: "t01",
  name: "Tenant 01",
  system: "",
};

const study: Partial<Study> = {
  id: "s01",
  tenant,
};

const mocks = [MOCK_GET_STUDIES([study]), MOCK_GET_MY_TENANT([tenant])];

jest.mock("../../../containers/auth", () => ({
  isAuthenticated: () => false,
}));

it("render correctly", () => {
  const { queryByTestId } = render(
    <LocaleProvider>
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <Header portalType="researcher" />
        </MemoryRouter>
      </MockedProvider>
    </LocaleProvider>
  );

  expect(queryByTestId("header")).toBeTruthy();
});

it("has 2 navigation menu", () => {
  const { queryByTestId } = render(
    <LocaleProvider>
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <Header portalType="researcher" />
        </MemoryRouter>
      </MockedProvider>
    </LocaleProvider>
  );

  expect(queryByTestId("nav")?.childElementCount).toBe(1);
});
