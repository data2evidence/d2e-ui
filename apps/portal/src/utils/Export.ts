import { saveAs } from "file-saver";
import { scanForCharsToEscapeAndSurroundQuotes } from "./EscapeAndSurroundQuotes";

export interface DownloadColumn {
  header: string;
  accessor: string;
}

export const parseToCsv = (data: { [key: string]: string | number }[], columns: DownloadColumn[]) => {
  const headers = columns.map((column) => column.header);

  const separatorRegex = new RegExp(`${","}|${"\r\n"}|${"\n"}`, "g");

  const result: string[] = [];
  data.forEach((d) => {
    const arr: string[] = [];
    columns.forEach((column) => {
      arr.push(
        scanForCharsToEscapeAndSurroundQuotes({
          columnValue: d[column.accessor],
          separatorRegex,
          noValue: "NO VALUE",
        })
      );
    });
    result.push(arr.join(","));
  });
  return [headers.join(","), ...result].join("\n");
};

export const filterJSON = (data: { [key: string]: string | number }[], columns: DownloadColumn[], name: string) => {
  const parseData = data.map((d) => {
    // use in key/values specified in the columns
    const result = columns.reduce((acc, col) => {
      return { ...acc, [col.header]: d[col.accessor] };
    }, {});

    return result;
  }, []);
  return JSON.stringify({ [name]: parseData });
};

export const downloadFile = ({ data, fileName, fileType }: { data: any; fileName: string; fileType: string }) => {
  const blob = new Blob([data], { type: fileType });
  saveAs(blob, fileName);
};
