import React, { useState } from "react";
import Editor from "react-simple-code-editor";
import "./CodeEditor.scss";
import { Grammar, highlight, languages } from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-json";
import "prismjs/themes/prism.css";

const hightlightWithLineNumbers = (input: string, grammar: Grammar, language: string) =>
  highlight(input, grammar, language)
    .split("\n")
    .map((line, i) => `<span class='editorLineNumber'>${i + 1}</span>${line}`)
    .join("\n");

const CodeEditor = () => {
  const [codeValue, setCodeValue] = useState("");

  return (
    <Editor
      value={codeValue}
      onValueChange={(code) => setCodeValue(code)}
      highlight={(code) => hightlightWithLineNumbers(code, languages.json, "json")}
      padding={10}
      textareaId="codeArea"
      className="editor"
      style={{
        fontSize: 12,
        outline: 0,
      }}
    />
  );
};

export default CodeEditor;
