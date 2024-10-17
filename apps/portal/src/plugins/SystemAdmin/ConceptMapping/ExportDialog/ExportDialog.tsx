import React, { FC, useCallback, useContext, useState } from "react";
import { ConceptMappingContext, ConceptMappingDispatchContext } from "../Context/ConceptMappingContext";
import { Button, Dialog } from "@portal/components";
import { DispatchType } from "../Context/reducers/reducer";
import { CloseDialogType } from "../../../../types";
import "./ExportDialog.scss";
import { FormControl, Table, TableHead, TableBody, TableRow, TableCell, TextField, Box, Divider } from "@mui/material";

interface ExportDialogProps {
  open: boolean;
  onClose?: (type: CloseDialogType) => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
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

const titleString = "Export mappings to database";
const ExportDialog: FC<ExportDialogProps> = ({ open, onClose, loading, setLoading }) => {
  const conceptMappingState = useContext(ConceptMappingContext);
  const dispatch: React.Dispatch<DispatchType> = useContext(ConceptMappingDispatchContext);
  const { sourceCode, description } = conceptMappingState.columnMapping;

  const [formData, setFormData] = useState<FormData>(EMPTY_FORM_DATA);

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

  console.log(tableData);
  const handleClose = useCallback(
    (type: CloseDialogType) => {
      typeof onClose === "function" && onClose(type);
    },
    [onClose]
  );

  const handleAdd = useCallback(() => {
    console.log("adding");
  }, []);

  return (
    <Dialog
      className="export-dialog"
      fullWidth
      maxWidth="lg"
      title={titleString}
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
              label={"SOURCE VOCABULARY ID"}
              value={formData.source_vocabulary_id}
              onChange={(event) =>
                setFormData((formData) => ({ ...formData, source_vocabulary_id: event.target.value }))
              }
              helperText={"id should be more than 100 so that it can be easily identified as a non-OMOP vocabulary"}
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
