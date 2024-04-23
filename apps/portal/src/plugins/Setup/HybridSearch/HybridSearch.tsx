import React, { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import { Box, Button, Checkbox, Loader, TextField, Title } from "@portal/components";
import { api } from "../../../axios/api";
import { useHybridSearchConfigs } from "../../../hooks";
import { useFeedback, useTranslation } from "../../../contexts";
import "./HybridSearch.scss";

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
  const { getText, i18nKeys } = useTranslation();
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
      setFeedback({ type: "success", message: getText(i18nKeys.HYBRID_SEARCH__SUCCESS), autoClose: 6000 });
    } catch (err: any) {
      console.error(err);

      if (err.data?.message) {
        setFeedback({ type: "error", message: err.data.message });
      } else {
        setFeedback({
          type: "error",
          message: getText(i18nKeys.HYBRID_SEARCH__ERROR),
          description: getText(i18nKeys.HYBRID_SEARCH__ERROR_DESCRIPTION),
        });
      }
    } finally {
      setSaving(false);
    }
  }, [formData, setFeedback, getText]);

  if (error) console.error(error.message);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="hybrid-search">
          <div className="hybrid-search__header">
            <Title>{getText(i18nKeys.HYBRID_SEARCH__CONFIGURATIONS)}</Title>
          </div>
          <div className="hybrid-search__content">
            <Box mb={4}>
              <Checkbox
                checked={formData.isEnabled}
                label={getText(i18nKeys.HYBRID_SEARCH__ENABLE)}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  handleFormDataChange({ isEnabled: event.target.checked })
                }
              />
            </Box>
            <Box mb={4}>
              <TextField
                label={getText(i18nKeys.HYBRID_SEARCH__SEMANTIC_RATIO)}
                variant="standard"
                sx={{ width: "100%" }}
                value={formData.semanticRatio}
                onChange={(event) => handleFormDataChange({ semanticRatio: event.target?.value })}
                error={semanticRatioError}
                helperText={semanticRatioError && getText(i18nKeys.HYBRID_SEARCH__SEMANTIC_RATIO_ERROR)}
              />
            </Box>
            <Box mb={4}>
              <TextField
                label={getText(i18nKeys.HYBRID_SEARCH__EMBEDDINGS_MODEL)}
                variant="standard"
                sx={{ width: "100%" }}
                value={formData.model}
                onChange={(event) => handleFormDataChange({ model: event.target?.value })}
                error={modelError}
                helperText={modelError && getText(i18nKeys.HYBRID_SEARCH__EMBEDDINGS_MODEL_ERROR)}
              />
            </Box>
          </div>
          <div className="hybrid-search__footer">
            <Box display="flex" gap={1} className="hybrid-search__footer-actions">
              <Button text={getText(i18nKeys.HYBRID_SEARCH__SAVE)} onClick={handleSave} loading={saving} />
            </Box>
          </div>
        </div>
      )}
    </>
  );
};
