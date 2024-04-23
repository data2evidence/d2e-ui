import React, { FC, useCallback, useContext, useState, useEffect } from "react";
import { Button, Dialog, TablePaginationActions } from "@portal/components";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Paper,
  Divider,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";

import { CloseDialogType } from "../../../../types";
import { ConceptMappingContext, ConceptMappingDispatchContext } from "../Context/ConceptMappingContext";
import "./ImportDialog.scss";
import { useTranslation } from "../../../../contexts";

interface ImportDialogProps {
  open: boolean;
  onClose?: (type: CloseDialogType) => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ImportDialog: FC<ImportDialogProps> = ({ open, onClose, loading, setLoading }) => {
  const { getText, i18nKeys } = useTranslation();
  const conceptMappingState = useContext(ConceptMappingContext);
  const dispatch: React.Dispatch<any> = useContext(ConceptMappingDispatchContext);
  const [columnMappingState, setColumnMappingState] = useState({
    sourceCode: "",
    sourceName: "",
    sourceFrequency: "",
    description: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPageData, setCurrentPageData] = useState([]);
  const importDataCount: number = conceptMappingState.importData.data.length;

  const handleClose = useCallback(
    (type: CloseDialogType) => {
      typeof onClose === "function" && onClose(type);
    },
    [onClose]
  );

  const handleCancel = useCallback(
    (type: CloseDialogType) => {
      typeof onClose === "function" && onClose(type);
      dispatch({ type: "CLEAR_CSV_DATA" });
    },
    [onClose, dispatch]
  );

  const handleColumnMappingChange = useCallback(
    (event: SelectChangeEvent<any>, type: string) => {
      setColumnMappingState({ ...columnMappingState, [type]: event.target.value });
      event.target.value;
    },
    [columnMappingState]
  );

  const handleChangePage = useCallback((event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
    setPage(page);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number(event.target.value) || 10);
    setPage(0);
  }, []);

  const handleImport = useCallback(() => {
    dispatch({ type: "UPDATE_COLUMN_MAPPING", data: columnMappingState });
    dispatch({ type: "ADD_CSV_DATA", data: conceptMappingState.importData });
    dispatch({ type: "CLEAR_IMPORT_DATA" });
    typeof onClose === "function" && onClose("success");
  }, [columnMappingState, dispatch, onClose, conceptMappingState.importData]);

  const titleString = `Import file - ${conceptMappingState.importData.name}`;

  useEffect(() => {
    const initalColumn: string = conceptMappingState.importData.columns[0];
    setColumnMappingState({
      sourceCode: initalColumn,
      sourceName: initalColumn,
      sourceFrequency: initalColumn,
      description: initalColumn,
    });
  }, [conceptMappingState.importData.columns]);

  useEffect(() => {
    setCurrentPageData(conceptMappingState.importData.data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage));
  }, [page, rowsPerPage, conceptMappingState.importData.data]);

  return (
    <Dialog fullWidth maxWidth="lg" title={titleString} open={open} closable onClose={() => handleClose("cancelled")}>
      <Divider></Divider>
      <div className="import-dialog__container">
        <div className="import-dialog__table">
          <TableContainer
            component={Paper}
            sx={{ "& .MuiTableCell-root": { color: "#000080" }, maxHeight: 320, width: 1, border: "1px solid #dad7d7" }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {conceptMappingState.importData.columns.map((data: any, index: React.Key) => (
                    <TableCell key={index}>{data}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {currentPageData.map((dataRow: any, index: React.Key) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:nth-of-type(even)": {
                        backgroundColor: "#f8f8f8",
                      },
                    }}
                  >
                    {Object.values(dataRow).map((data: any) => (
                      <TableCell key={data}>{data}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={importDataCount}
            page={page}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            onPageChange={handleChangePage}
            ActionsComponent={TablePaginationActions}
            sx={{
              overflow: "visible",
              height: "52px",
              "& .MuiButtonBase-root:not(.Mui-disabled)": { color: "#000080" },
            }}
          />
        </div>
        <Divider />

        <div className="import-dialog-selection__container">
          <div className="import-dialog-selection__columns">
            <div className="import-dialog-selection__header">
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {getText(i18nKeys.IMPORT_DIALOG__COLUMN_MAPPING)}
              </Typography>
            </div>
            <FormControl component="fieldset" className="import-dialog__selector">
              <Typography minWidth={200}>n{getText(i18nKeys.IMPORT_DIALOG__SOURCE_CODE_COLUMN)}</Typography>
              <Select
                value={columnMappingState.sourceCode}
                onChange={(e) => handleColumnMappingChange(e, "sourceCode")}
                fullWidth
              >
                {conceptMappingState.importData.columns.map((d: any) => (
                  <MenuItem value={d} key={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl component="fieldset" className="import-dialog__selector">
              <Typography minWidth={200}>{getText(i18nKeys.IMPORT_DIALOG__SOURCE_CODE_NAME)}</Typography>
              <Select
                value={columnMappingState.sourceName}
                onChange={(e) => handleColumnMappingChange(e, "sourceName")}
                fullWidth
              >
                {conceptMappingState.importData.columns.map((d: any) => (
                  <MenuItem value={d} key={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl component="fieldset" className="import-dialog__selector">
              <Typography minWidth={200}>{getText(i18nKeys.IMPORT_DIALOG__SOURCE_FREQUENCY_COLUMN)}</Typography>
              <Select
                value={columnMappingState.sourceFrequency}
                onChange={(e) => handleColumnMappingChange(e, "sourceFrequency")}
                fullWidth
              >
                {conceptMappingState.importData.columns.map((d: any) => (
                  <MenuItem value={d} key={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl component="fieldset" className="import-dialog__selector">
              <Typography minWidth={200}>{getText(i18nKeys.IMPORT_DIALOG__ADDITIONAL_INFO_COLUMN)}</Typography>
              <Select
                value={columnMappingState.description}
                onChange={(e) => handleColumnMappingChange(e, "description")}
                fullWidth
              >
                {conceptMappingState.importData.columns.map((d: any) => (
                  <MenuItem value={d} key={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* <div className="import-dialog-selection__filters">
            <div className="import-dialog-selection__header">
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Filters
              </Typography>
            </div>
          </div> */}
        </div>
      </div>
      <Divider />
      <div className="import-dialog-selection__buttons">
        <Button
          text={getText(i18nKeys.IMPORT_DIALOG__CANCEL)}
          onClick={() => handleCancel("cancelled")}
          variant="secondary"
        ></Button>
        <Button text={getText(i18nKeys.IMPORT_DIALOG__IMPORT)} onClick={handleImport}></Button>
      </div>
    </Dialog>
  );
};

export default ImportDialog;
