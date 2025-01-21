import React, { FC, useCallback } from "react";
import { Divider, TableContainer, Table, TableBody, TableRow, TableCell, Alert } from "@mui/material";
import { Dialog, Text, Loader } from "@portal/components";
import { Study, CloseDialogType } from "../../../../types";
import { useTranslation } from "../../../../contexts";
import { i18nKeys } from "../../../../contexts/app-context/states";
import { useFhirProjectClientApplication } from "../../../../hooks";
import "./FhirProjectCredentialsDialog.scss";

interface FhirProjectCredentialsDialogProps {
  dataset?: Study;
  open: boolean;
  onClose?: (type: CloseDialogType) => void;
}

const FhirProjectCredentialsDialog: FC<FhirProjectCredentialsDialogProps> = ({ dataset, open, onClose }) => {
  const { getText } = useTranslation();
  const handleClose = useCallback(
    (type: CloseDialogType) => {
      typeof onClose === "function" && onClose(type);
    },
    [onClose]
  );

  const [fhirProjectClientApplication, loading, error] = useFhirProjectClientApplication(dataset?.studyDetail?.name!);

  if (error) {
    return (
      <Alert severity="error" className="alert">
        {error.message}
      </Alert>
    );
  }

  return (
    <Dialog
      className="fhir-project-credentials-dialog"
      title={getText(i18nKeys.FHIR_PROJECT_CREDENTIALS_DIALOG__TITLE, [String(dataset?.id)])}
      open={open}
      onClose={() => handleClose("cancelled")}
      closable
      fullWidth
      maxWidth="md"
    >
      <Divider />
      <div className="fhir-project-credentials-dialog__content">
        {loading ? (
          <Loader text={getText(i18nKeys.FHIR_PROJECT_CREDENTIALS_DIALOG__LOADER)} />
        ) : (
          <TableContainer className="fhir-project-credentials-dialog__list">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell width="20%">{getText(i18nKeys.FHIR_PROJECT_CREDENTIALS_DIALOG__CLIENT_ID)}</TableCell>
                  <TableCell>
                    <Text textFormat="wrap" showCopy>
                      {fhirProjectClientApplication?.id!}
                    </Text>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell width="20%">{getText(i18nKeys.FHIR_PROJECT_CREDENTIALS_DIALOG__CLIENT_SECRET)}</TableCell>
                  <TableCell>
                    <Text textFormat="wrap" showCopy>
                      {fhirProjectClientApplication?.secret!}
                    </Text>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </Dialog>
  );
};

export default FhirProjectCredentialsDialog;
