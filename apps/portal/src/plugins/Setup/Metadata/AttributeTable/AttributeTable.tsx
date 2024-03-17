import React, { FC, useState, useCallback } from "react";
import { Box, Title } from "@portal/components";
import { useDatasetAttributeConfigs, useDialogHelper } from "../../../../hooks";
import { TableContainer, Table, TableHead, TableBody, Alert } from "@mui/material";
import { Button, EditIcon, IconButton, Loader, TableCell, TableRow, TrashIcon } from "@portal/components";
import { SaveAttributeDialog } from "./SaveAttributeDialog/SaveAttributeDialog";
import { DeleteAttributeDialog } from "./DeleteAttributeDialog/DeleteAttributeDialog";
import { DatasetAttributeConfig } from "../../../../types";
import "./AttributeTable.scss";

const AttributeTable: FC = () => {
  const [refetch, setRefetch] = useState(0);
  const [selectedAttribute, setSelectedAttribute] = useState<DatasetAttributeConfig | undefined>(undefined);
  const [attributeConfigs, loading, error] = useDatasetAttributeConfigs(refetch);
  const [showSaveAttributeDialog, openSaveAttributeDialog, closeSaveAttributeDialog] = useDialogHelper(false);
  const [showDeleteAttributeDialog, openDeleteAttributeDialog, closeDeleteAttributeDialog] = useDialogHelper(false);

  const handleAdd = useCallback(() => {
    setSelectedAttribute(undefined);
    openSaveAttributeDialog();
  }, [openSaveAttributeDialog]);

  const handleEdit = useCallback(
    (attributeId: string) => {
      const selectedAttribute = attributeConfigs.find((attribute) => attribute.id === attributeId);
      setSelectedAttribute(selectedAttribute);
      openSaveAttributeDialog();
    },
    [openSaveAttributeDialog, attributeConfigs]
  );

  const handleDelete = useCallback(
    (attributeId: string) => {
      const selectedAttribute = attributeConfigs.find((attribute) => attribute.id === attributeId);
      setSelectedAttribute(selectedAttribute);
      openDeleteAttributeDialog();
    },
    [openDeleteAttributeDialog, attributeConfigs]
  );

  if (error) {
    return (
      <Alert severity="error" className="alert">
        {error.message}
      </Alert>
    );
  }

  if (loading) {
    return <Loader text="Loading Attribute Configs" />;
  }

  return (
    <>
      <Box>
        <div className="metadata-attribute-table__header">
          <Title>Metadata</Title>
          <div className="metadata-attribute-table__add-button">
            <Button text="Add Attribute" onClick={handleAdd} />
          </div>
        </div>
        <TableContainer className="metadata-attribute-table__table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Attribute Id</TableCell>
                <TableCell>Attribute Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Datatype</TableCell>
                <TableCell>Is Displayed</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attributeConfigs.map((metadataAttribute: DatasetAttributeConfig) => {
                return (
                  <TableRow key={metadataAttribute.id}>
                    <TableCell>{metadataAttribute.id}</TableCell>
                    <TableCell>{metadataAttribute.name}</TableCell>
                    <TableCell>{metadataAttribute.category}</TableCell>
                    <TableCell>{metadataAttribute.dataType}</TableCell>
                    <TableCell>{metadataAttribute.isDisplayed.toString()}</TableCell>
                    <TableCell>
                      <IconButton
                        startIcon={<EditIcon />}
                        title="Edit"
                        onClick={() => handleEdit(metadataAttribute.id)}
                      />
                      <IconButton
                        startIcon={<TrashIcon />}
                        title="Delete"
                        onClick={() => handleDelete(metadataAttribute.id)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <SaveAttributeDialog
        open={showSaveAttributeDialog}
        onClose={closeSaveAttributeDialog}
        attribute={selectedAttribute}
        setRefetch={setRefetch}
      />
      {selectedAttribute && (
        <DeleteAttributeDialog
          open={showDeleteAttributeDialog}
          onClose={closeDeleteAttributeDialog}
          attribute={selectedAttribute}
          setRefetch={setRefetch}
        />
      )}
    </>
  );
};

export default AttributeTable;
