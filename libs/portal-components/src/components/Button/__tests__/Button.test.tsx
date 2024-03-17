import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Button } from "../Button";

it("has text prop set", () => {
  const { queryByTestId } = render(<Button text="Save" />);
  expect(queryByTestId("button")?.getAttribute("text")).toBe("Save");
});

it("should trigger click", () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick} />);

  fireEvent.click(screen.getByTestId("button"));
  expect(handleClick).toHaveBeenCalledTimes(1);
});

it("is not in loading state", () => {
  const { queryByTestId } = render(<Button loading={false} />);
  expect(queryByTestId("button-loading")).toBeNull();
});

it("is in loading state and also disabled", () => {
  const { queryByTestId } = render(<Button loading={true} />);
  expect(queryByTestId("button-loading")).toBeTruthy();
  expect(queryByTestId("button")?.getAttribute("disabled")).toBeTruthy();
});

it("has disabled state", () => {
  const { queryByTestId } = render(<Button disabled={true} />);
  expect(queryByTestId("button")?.getAttribute("disabled")).toBeTruthy();
});
