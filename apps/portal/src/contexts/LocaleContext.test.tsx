import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LocaleProvider, replaceParams, useLocale } from "./LocaleContext";

export const TestApp = (): JSX.Element => {
  return (
    <LocaleProvider>
      <TestComponent />
    </LocaleProvider>
  );
};

const TestComponent = (): JSX.Element => {
  const { locale, changeLocale, getText, i18nKeys } = useLocale();
  return (
    <div>
      <div onClick={() => changeLocale("en")}>English</div>
      <div onClick={() => changeLocale("es")}>Spanish</div>
      <div onClick={() => changeLocale("fr")}>French</div>
      <div>TEST_VALUE: {getText(i18nKeys.greeting)}</div>
      <div>TEST_LOCALE: {locale}</div>
    </div>
  );
};

const customRender = (ui: JSX.Element, { providerProps, ...renderOptions }: { providerProps: any }) => {
  return render(<LocaleProvider {...providerProps}>{ui}</LocaleProvider>, renderOptions);
};

test("TestApp shows default value", () => {
  render(<TestApp />);
  expect(screen.getByText(/^TEST_VALUE:/)).toHaveTextContent("TEST_VALUE: default");
});

test("TestApp shows value when context is updated", () => {
  const providerProps = {};
  customRender(<TestApp />, { providerProps });
  fireEvent.click(screen.getByText("French"));
  expect(screen.getByText(/^TEST_VALUE:/)).toHaveTextContent("TEST_VALUE: default");
  fireEvent.click(screen.getByText("Spanish"));
  expect(screen.getByText(/^TEST_VALUE:/)).toHaveTextContent("TEST_VALUE: default");
  expect(screen.getByText(/^TEST_LOCALE:/)).toHaveTextContent("TEST_LOCALE: es");
});

test("replaceParams works for templated phrases", () => {
  expect(replaceParams("hey")).toBe("hey");
  expect(replaceParams("hey", ["param0"])).toBe("hey");
  expect(replaceParams("{0}")).toBe("{0}");
  expect(replaceParams("{0}", ["param0"])).toBe("param0");
  expect(replaceParams("{0} and {1}", ["param0"])).toBe("param0 and {1}");
  expect(replaceParams("{0} and {1}", ["param0", "param1"])).toBe("param0 and param1");
  expect(replaceParams("{1} and {0}", ["param0", "param1"])).toBe("param1 and param0");
  expect(replaceParams("{2}, {1} and {0}", ["param0", "param1", "param2"])).toBe("param2, param1 and param0");
});
