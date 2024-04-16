import React, { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Divider from "@mui/material/Divider";
import { FormControl, InputLabel, Box, Button, Checkbox, Dialog, TextField } from "@portal/components";
import { api } from "../../../../../axios/api";
import { useFeedback } from "../../../../../contexts";
import { CloseDialogType, DatasetAttributeConfig } from "../../../../../types";
import "./SaveAttributeDialog.scss";

interface SaveAttributeDialogProps {
  open: boolean;
  onClose?: (type: CloseDialogType) => void;
  attribute?: DatasetAttributeConfig;
  setRefetch: React.Dispatch<React.SetStateAction<number>>;
}

const ATTRIBUTE_CATEGORIES = ["DATASET", "FILE"];
const ATTRIBUTE_DATATYPES = ["STRING", "NUMBER", "TIMESTAMP"];

interface FormData {
  id: string;
  name: string;
  category: string;
  dataType: string;
  isDisplayed: boolean;
}

const EMPTY_FORM_DATA: FormData = {
  id: "",
  name: "",
  category: ATTRIBUTE_CATEGORIES[0],
  dataType: ATTRIBUTE_DATATYPES[0],
  isDisplayed: true,
};

export const SaveAttributeDialog: FC<SaveAttributeDialogProps> = ({ open, onClose, attribute, setRefetch }) => {
  const { setFeedback } = useFeedback();
  const [saving, setSaving] = useState(false);

  // If attribute is provided, it means that form will be in edit mode
  const isEditMode = attribute ? true : false;
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM_DATA);

  useEffect(() => {
    setFormData(attribute ? attribute : EMPTY_FORM_DATA);
  }, [attribute, open]);

  const handleFormDataChange = useCallback((updates: { [field: string]: any }) => {
    setFormData((formData) => ({ ...formData, ...updates }));
  }, []);

  const handleClose = useCallback(
    (type: CloseDialogType) => {
      setFormData(EMPTY_FORM_DATA);
      typeof onClose === "function" && onClose(type);
    },
    [onClose]
  );

  const handleSave = useCallback(async () => {
    try {
      setSaving(true);
      if (isEditMode) {
        await api.systemPortal.updateDatasetAttributeConfig(formData);
      } else {
        await api.systemPortal.addDatasetAttributeConfig(formData);
      }
      setFeedback({
        type: "success",
        message: `Attribute Config added successfully.`,
        autoClose: 6000,
      });
      setRefetch((refetch) => refetch + 1);
      setFormData(EMPTY_FORM_DATA);
      handleClose("success");
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.data.error,
        description: err.data.message,
        autoClose: 6000,
      });
    } finally {
      setSaving(false);
    }
  }, [handleClose, formData, setRefetch, setFeedback, isEditMode]);

  return (
    <Dialog
      className="save-attribute-dialog"
      title={isEditMode ? "Edit Attribute" : "Add Attribute"}
      closable
      open={open}
      onClose={() => handleClose("cancelled")}
    >
      <Divider />
      <>
        <div className="save-attribute-dialog__content">
          <Box mb={4}>
            <TextField
              label="Attribute Id"
              variant="standard"
              sx={{ width: "100%" }}
              disabled={isEditMode}
              value={formData.id}
              onChange={(event) => handleFormDataChange({ id: event.target?.value })}
            />
          </Box>
          <Box mb={4}>
            <TextField
              label="Attribute Name"
              variant="standard"
              sx={{ width: "100%" }}
              value={formData.name}
              onChange={(event) => handleFormDataChange({ name: event.target?.value })}
            />
          </Box>
          <Box mb={4}>
            <FormControl fullWidth>
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                label="Category"
                id="category-select"
                value={formData.category}
                onChange={(event) => handleFormDataChange({ category: event.target?.value })}
              >
                {ATTRIBUTE_CATEGORIES.map((category) => (
                  <MenuItem value={category} key={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box mb={4}>
            <FormControl fullWidth>
              <InputLabel id="datatype-select-label">Datatype</InputLabel>
              <Select
                labelId="datatype-select-label"
                label="Datatype"
                id="datatype-select"
                value={formData.dataType}
                onChange={(event) => handleFormDataChange({ dataType: event.target?.value })}
              >
                {ATTRIBUTE_DATATYPES.map((dataType) => (
                  <MenuItem value={dataType} key={dataType}>
                    {dataType}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box mb={4}>
            <Checkbox
              checked={formData.isDisplayed}
              label="Display in overview page"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                handleFormDataChange({ isDisplayed: event.target.checked });
              }}
            />
          </Box>
        </div>
        <div className="save-attribute-dialog__footer">
          <Box display="flex" gap={1} className="save-attribute-dialog__footer-actions">
            <Button text="Cancel" variant="secondary" onClick={() => handleClose("cancelled")} />
            <Button text="Save" onClick={handleSave} loading={saving} />
          </Box>
        </div>
      </>
    </Dialog>
  );
};
