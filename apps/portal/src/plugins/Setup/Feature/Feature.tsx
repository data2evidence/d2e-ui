import React, { ChangeEvent, FC, useCallback, useEffect, useMemo, useState } from "react";
import { Box, Button, Checkbox, Loader, Title } from "@portal/components";
import { useFeatures, useFeedback } from "../../../hooks";
import { api } from "../../../axios/api";
import { IFeature } from "../../../types";
import "./Feature.scss";
import { TranslationContext } from "../../../contexts/TranslationContext";

interface FormData {
  features: IFeature[];
}

const EMPTY_FORM_DATA: FormData = {
  features: [],
};

export const Feature: FC = () => {
  const { getText, i18nKeys } = TranslationContext();
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM_DATA);
  const [saving, setSaving] = useState(false);
  const [features, loading, error] = useFeatures();
  const { setFeedback } = useFeedback();

  const FEATURES: Record<string, { name: string }> = useMemo(
    () => ({
      datasetFilter: {
        name: getText(i18nKeys.FEATURE__DATASET_FILTER),
      },
      terminology: {
        name: getText(i18nKeys.FEATURE__TERMINOLOGY),
      },
      cdmDownload: {
        name: getText(i18nKeys.FEATURE__CDM_DOWNLOAD),
      },
      pa: {
        name: getText(i18nKeys.FEATURE__PATIENT_ANALYTICS),
      },
      conceptSets: {
        name: getText(i18nKeys.FEATURE__CONCEPTS),
      },
      cohort: {
        name: getText(i18nKeys.FEATURE__COHORT),
      },
      starboard: {
        name: getText(i18nKeys.FEATURE__NOTEBOOKS),
      },
      dataflow: {
        name: getText(i18nKeys.FEATURE__DATAFLOW),
      },
    }),
    [getText]
  );

  useEffect(() => {
    setFormData({ features });
  }, [features]);

  const handleFormDataChange = useCallback((updates: { [field: string]: any }) => {
    setFormData((formData) => ({ ...formData, ...updates }));
  }, []);

  const handleSave = useCallback(async () => {
    try {
      setSaving(true);
      await api.systemPortal.setFeatures(formData.features);
      setFeedback({ type: "success", message: getText(i18nKeys.FEATURE__SUCCESS), autoClose: 6000 });
    } catch (err: any) {
      console.error(err);

      if (err.data?.message) {
        setFeedback({ type: "error", message: err.data.message });
      } else {
        setFeedback({
          type: "error",
          message: getText(i18nKeys.FEATURE__ERROR),
          description: getText(i18nKeys.FEATURE__ERROR_DESCRIPTION),
        });
      }
    } finally {
      setSaving(false);
    }
  }, [formData, getText]);

  if (error) console.error(error.message);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="feature">
          <div className="feature__header">
            <Title>{getText(i18nKeys.FEATURE__FEATURE_FLAGS)}</Title>
          </div>
          <div className="feature__content">
            {formData.features
              .sort((a, b) => Object.keys(FEATURES).indexOf(a.feature) - Object.keys(FEATURES).indexOf(b.feature))
              .map((feat) => (
                <Box key={feat.feature} className="feature__item">
                  <Checkbox
                    checked={feat.isEnabled}
                    label={FEATURES[feat.feature]?.name}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      handleFormDataChange({
                        features: formData.features.map((f) =>
                          f.feature === feat.feature ? { ...f, isEnabled: event.target.checked } : f
                        ),
                      })
                    }
                  />
                </Box>
              ))}
          </div>
          <div className="feature__footer">
            <Box display="flex" gap={1} className="feature__footer-actions">
              <Button text={getText(i18nKeys.FEATURE__SAVE)} onClick={handleSave} loading={saving} />
            </Box>
          </div>
        </div>
      )}
    </>
  );
};
