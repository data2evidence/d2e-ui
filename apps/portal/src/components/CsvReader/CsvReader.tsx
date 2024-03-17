import React, { ChangeEvent, FC, HTMLAttributes, useCallback } from "react";
import * as PapaParse from "papaparse";
import "./CsvReader.scss";

export interface CsvReaderProps extends Omit<HTMLAttributes<HTMLDivElement>, "onError"> {
  fileEncoding?: string;
  onFileLoaded: (data: { name: string; data: PapaParse.ParseResult<any> }) => void;
  onError?: (error: Error) => void;
  parseOptions?: PapaParse.ParseConfig;
}

export const CsvReader: FC<CsvReaderProps> = ({
  className = "",
  style = {},
  fileEncoding,
  onFileLoaded,
  onError,
  parseOptions = {},
}) => {
  const handleChangeFile = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const reader = new FileReader();
      const files: FileList = e.target.files!;
      if (files.length > 0) {
        if (!["text/csv", "text/plain"].includes(files[0].type)) {
          typeof onError === "function" && onError(new Error("Unsupported file type"));
          return;
        }

        reader.onload = () => {
          const csvData = PapaParse.parse(
            reader.result as string,
            Object.assign(parseOptions, {
              error: onError,
              encoding: fileEncoding,
            })
          );
          onFileLoaded({ name: files[0].name, data: csvData });
        };

        reader.readAsText(files[0], fileEncoding);
      }
    },
    [onFileLoaded, onError, parseOptions, fileEncoding]
  );

  return (
    <div className={`csv-reader ${className}`} style={style}>
      <label>File</label>
      <div className="csv-reader__wrapper">
        <input
          className="csv-reader__file"
          type="file"
          name="files[]"
          id="file"
          data-testid="file"
          onChange={handleChangeFile}
        />
        <label htmlFor="file">
          <strong>Click here to choose a file, or drop a file</strong>
          <div>Supported file types: CSV</div>
        </label>
      </div>
    </div>
  );
};
