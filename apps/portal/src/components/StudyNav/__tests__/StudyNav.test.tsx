import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { StudyNav } from "../StudyNav";
import { Study } from "../../../types";
import { TranslationProvider } from "../../../contexts/TranslationContext";

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
    <TranslationProvider>
      <StudyNav studies={undefined} selectedStudyId="" onClick={handleClick} />
    </TranslationProvider>
  );
  expect(queryByTestId("studynav")).toBeNull();
});

it("renders correctly", () => {
  const handleClick = jest.fn();
  const { queryByTestId } = render(
    <TranslationProvider>
      <StudyNav studies={studies} selectedStudyId="" onClick={handleClick} />
    </TranslationProvider>
  );
  expect(queryByTestId("study-nav")).toBeTruthy();
});

it("has 2 tenants with each tenant has one study", () => {
  const handleClick = jest.fn();
  const { queryAllByTestId } = render(
    <TranslationProvider>
      <StudyNav studies={studies} selectedStudyId="" onClick={handleClick} />
    </TranslationProvider>
  );
  expect(queryAllByTestId("study-nav-tenant").length).toBe(2);
  expect(queryAllByTestId("study-nav-tenant")[0].childElementCount).toBe(1);
  expect(queryAllByTestId("study-nav-tenant")[1].childElementCount).toBe(1);
});
