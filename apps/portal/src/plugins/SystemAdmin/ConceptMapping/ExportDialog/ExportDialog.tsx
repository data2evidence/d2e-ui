import React, { FC, useCallback, useContext, useState } from "react";
import { FormControl, Table, TableHead, TableBody, TableRow, TableCell, TextField, Box, Divider } from "@mui/material";
import { Button, Dialog } from "@portal/components";
import { CloseDialogType } from "../../../../types";
import { useTranslation } from "../../../../contexts";
import { i18nKeys } from "../../../../contexts/app-context/states";
import { ConceptMappingContext } from "../Context/ConceptMappingContext";
import { dataset } from "../types";
import "./ExportDialog.scss";
import { table } from "console";

interface ExportDialogProps {
  open: boolean;
  onClose?: (type: CloseDialogType) => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  selectedDataset: dataset;
}

interface FormData {
  source_vocabulary_id: string;
}

const EMPTY_FORM_DATA: FormData = { source_vocabulary_id: "" };

const columns = [
  "Source Code",
  "Source Code Description",
  "Target Concept Id",
  "Target Vocabulary Id",
  // "Valid Start Date",
  // "Valid End Date",
];

type conceptMap = {
  sourceCode: string;
  sourceConceptId: number;
  // sourceVocaularyId: string;
  sourceCodeDescription: string;
  targetConceptId: number;
  targetVocabularyId: string;
  validStartDate: string;
  validEndDate: string;
  invalidReason: string;
};

const ExportDialog: FC<ExportDialogProps> = ({ open, onClose, loading, setLoading, selectedDataset }) => {
  const conceptMappingState = useContext(ConceptMappingContext);
  const { getText } = useTranslation();

  const [formData, setFormData] = useState<FormData>(EMPTY_FORM_DATA);
  const { sourceCode, description } = conceptMappingState.columnMapping;

  const tableData: conceptMap[] = conceptMappingState.csvData.data
    .filter((data) => data.status === "checked")
    .map((data) => {
      return {
        sourceCode: data[sourceCode],
        sourceConceptId: 0,
        // sourceVocaularyId: "",
        sourceCodeDescription: data[description],
        targetConceptId: data.conceptId,
        targetVocabularyId: data.system,
        validStartDate: data.validStartDate,
        validEndDate: data.validEndDate,
        invalidReason: data.validity,
      };
    });

  const handleClose = useCallback(
    (type: CloseDialogType) => {
      typeof onClose === "function" && onClose(type);
    },
    [onClose]
  );

  const handleAdd = useCallback(() => {
    console.log("adding");
    console.log(selectedDataset);
    console.log(tableData);
  }, []);

  return (
    <Dialog
      className="export-dialog"
      fullWidth
      maxWidth="lg"
      title={getText(i18nKeys.EXPORT_MAPPING_DIALOG__TITLE)}
      open={open}
      closable
      onClose={() => handleClose("cancelled")}
    >
      <div className="export-dialog__content">
        <div className="export-dialog__table">
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((name: string, index: React.Key) => (
                  <TableCell key={index}>{name}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((dataRow: conceptMap, index: React.Key) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:nth-of-type(even)": {
                      backgroundColor: "#f8f8f8",
                    },
                  }}
                >
                  <TableCell>{dataRow.sourceCode}</TableCell>
                  <TableCell>{dataRow.sourceCodeDescription}</TableCell>
                  <TableCell>{dataRow.targetConceptId}</TableCell>
                  <TableCell>{dataRow.targetVocabularyId}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="export-dialog__form">
          <Box mt={4} fontWeight="bold">
            Concept mapping Configuration
          </Box>
          <FormControl fullWidth>
            <TextField
              variant="standard"
              label={getText(i18nKeys.EXPORT_MAPPING_DIALOG__SOURCE_VOCABULARY_ID)}
              value={formData.source_vocabulary_id}
              onChange={(event) =>
                setFormData((formData) => ({ ...formData, source_vocabulary_id: event.target.value }))
              }
              helperText={getText(i18nKeys.EXPORT_MAPPING_DIALOG__HELPER_TEXT)}
            />
          </FormControl>
        </div>
      </div>
      <Divider />
      <div className="button-group-actions">
        <Button text={"cancel"} onClick={() => handleClose("cancelled")} variant="outlined" block disabled={loading} />
        <Button text={"save"} onClick={handleAdd} block loading={loading} />
      </div>
    </Dialog>
  );
};

export default ExportDialog;
