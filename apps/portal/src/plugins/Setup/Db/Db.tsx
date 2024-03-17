import React, { FC, useCallback, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";
import Alert from "@mui/material/Alert";
import { Button, EditIcon, IconButton, Loader, TableCell, TableRow, Title, TrashIcon } from "@portal/components";
import { useDatabases, useDialogHelper } from "../../../hooks";
import { CloseDialogType, IDatabase } from "../../../types";
import { SaveDbDialog } from "./SaveDbDialog/SaveDbDialog";
import { EditDbCredentialDialog } from "./EditDbCredentialDialog/EditDbCredentialDialog";
import { DeleteDbDialog } from "./DeleteDbDialog/DeleteDbDialog";
import "./Db.scss";

export const Db: FC = () => {
  const [refetch, setRefetch] = useState(0);
  const [databases, loading, error] = useDatabases(refetch);
  const [selectedDb, setSelectedDb] = useState<IDatabase>();
  const [showSaveDialog, openSaveDialog, closeSaveDialog] = useDialogHelper(false);
  const [showEditDialog, openEditDialog, closeEditDialog] = useDialogHelper(false);
  const [showDeleteDialog, openDeleteDialog, closeDeleteDialog] = useDialogHelper(false);

  const handleAdd = useCallback(() => {
    setSelectedDb(undefined);
    openSaveDialog();
  }, [openSaveDialog]);

  const handleCloseSaveDialog = useCallback(
    (type: CloseDialogType) => {
      if (type === "success") {
        setRefetch((refetch) => refetch + 1);
      }
      closeSaveDialog();
    },
    [closeSaveDialog]
  );

  const handleEdit = useCallback(
    (db: IDatabase) => {
      setSelectedDb(db);
      openEditDialog();
    },
    [openEditDialog]
  );

  const handleDelete = useCallback(
    (db: IDatabase) => {
      setSelectedDb(db);
      openDeleteDialog();
    },
    [openDeleteDialog]
  );

  const handleCloseEditDialog = useCallback(
    (type: CloseDialogType) => {
      if (type === "success") {
        setRefetch((refetch) => refetch + 1);
      }
      closeEditDialog();
    },
    [closeEditDialog]
  );

  const handleCloseDeleteDialog = useCallback(
    (type: CloseDialogType) => {
      if (type === "success") {
        setRefetch((refetch) => refetch + 1);
      }
      closeDeleteDialog();
    },
    [closeDeleteDialog]
  );

  if (error) {
    return (
      <Alert severity="error" className="alert">
        {error.message}
      </Alert>
    );
  }

  if (loading) {
    return <Loader text="Loading databases" />;
  }

  return (
    <div className="db">
      <div className="db__header">
        <Title>Databases</Title>
        <div className="db__add-button">
          <Button text="Add database" onClick={handleAdd} />
        </div>
      </div>
      <TableContainer className="db__list">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Host</TableCell>
              <TableCell>Port</TableCell>
              <TableCell>Dialect</TableCell>
              <TableCell style={{ width: "280px" }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {databases?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No data available
                </TableCell>
              </TableRow>
            )}
            {databases?.map((db) => (
              <TableRow key={db.id}>
                <TableCell>{db.code}</TableCell>
                <TableCell>{db.host}</TableCell>
                <TableCell>{db.port}</TableCell>
                <TableCell>{db.dialect}</TableCell>
                <TableCell>
                  <IconButton startIcon={<EditIcon />} title="Edit credentials" onClick={() => handleEdit(db)} />
                  <IconButton startIcon={<TrashIcon />} title="Delete" onClick={() => handleDelete(db)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <SaveDbDialog open={showSaveDialog} onClose={handleCloseSaveDialog} />
      {selectedDb && <EditDbCredentialDialog open={showEditDialog} onClose={handleCloseEditDialog} db={selectedDb} />}
      {selectedDb && <DeleteDbDialog open={showDeleteDialog} onClose={handleCloseDeleteDialog} db={selectedDb} />}
    </div>
  );
};
