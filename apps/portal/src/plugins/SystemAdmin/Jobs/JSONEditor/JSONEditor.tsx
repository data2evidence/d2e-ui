import React, { FC, useCallback } from "react";
import Editor from "react-simple-code-editor";
import "./JSONEditor.scss";
import { Grammar, highlight, languages } from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-json";
import "prismjs/themes/prism.css";
import { isObject } from "lodash";

interface JSONEditorProps {
  value: any;
  onChange: (value: string, name: string, parent?: string, child?: string, isJSON?: boolean) => void;
  name?: string;
  parentKey?: string;
  childKey?: string;
}

const hightlightWithLineNumbers = (input: string, grammar: Grammar, language: string) =>
  highlight(input, grammar, language)
    .split("\n")
    .map((line, i) => `<span class='editorLineNumber'>${i + 1}</span>${line}`)
    .join("\n");

const JSONEditor: FC<JSONEditorProps> = ({ value, onChange, parentKey, childKey, name = "" }) => {
  const parseValue = useCallback((val: any) => {
    if (isObject(val)) {
      return JSON.stringify(val, null, 2);
    }
    return val;
  }, []);

  return (
    <Editor
      value={parseValue(value)}
      onValueChange={(code) => onChange(code, name, parentKey, childKey, true)}
      highlight={(code) => hightlightWithLineNumbers(code, languages.json, "json")}
      padding={10}
      textareaId="codeArea"
      className="editor"
      style={{
        fontFamily: '"Fira code", "Fira Mono", monospace',
        fontSize: 16,
        outline: 0,
      }}
    />
  );
};

export default JSONEditor;
