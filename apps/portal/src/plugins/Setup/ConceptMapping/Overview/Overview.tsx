import React, { FC, useState, useContext, useCallback, useEffect } from "react";
import { Title, Button } from "@portal/components";
import { useDatasets, useDialogHelper } from "../../../../hooks";
import { CsvReader } from "../../../../components";
import ImportDialog from "../ImportDialog/ImportDialog";
import MappingTable from "../MappingTable/MappingTable";
import MappingDrawer from "../MappingDrawer/MappingDrawer";
import { parseToCsv, downloadFile, DownloadColumn } from "../../../../utils/Export";
import { ConceptMappingContext, ConceptMappingDispatchContext } from "../Context/ConceptMappingContext";
import "./Overview.scss";
import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { TranslationContext } from "../../../../contexts/TranslationContext";

const Overview: FC = () => {
  const { getText, i18nKeys } = TranslationContext();
  const dispatch: React.Dispatch<any> = useContext(ConceptMappingDispatchContext);
  const conceptMappingState = useContext(ConceptMappingContext);
  const { sourceCode, sourceName, sourceFrequency, description } = conceptMappingState.columnMapping;
  const [datasets] = useDatasets("systemAdmin");
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>();
  // local states
  const [loading, setLoading] = useState(false);
  const [showImportDialog, openImportDialog, closeImportDialog] = useDialogHelper(false);
  const handleCloseImportDialog = useCallback(() => {
    closeImportDialog();
  }, [closeImportDialog]);

  const handleOnFileLoaded = useCallback(
    (data: any) => {
      dispatch({ type: "ADD_IMPORT_DATA", data: data });
      openImportDialog();
    },
    [dispatch, openImportDialog]
  );

  useEffect(() => {
    if (!datasets || selectedDatasetId) return;
    if (datasets?.[0]?.id) {
      setSelectedDatasetId(datasets[0].id);
    }
  }, [datasets, selectedDatasetId]);

  const downloadColumns: DownloadColumn[] = [
    { header: getText(i18nKeys.OVERVIEW__SOURCE), accessor: sourceCode },
    { header: getText(i18nKeys.OVERVIEW__NAME), accessor: sourceName },
    { header: getText(i18nKeys.OVERVIEW__FREQUENCY), accessor: sourceFrequency },
    { header: getText(i18nKeys.OVERVIEW__DESCRIPTION), accessor: description },
    { header: getText(i18nKeys.OVERVIEW__CONCEPT_ID), accessor: "conceptId" },
    { header: getText(i18nKeys.OVERVIEW__CONCEPT_NAME), accessor: "conceptName" },
    { header: getText(i18nKeys.OVERVIEW__DOMAIN), accessor: "domainId" },
  ];

  if (!selectedDatasetId) {
    return null;
  }

  return (
    <>
      <Title>{getText(i18nKeys.OVERVIEW__CONCEPT_MAPPING)}</Title>

      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ marginRight: "10px" }}>{getText(i18nKeys.OVERVIEW__REFERENCE_CONCEPTS)}: </div>
        <FormControl sx={{ marginRight: "20px" }}>
          <Select
            value={selectedDatasetId}
            onChange={(e: SelectChangeEvent) => {
              setSelectedDatasetId(e.target.value);
            }}
            sx={{ "& .MuiSelect-outlined": { paddingTop: "8px", paddingBottom: "8px" } }}
          >
            {datasets?.map((dataset) => (
              <MenuItem value={dataset.id} key={dataset.id} sx={{}} disableRipple>
                {dataset.studyDetail?.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      {conceptMappingState.importData.data.length !== 0 && (
        <ImportDialog
          open={showImportDialog}
          onClose={handleCloseImportDialog}
          loading={loading}
          setLoading={setLoading}
        />
      )}
      {conceptMappingState.csvData.data.length == 0 && (
        <CsvReader onFileLoaded={handleOnFileLoaded} parseOptions={{ header: true }}></CsvReader>
      )}
      <br></br>
      {conceptMappingState.csvData.data.length !== 0 && (
        <>
          <div className="overview-selection__buttons">
            <Button
              onClick={() => dispatch({ type: "CLEAR_CSV_DATA" })}
              text={getText(i18nKeys.OVERVIEW__CLEAR_AND_IMPORT)}
              variant="primary"
            />
            <Button
              onClick={() =>
                downloadFile({
                  data: parseToCsv(conceptMappingState.csvData.data, downloadColumns),
                  fileName: "concept_mappings",
                  fileType: "text/csv",
                })
              }
              text={getText(i18nKeys.OVERVIEW__DOWNLOAD_CSV)}
              variant="secondary"
            />
          </div>

          <MappingTable />
        </>
      )}
      <MappingDrawer selectedDatasetId={selectedDatasetId} />
    </>
  );
};

export default Overview;
