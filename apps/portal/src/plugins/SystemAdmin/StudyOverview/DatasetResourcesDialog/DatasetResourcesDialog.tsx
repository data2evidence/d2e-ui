import React, { ChangeEvent, FC, useCallback, useState } from "react";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import { DownloadIcon, IconButton, Loader, TableCell, TableRow, TrashIcon } from "@portal/components";
import { Button, Dialog } from "@portal/components";
import DatasetResourceUploadConfirmDialog from "./DatasetResourceUploadConfirmDialog/DatasetResourceUploadConfirmDialog";
import DatasetDeleteResourceDialog from "./DatasetDeleteResourceDialog/DatasetDeleteResourceDialog";
import { useDatasetResources, useDialogHelper } from "../../../../hooks";
import { Study, Feedback, DatasetResource, CloseDialogType } from "../../../../types";
import { api } from "../../../../axios/api";
import { saveBlobAs } from "../../../../utils";
import "./DatasetResourcesDialog.scss";

interface DatasetResourcesDialogProps {
  study?: Study;
  open: boolean;
  onClose?: () => void;
}

const DatasetResourcesDialog: FC<DatasetResourcesDialogProps> = ({ study, open, onClose }) => {
  const datasetId = study?.id || "";
  const [hasChanges, setHasChanges] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>({});
  const hiddenFileInput = React.useRef<HTMLInputElement>(null);
  const [refetch, setRefetch] = useState(0);
  const [resources, loading, error] = useDatasetResources(datasetId, refetch);
  const [showConfirmDialog, openConfirmDialog, closeConfirmDialog] = useDialogHelper(false);
  const [showDeleteDialog, openDeleteDialog, closeDeleteDialog] = useDialogHelper(false);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [activeResource, setActiveResource] = useState<DatasetResource>();
  const [downloading, setDownloading] = useState<string>();

  const handleClose = useCallback(() => {
    setFeedback({});
    typeof onClose === "function" && onClose();
  }, [onClose, setFeedback]);

  const handleAddFile = useCallback(() => {
    setFeedback({});

    if (hiddenFileInput.current !== null) {
      hiddenFileInput.current.click();
    }
  }, [hiddenFileInput]);

  const handleConfirmUpload = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length == 0) return;

      setSelectedFile(e.target.files[0]);
      openConfirmDialog();
    },
    [openConfirmDialog]
  );

  const handleConfirmUploadClose = useCallback(
    async (type: CloseDialogType) => {
      if (!datasetId) return;

      if (type === "success") {
        setHasChanges(true);
        setRefetch((refetch) => refetch + 1);
      }

      closeConfirmDialog();
    },
    [closeConfirmDialog, datasetId]
  );

  const handleDownloadResource = useCallback(
    async (resource: DatasetResource) => {
      try {
        setDownloading(resource.name);
        const blob = await api.systemPortal.downloadResource(datasetId, resource.name);
        saveBlobAs(blob, resource.name);
      } finally {
        setDownloading(undefined);
      }
    },
    [datasetId]
  );

  const handleDeleteResource = useCallback(
    (resource: DatasetResource) => {
      setActiveResource(resource);
      openDeleteDialog();
    },
    [openDeleteDialog]
  );

  const handleDeleteResourceClose = useCallback(
    async (type: CloseDialogType) => {
      if (!datasetId) return;

      if (type === "success") {
        setHasChanges(true);

        setFeedback({
          type: "success",
          message: `File deleted successfully.`,
        });

        setRefetch((refetch) => refetch + 1);
      }

      closeDeleteDialog();
    },
    [closeDeleteDialog, datasetId]
  );

  if (error) console.error(error.message);
  if (loading) return <Loader />;

  return (
    <>
      <Dialog
        className="dataset-resources-dialog"
        title={`Resources - ${study?.studyDetail?.name || "Untitled"}`}
        closable
        open={open}
        onClose={() => handleClose()}
        feedback={feedback}
        maxWidth="md"
      >
        <Divider />
        <div className="dataset-resources-dialog__content">
          <div className="dataset-resources-dialog__content-header">
            <Button text="Add file" onClick={handleAddFile} />
            <input
              type="file"
              name="resourceFile"
              ref={hiddenFileInput}
              onChange={handleConfirmUpload}
              onClick={() => {
                if (hiddenFileInput.current) {
                  hiddenFileInput.current.value = "";
                }
              }}
              style={{ display: "none" }}
            />
          </div>
          <Table className="dataset-resources-dialog__content-table">
            <colgroup>
              <col />
              <col style={{ width: 140 }} />
              <col style={{ width: 100 }} />
              <col style={{ width: 240 }} />
            </colgroup>
            <TableHead>
              <TableRow>
                <TableCell>Filename</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>File</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(!resources || resources.length === 0) && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No file available
                  </TableCell>
                </TableRow>
              )}
              {resources.map((res) => (
                <TableRow key={res.name}>
                  <TableCell style={{ color: "#000e7e" }}>{res.name}</TableCell>
                  <TableCell style={{ color: "#000e7e" }}>{res.size}</TableCell>
                  <TableCell style={{ color: "#000e7e" }}>{res.type}</TableCell>
                  <TableCell>
                    <IconButton
                      startIcon={<DownloadIcon />}
                      title="Download"
                      onClick={() => handleDownloadResource(res)}
                      loading={downloading === res.name}
                    />
                    <IconButton startIcon={<TrashIcon />} title="Delete" onClick={() => handleDeleteResource(res)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Divider />
        <div className="button-group-actions">
          <Button text="Cancel" onClick={handleClose} variant="secondary" block disabled={hasChanges} />
          <Button text="Done" onClick={handleClose} block disabled={!hasChanges} />
        </div>
      </Dialog>
      {study?.id && (
        <DatasetResourceUploadConfirmDialog
          datasetId={study.id}
          file={selectedFile}
          open={showConfirmDialog}
          onClose={handleConfirmUploadClose}
        />
      )}
      {study?.id && activeResource && (
        <DatasetDeleteResourceDialog
          datasetId={study.id}
          resource={activeResource}
          open={showDeleteDialog}
          onClose={handleDeleteResourceClose}
        />
      )}
    </>
  );
};

export default DatasetResourcesDialog;
