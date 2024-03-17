import React, { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import { Box, Button, Checkbox, Loader, TextField, Title } from "@portal/components";
import { api } from "../../../axios/api";
import "./HybridSearch.scss";
import { useHybridSearchConfigs, useFeedback } from "../../../hooks";

interface FormData {
  id: number;
  isEnabled: boolean;
  semanticRatio: number;
  model: string;
}

const EMPTY_FORM_DATA: FormData = {
  id: 1,
  isEnabled: false,
  semanticRatio: 0.5,
  model: "neuml/pubmedbert-base-embeddings",
};

export const HybridSearch: FC = () => {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM_DATA);
  const [saving, setSaving] = useState(false);
  const { setFeedback } = useFeedback();
  const [configs, loading, error] = useHybridSearchConfigs();

  useEffect(() => {
    if (configs) {
      const saved: FormData = {
        id: configs.id,
        isEnabled: configs.isEnabled,
        semanticRatio: configs.semanticRatio,
        model: configs.model,
      };
      setFormData(saved);
    } else {
      setFormData(EMPTY_FORM_DATA);
    }
  }, [configs]);

  const handleFormDataChange = useCallback((updates: { [field: string]: any }) => {
    setFormData((formData) => ({ ...formData, ...updates }));
  }, []);

  const modelError = !formData.model;

  const semanticRatioError = formData.semanticRatio < 0 || formData.semanticRatio > 1 || isNaN(formData.semanticRatio);

  const handleSave = useCallback(async () => {
    try {
      setSaving(true);
      await api.terminology.updateHybridSearchConfig(formData);
      setFeedback({ type: "success", message: "Changes saved", autoClose: 6000 });
    } catch (err: any) {
      console.error(err);

      if (err.data?.message) {
        setFeedback({ type: "error", message: err.data.message });
      } else {
        setFeedback({
          type: "error",
          message: "An error has occurred.",
          description: "Please try again. To report the error, please send an email to help@data4life.care.",
        });
      }
    } finally {
      setSaving(false);
    }
  }, [formData, setFeedback]);

  if (error) console.error(error.message);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="hybrid-search">
          <div className="hybrid-search__header">
            <Title>Hybrid Search Configurations</Title>
          </div>
          <div className="hybrid-search__content">
            <Box mb={4}>
              <Checkbox
                checked={formData.isEnabled}
                label="Enable Hybrid Search"
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  handleFormDataChange({ isEnabled: event.target.checked })
                }
              />
            </Box>
            <Box mb={4}>
              <TextField
                label="Semantic Ratio"
                variant="standard"
                sx={{ width: "100%" }}
                value={formData.semanticRatio}
                onChange={(event) => handleFormDataChange({ semanticRatio: event.target?.value })}
                error={semanticRatioError}
                helperText={semanticRatioError && "Semantic ratio must have a value between 0 and 1"}
              />
            </Box>
            <Box mb={4}>
              <TextField
                label="Embeddings Model"
                variant="standard"
                sx={{ width: "100%" }}
                value={formData.model}
                onChange={(event) => handleFormDataChange({ model: event.target?.value })}
                error={modelError}
                helperText={modelError && "Embeddings model cannot be empty"}
              />
            </Box>
          </div>
          <div className="hybrid-search__footer">
            <Box display="flex" gap={1} className="hybrid-search__footer-actions">
              <Button text="Save" onClick={handleSave} loading={saving} />
            </Box>
          </div>
        </div>
      )}
    </>
  );
};
