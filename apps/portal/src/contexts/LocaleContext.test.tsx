import React, { FC } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LocaleProvider, useLocale } from "./LocaleContext";

export const TestApp = (): JSX.Element => {
  return (
    <LocaleProvider>
      <TestComponent />
    </LocaleProvider>
  );
};

const TestComponent = (): JSX.Element => {
  const { locale, changeLocale, i18nText } = useLocale();
  return (
    <div>
      <div onClick={() => changeLocale("en")}>English</div>
      <div onClick={() => changeLocale("es")}>Spanish</div>
      <div onClick={() => changeLocale("fr")}>French</div>
      <div>TEST_VALUE: {i18nText.greeting}</div>
      <div>TEST_LOCALE: {locale}</div>
    </div>
  );
};

const customRender = (ui: JSX.Element, { providerProps, ...renderOptions }: { providerProps: any }) => {
  return render(<LocaleProvider {...providerProps}>{ui}</LocaleProvider>, renderOptions);
};

test("TestApp shows default value", () => {
  render(<TestApp />);
  expect(screen.getByText(/^TEST_VALUE:/)).toHaveTextContent("TEST_VALUE: Hello");
});

test("TestApp shows value when context is updated", () => {
  const providerProps = {};
  customRender(<TestApp />, { providerProps });
  fireEvent.click(screen.getByText("French"));
  expect(screen.getByText(/^TEST_VALUE:/)).toHaveTextContent("TEST_VALUE: Bonjour");
  fireEvent.click(screen.getByText("Spanish"));
  expect(screen.getByText(/^TEST_VALUE:/)).toHaveTextContent("TEST_VALUE: Hola");
  expect(screen.getByText(/^TEST_LOCALE:/)).toHaveTextContent("TEST_LOCALE: es");
});
