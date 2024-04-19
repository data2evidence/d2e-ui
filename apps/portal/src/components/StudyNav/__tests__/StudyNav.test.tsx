import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { StudyNav } from "../StudyNav";
import { Study } from "../../../types";
import { LocaleProvider } from "../../../contexts/TranslationContext";

const studies: Study[] = [
  {
    id: "1",
    tenant: {
      id: "t01",
      name: "tenant-01",
      system: "",
    },
    tokenStudyCode: "token-code",
    schemaName: "cdm",
    type: "type",
    visibilityStatus: "public",
    publicKey: "",
    dataModel: "",
    databaseCode: "",
    paConfigId: "",
    dashboards: [],
  },
  {
    id: "2",
    tenant: {
      id: "t02",
      name: "tenant-02",
      system: "",
    },
    tokenStudyCode: "token-code",
    schemaName: "cdm",
    type: "type",
    visibilityStatus: "public",
    publicKey: "",
    dataModel: "",
    databaseCode: "",
    paConfigId: "",
    dashboards: [],
  },
];

it("has empty study", () => {
  const handleClick = jest.fn();
  const { queryByTestId } = render(
    <LocaleProvider>
      <StudyNav studies={undefined} selectedStudyId="" onClick={handleClick} />
    </LocaleProvider>
  );
  expect(queryByTestId("studynav")).toBeNull();
});

it("renders correctly", () => {
  const handleClick = jest.fn();
  const { queryByTestId } = render(
    <LocaleProvider>
      <StudyNav studies={studies} selectedStudyId="" onClick={handleClick} />
    </LocaleProvider>
  );
  expect(queryByTestId("study-nav")).toBeTruthy();
});

it("has 2 tenants with each tenant has one study", () => {
  const handleClick = jest.fn();
  const { queryAllByTestId } = render(
    <LocaleProvider>
      <StudyNav studies={studies} selectedStudyId="" onClick={handleClick} />
    </LocaleProvider>
  );
  expect(queryAllByTestId("study-nav-tenant").length).toBe(2);
  expect(queryAllByTestId("study-nav-tenant")[0].childElementCount).toBe(1);
  expect(queryAllByTestId("study-nav-tenant")[1].childElementCount).toBe(1);
});
