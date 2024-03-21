import React, { FC } from "react";
import { Button } from "@portal/components";
import { dqdParseToCsv, filterJSON, downloadFile, DownloadColumn } from "../../../../utils/Export";
import { CheckResults, OverviewResults } from "../../../../components/DQD/types";

export const downloadColumns: DownloadColumn[] = [
  { header: "STATUS", accessor: "failed" },
  { header: "CONTEXT", accessor: "context" },
  { header: "TABLE", accessor: "cdmTableName" },
  { header: "CATEGORY", accessor: "category" },
  { header: "SUBCATEGORY", accessor: "subcategory" },
  { header: "LEVEL", accessor: "checkLevel" },
  { header: "NOTES", accessor: "notesValue" },
  { header: "DESCRIPTION", accessor: "checkDescription" },
  { header: "%VIOLATEDROWS", accessor: "pctViolatedRows" },
  { header: "NUMVIOLATEDROWS", accessor: "numViolatedRows" },
];

interface DownloadDataButtonsProps {
  data: CheckResults[];
  overviewData: OverviewResults | undefined;
  datasetName: string;
}

const DownloadDataButtons: FC<DownloadDataButtonsProps> = ({ data, overviewData, datasetName }) => {
  return (
    <div className="selector__button">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="button-container">
          <Button
            onClick={() =>
              downloadFile({
                data: dqdParseToCsv(data.map((d) => ({ ...d }))),
                fileName: datasetName,
                fileType: "text/csv",
              })
            }
            text="Download CSV"
          />
          <Button
            onClick={() =>
              downloadFile({
                data: filterJSON(
                  data.map((d) => ({ ...d })),
                  overviewData
                ),
                fileName: `${datasetName}.json`,
                fileType: "text/json",
              })
            }
            text="Download JSON"
          />
        </div>
      </div>
    </div>
  );
};

export default DownloadDataButtons;
