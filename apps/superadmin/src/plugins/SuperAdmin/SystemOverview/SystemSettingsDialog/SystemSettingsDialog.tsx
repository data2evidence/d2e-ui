import React, { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import { FetchResult, useMutation, useQuery } from "@apollo/client";
import Divider from "@mui/material/Divider";
import { Button, Dialog, Checkbox } from "@portal/components";
import { Feedback, SystemFeature } from "../../../../types";
import { REPLACE_SYSTEM_FEATURES, SYSTEM_ALL_FEATURE } from "../../../../graphql";
import { getSystemFeatureFlags } from "../../../../config";
import "./SystemSettingsDialog.scss";
import { SystemInfo } from "../SystemOverview";
import { ReplaceSystemFeaturesInput } from "../../../../types/system";

const featureFlags = getSystemFeatureFlags();

interface SystemSettingsDialogProps {
  system?: SystemInfo;
  open: boolean;
  onClose?: () => void;
}

const SystemSettingsDialog: FC<SystemSettingsDialogProps> = ({ system, open, onClose }) => {
  const [feedback, setFeedback] = useState<Feedback>({});

  const { data } = useQuery<{ getSystemAllFeatures: SystemFeature[] }>(SYSTEM_ALL_FEATURE, {
    variables: {
      input: { systemName: system?.system },
    },
  });

  const [replaceSystemFeatures, { loading: replaceLoading }] = useMutation<
    { replaceSystemFeatures: boolean },
    { input: ReplaceSystemFeaturesInput }
  >(REPLACE_SYSTEM_FEATURES, {
    refetchQueries: () => [
      {
        query: SYSTEM_ALL_FEATURE,
        variables: {
          input: { systemName: system?.system },
        },
      },
    ],
  });

  const isLoading = replaceLoading;

  const [feats, setFeats] = useState<string[]>([]);
  const [defaultFeats, setDefaultFeats] = useState<string[]>([]);

  useEffect(() => {
    if (data) {
      const enabledFeatures =
        data &&
        data.getSystemAllFeatures.map((sysFeat) => {
          return sysFeat.feature;
        });
      setFeats(enabledFeatures);
      setDefaultFeats(enabledFeatures);
    }
  }, [data]);

  const handleFeatureChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>, feat: string) => {
      if (event.target.checked) {
        if (!feats.includes(feat)) {
          setFeats([...feats, feat]);
        }
      } else {
        setFeats(feats.filter((r) => r !== feat));
      }
    },
    [feats]
  );

  const handleClose = useCallback(() => {
    setFeedback({});
    typeof onClose === "function" && onClose();
  }, [onClose]);

  const hasFeatChanges = useCallback((): boolean => {
    return Object.keys(featureFlags).some((feat) => {
      const isRemove = defaultFeats.some((f) => f === feat) && !feats.includes(feat);
      const isAdd = !defaultFeats.some((f) => f === feat) && feats.includes(feat);
      return isRemove || isAdd;
    });
  }, [defaultFeats, feats]);

  const hasChanges = useCallback((): boolean => {
    return hasFeatChanges();
  }, [hasFeatChanges]);

  const handleSave = useCallback(async () => {
    if (system == null) return;

    setFeedback({});

    let result: FetchResult<{ replaceSystemFeatures: boolean }> | undefined = undefined;

    try {
      if (hasFeatChanges()) {
        result = await replaceSystemFeatures({
          variables: { input: { systemName: system.system, features: feats } },
        });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
      console.error(err);
    }

    if (!result?.errors) {
      handleClose();
    }
  }, [system, hasFeatChanges, replaceSystemFeatures, feats, handleClose]);

  return (
    <Dialog
      className="system-settings-dialog"
      title="System settings"
      closable
      open={open}
      onClose={handleClose}
      feedback={feedback}
    >
      <Divider />
      <div className="system-settings-dialog__content">
        <div className="features__title">Features</div>
        {Object.keys(featureFlags).map((feat) => (
          <Checkbox
            key={feat}
            checked={feats.includes(feat)}
            checkbox-id={featureFlags[feat]}
            label={featureFlags[feat]}
            onChange={(event: ChangeEvent<HTMLInputElement>) => handleFeatureChange(event, feat)}
          />
        ))}
      </div>
      <Divider />
      <div className="button-group-actions">
        <Button text="Cancel" onClick={handleClose} variant="outlined" block disabled={isLoading} />
        <Button text="Save" onClick={handleSave} block loading={isLoading} disabled={!hasChanges()} />
      </div>
    </Dialog>
  );
};

export default SystemSettingsDialog;
