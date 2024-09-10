import { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Divider from "@mui/material/Divider";
import { Box, Button, Checkbox, Dialog } from "@portal/components";
import { TransformationConfig, useField } from "../../contexts";
import {
  EMPTY_SQL_TRANSFORMATION_FUNCTION,
  EPMTY_SQL_TRANSFORMATION_FORM_DATA,
  SqlTransformation,
} from "./SqlTransformation/SqlTransformation";
import { getPreviewSql } from "./SqlTransformation/VisualTransformation/function/transformation-function";
import "./TransformConfigDialog.scss";

type CloseDialogType = "success" | "cancelled";

interface TransformConfigDialogProps {
  handleId?: string;
  open: boolean;
  onClose?: (type: CloseDialogType) => void;
}

interface FormData extends TransformationConfig {
  canSwitchToVisualMode: boolean;
}

const EMPTY_FORM_DATA: FormData = {
  ...EPMTY_SQL_TRANSFORMATION_FORM_DATA,
  isLookupEnabled: true,
  lookup: "",
};

enum TabChoice {
  SQL_FUNC,
  LOOKUP,
}

export const TransformConfigDialog: FC<TransformConfigDialogProps> = ({ handleId, open, onClose }) => {
  const { targetHandles, setFieldTargetHandles } = useField();
  const handle = targetHandles.find((h) => h.id === handleId);
  const columnName = handle?.data.label;
  const columnType = handle?.data.columnType;

  const [tabValue, setTabValue] = useState(TabChoice.SQL_FUNC);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM_DATA);

  useEffect(() => {
    if (!open) return;

    if (handle?.data) {
      const isSqlEnabled = handle.data.isSqlEnabled == null ? true : handle.data.isSqlEnabled;
      const sqlViewMode = handle.data.sqlViewMode || "visual";
      const canSwitchToVisualMode = handle.data.canSwitchToVisualMode || true;
      const functions = handle.data.functions || [EMPTY_SQL_TRANSFORMATION_FUNCTION];
      const sql = getPreviewSql(columnName, columnType, functions);
      const isLookupEnabled = handle.data.isLookupEnabled || false;
      const lookup = handle.data.lookup || "";

      setFormData({
        isSqlEnabled,
        sqlViewMode,
        canSwitchToVisualMode,
        functions,
        sql,
        isLookupEnabled,
        lookup,
      });
    } else {
      setFormData(EMPTY_FORM_DATA);
    }
  }, [open, handle, columnName, columnType]);

  const handleFormDataChange = useCallback((updates: { [field: string]: any }) => {
    setFormData((formData) => ({ ...formData, ...updates }));
  }, []);

  const handleApply = useCallback(() => {
    setFieldTargetHandles(
      targetHandles.map((h) => (h.id === handleId ? { ...h, data: { ...h.data, ...formData } } : h))
    );
    typeof onClose === "function" && onClose("success");
  }, [targetHandles, formData]);

  const handleClose = useCallback(
    (type: CloseDialogType) => {
      typeof onClose === "function" && onClose(type);
    },
    [onClose]
  );

  const handleTabSelectionChange = useCallback(async (_: React.SyntheticEvent, value: number) => {
    setTabValue(value);
  }, []);

  return (
    <Dialog
      className="transform-config-dialog"
      title={`Apply Transformation (${columnName})`}
      open={open}
      onClose={() => handleClose("cancelled")}
      fullWidth
      maxWidth="sm"
    >
      <Divider />
      <div className="transform-config-dialog__content">
        <Tabs value={tabValue} onChange={handleTabSelectionChange}>
          <Tab label="SQL Function" />
          <Tab label="Lookup" />
        </Tabs>
        {tabValue === TabChoice.SQL_FUNC && (
          <SqlTransformation
            data={formData}
            onChange={(data) => {
              const functions = data.functions || formData.functions || [];
              const sql = getPreviewSql(columnName, columnType, functions);
              const isSqlMatched = formData.sql === sql;

              const isModeChanged = "sqlViewMode" in data;
              const isSwitchToVisual = isModeChanged && data.sqlViewMode === "visual";
              const canSwitchToVisualMode = data.canSwitchToVisualMode || formData.canSwitchToVisualMode;
              const isVisualChanged = !isModeChanged && canSwitchToVisualMode && formData.sqlViewMode === "visual";

              if (isVisualChanged) {
                handleFormDataChange({ ...data, sql });
              } else if (isSwitchToVisual) {
                handleFormDataChange({ ...data, canSwitchToVisualMode: isSqlMatched });
              } else {
                handleFormDataChange({ ...data });
              }
            }}
          />
        )}
        {tabValue === TabChoice.LOOKUP && (
          <Box py={4}>
            <Checkbox
              label="Enabled"
              checked={formData.isLookupEnabled}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleFormDataChange({ isLookupEnabled: e.target.checked })
              }
            />
          </Box>
        )}
      </div>
      <Divider />
      <div className="button-group-actions">
        <Button block text="Cancel" variant="outlined" onClick={() => handleClose("cancelled")} />
        <Button block text="Apply" variant="contained" onClick={handleApply} />
      </div>
    </Dialog>
  );
};
