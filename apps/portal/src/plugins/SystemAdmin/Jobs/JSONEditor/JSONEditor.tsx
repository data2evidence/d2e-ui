import React, { FC, useCallback, useEffect, useState } from "react";
import Editor from "react-simple-code-editor";
import "./JSONEditor.scss";
import { Grammar, highlight, languages } from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-json";
import "prismjs/themes/prism.css";
import { isObject } from "lodash";

interface JSONEditorProps {
  value: any;
  onChange: (value: string, name: string, parent?: string, child?: string) => void;
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
  const [code, setCode] = useState("");

  useEffect(() => {
    if (value) {
      setCode(parseValue(value));
    }
  }, []);

  const parseValue = useCallback((val: any) => {
    if (isObject(val)) {
      return JSON.stringify(val, null, 2);
    }
    return val;
  }, []);

  const handleChange = useCallback((val: string) => {
    setCode(val);
    onChange(val, name, parentKey, childKey);
  }, []);

  return (
    <>
      <span className="json-editor__header">{name}</span>
      <Editor
        value={code}
        onValueChange={handleChange}
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
    </>
  );
};

export default JSONEditor;
