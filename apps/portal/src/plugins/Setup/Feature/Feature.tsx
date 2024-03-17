import React, { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import { Box, Button, Checkbox, Loader, Title } from "@portal/components";
import { useFeatures, useFeedback } from "../../../hooks";
import { api } from "../../../axios/api";
import { IFeature } from "../../../types";
import "./Feature.scss";

interface FormData {
  features: IFeature[];
}

const EMPTY_FORM_DATA: FormData = {
  features: [],
};

const FEATURES: Record<string, { name: string }> = {
  datasetFilter: {
    name: "Dataset filter",
  },
  terminology: {
    name: "Terminology",
  },
  cdmDownload: {
    name: "CDM Download",
  },
  pa: {
    name: "Patient Analytics",
  },
  conceptSets: {
    name: "Concepts",
  },
  cohort: {
    name: "Cohort",
  },
  starboard: {
    name: "Notebooks",
  },
};

export const Feature: FC = () => {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM_DATA);
  const [saving, setSaving] = useState(false);
  const [features, loading, error] = useFeatures();
  const { setFeedback } = useFeedback();

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
  }, [formData]);

  if (error) console.error(error.message);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="feature">
          <div className="feature__header">
            <Title>Feature flags</Title>
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
              <Button text="Save" onClick={handleSave} loading={saving} />
            </Box>
          </div>
        </div>
      )}
    </>
  );
};
