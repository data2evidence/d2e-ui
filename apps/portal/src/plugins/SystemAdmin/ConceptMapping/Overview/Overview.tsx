import React, { FC, useState, useContext, useCallback, useEffect } from "react";
import { Title, Button, Card, Tabs, Tab } from "@portal/components";
import { useDatasets, useDialogHelper } from "../../../../hooks";
import { CsvReader } from "../../../../components";
import ImportDialog from "../ImportDialog/ImportDialog";
import ExportDialog from "../ExportDialog/ExportDialog";
import MappingTable from "../MappingTable/MappingTable";
import MappingDrawer from "../MappingDrawer/MappingDrawer";
import { parseToCsv, downloadFile, DownloadColumn } from "../../../../utils/Export";
import { ConceptMappingContext, ConceptMappingDispatchContext } from "../Context/ConceptMappingContext";
import "./Overview.scss";
import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useTranslation } from "../../../../contexts";
import { csvData, dataset } from "../types";
import { DispatchType, ACTION_TYPES } from "../Context/reducers/reducer";
import { SourceToConceptMapTable } from "../SourceToConceptMapTable/SourceToConceptMapTable";

enum ConceptMappingTab {
  MAP,
  VIEW,
}

const Overview: FC = () => {
  const { getText, i18nKeys } = useTranslation();
  const dispatch: React.Dispatch<DispatchType> = useContext(ConceptMappingDispatchContext);
  const conceptMappingState = useContext(ConceptMappingContext);
  const { sourceCode, sourceName, sourceFrequency, description } = conceptMappingState.columnMapping;
  const [datasets] = useDatasets("systemAdmin");

  // local states
  const [loading, setLoading] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<dataset>();
  const [tabValue, setTabValue] = useState<ConceptMappingTab>(ConceptMappingTab.MAP);
  const [showImportDialog, openImportDialog, closeImportDialog] = useDialogHelper(false);
  const [showExportDialog, openExportDialog, closeExportDialog] = useDialogHelper(false);

  const handleCloseImportDialog = useCallback(() => {
    closeImportDialog();
  }, [closeImportDialog]);

  const handleCloseExportDialog = useCallback(() => {
    closeExportDialog();
  }, [closeExportDialog]);

  const handleSelectDataset = useCallback(
    (datasetId: string) => {
      const selectDataset = datasets.find((dataset) => dataset.id === datasetId);
      if (!selectDataset) return;
      setSelectedDataset({
        datasetId: selectDataset.id,
        dialect: selectDataset.dialect!,
      });
    },
    [datasets, setSelectedDataset]
  );

  const handleOnFileLoaded = useCallback(
    (data: csvData) => {
      dispatch({ type: ACTION_TYPES.SET_IMPORT_DATA, payload: data });
      openImportDialog();
    },
    [dispatch, openImportDialog]
  );

  const handleTabSelectionChange = useCallback(async (event: React.SyntheticEvent, newValue: ConceptMappingTab) => {
    setTabValue(newValue);
  }, []);

  useEffect(() => {
    if (!datasets || selectedDataset) return;
    if (datasets?.[0]?.id) {
      setSelectedDataset({ datasetId: datasets[0].id, dialect: datasets[0].dialect! });
    }
  }, [datasets, selectedDataset]);

  const downloadColumns: DownloadColumn[] = [
    { header: getText(i18nKeys.OVERVIEW__SOURCE), accessor: sourceCode },
    { header: getText(i18nKeys.OVERVIEW__NAME), accessor: sourceName },
    { header: getText(i18nKeys.OVERVIEW__FREQUENCY), accessor: sourceFrequency },
    { header: getText(i18nKeys.OVERVIEW__DESCRIPTION), accessor: description },
    { header: getText(i18nKeys.OVERVIEW__CONCEPT_ID), accessor: "conceptId" },
    { header: getText(i18nKeys.OVERVIEW__CONCEPT_NAME), accessor: "conceptName" },
    { header: getText(i18nKeys.OVERVIEW__DOMAIN), accessor: "domainId" },
  ];

  if (!selectedDataset) {
    return null;
  }

  return (
    <div className="concept-mapping__overview">
      <Title>{getText(i18nKeys.OVERVIEW__CONCEPT_MAPPING)}</Title>

      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ marginRight: "10px" }}>{getText(i18nKeys.OVERVIEW__REFERENCE_CONCEPTS)}: </div>
        <FormControl sx={{ marginRight: "20px" }}>
          <Select
            value={selectedDataset.datasetId}
            onChange={(e: SelectChangeEvent) => {
              handleSelectDataset(e.target.value);
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

      <div className="testing">
        <Tabs value={tabValue} onChange={handleTabSelectionChange} centered>
          <Tab
            label={"Map Concepts"}
            value={ConceptMappingTab.MAP}
            sx={{
              "&.MuiTab-root": {
                width: "180px",
              },
            }}
          />
          <Tab
            label={"View Mappings"}
            value={ConceptMappingTab.VIEW}
            sx={{
              "&.MuiTab-root": {
                width: "180px",
              },
            }}
          />
        </Tabs>

        <div>
          {tabValue === ConceptMappingTab.MAP && (
            <>
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
              {showExportDialog && (
                <ExportDialog
                  open={showExportDialog}
                  onClose={handleCloseExportDialog}
                  loading={loading}
                  setLoading={setLoading}
                  selectedDataset={selectedDataset}
                />
              )}
              <br></br>
              {conceptMappingState.csvData.data.length !== 0 && (
                <>
                  <div className="overview-selection__buttons">
                    <Button
                      onClick={() => dispatch({ type: ACTION_TYPES.CLEAR_DATA })}
                      text={getText(i18nKeys.OVERVIEW__CLEAR_AND_IMPORT)}
                    />
                  </div>

                  <MappingTable selectedDataset={selectedDataset} />

                  <div className="overview-selection__buttons">
                    <Button
                      onClick={() =>
                        downloadFile({
                          data: parseToCsv(conceptMappingState.csvData.data, downloadColumns),
                          fileName: "concept_mappings",
                          fileType: "text/csv",
                        })
                      }
                      text={getText(i18nKeys.OVERVIEW__DOWNLOAD_CSV)}
                      variant="outlined"
                    />
                    <Button
                      onClick={openExportDialog}
                      text={getText(i18nKeys.OVERVIEW__SAVE_MAPPINGS)}
                      variant="outlined"
                    />
                  </div>
                </>
              )}
              <MappingDrawer selectedDataset={selectedDataset} />
            </>
          )}
          {tabValue === ConceptMappingTab.VIEW && (
            <SourceToConceptMapTable selectedDataset={selectedDataset.datasetId} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;
