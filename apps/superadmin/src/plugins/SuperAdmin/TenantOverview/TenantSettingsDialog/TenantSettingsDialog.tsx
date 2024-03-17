import React, { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import { FetchResult, useMutation } from "@apollo/client";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Divider from "@mui/material/Divider";
import { Button, Dialog, Checkbox } from "@portal/components";
import { Feedback, ReplaceFeaturesInput, Tenant, UpdateTenantInput, UsefulEvent } from "../../../../types";
import { REPLACE_FEATURES, UPDATE_TENANT, GET_TENANTS } from "../../../../graphql";
import webComponentWrapper from "../../../../webcomponents/webComponentWrapper";
import { getFeatureFlags, getFeatureFlagsWithChildren } from "../../../../config";
import "./TenantSettingsDialog.scss";

const featureFlags = getFeatureFlags();
const featureFlagsWithChildren = getFeatureFlagsWithChildren();

interface TenantSettingsDialogProps {
  tenant?: Tenant;
  open: boolean;
  onClose?: () => void;
}

interface FormData {
  name: string;
}

interface FormError {
  name: {
    required: boolean;
  };
}

const EMPTY_FORM_DATA: FormData = { name: "" };

const EMPTY_FORM_ERROR: FormError = {
  name: { required: false },
};

const createSubFeaturesDisabledStatus = () => {
  return Object.values(featureFlagsWithChildren).reduce<{ [key: string]: boolean }>((acc, subFeats) => {
    subFeats.forEach((f) => {
      acc[f] = true;
    });
    return acc;
  }, {});
};

const subFeaturesDisabledStatus = createSubFeaturesDisabledStatus();

const TenantSettingsDialog: FC<TenantSettingsDialogProps> = ({ tenant, open, onClose }) => {
  const [feedback, setFeedback] = useState<Feedback>({});

  const [replaceFeatures, { loading: replaceLoading }] = useMutation<
    { replaceFeatures: boolean },
    { input: ReplaceFeaturesInput }
  >(REPLACE_FEATURES, {
    refetchQueries: () => [{ query: GET_TENANTS }],
  });

  const [updateTenant, { loading: updateLoading }] = useMutation<
    { updateTenant: { id: string } },
    { input: UpdateTenantInput }
  >(UPDATE_TENANT, {
    refetchQueries: () => [{ query: GET_TENANTS }],
  });

  const isLoading = replaceLoading || updateLoading;
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM_DATA);
  const [formError, setFormError] = useState<FormError>(EMPTY_FORM_ERROR);
  const [feats, setFeats] = useState<string[]>(tenant?.features?.map((f) => f.feature) || []);

  useEffect(() => {
    if (tenant) {
      setFormData({ name: tenant.name });
    } else {
      setFormData(EMPTY_FORM_DATA);
    }
  }, [tenant]);

  useEffect(() => {
    const parentFeats = feats.filter((f) => Object.keys(featureFlagsWithChildren).includes(f));
    if (parentFeats) {
      parentFeats.forEach((pf) => {
        const subFeats = featureFlagsWithChildren[pf];
        subFeats.forEach((sf) => {
          subFeaturesDisabledStatus[sf] = false;
        });
      });
    }
  }, [feats, featureFlagsWithChildren]);

  const isFormError = useCallback(() => {
    const { name } = formData;

    let formError: FormError | {} = {};
    if (!name) {
      formError = { ...formError, name: { required: true } };
    }
    if (Object.keys(formError).length > 0) {
      setFormError({ ...EMPTY_FORM_ERROR, ...(formError as FormError) });
      return true;
    }
    return false;
  }, [formData]);

  const handleFeatureChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>, feat: string) => {
      if (event.target.checked) {
        if (!feats.includes(feat)) {
          setFeats([...feats, feat]);
        }
        if (featureFlagsWithChildren[feat]) {
          featureFlagsWithChildren[feat].forEach((sf) => {
            subFeaturesDisabledStatus[sf] = false;
          });
        }
      } else {
        setFeats(feats.filter((r) => r !== feat));
        if (featureFlagsWithChildren[feat]) {
          featureFlagsWithChildren[feat].forEach((sf) => {
            subFeaturesDisabledStatus[sf] = true;
          });
        }
      }
    },
    [feats]
  );

  const handleClose = useCallback(() => {
    setFeedback({});
    typeof onClose === "function" && onClose();
  }, [onClose]);

  const hasTenantNameChanges = useCallback(() => {
    return tenant?.name !== formData.name;
  }, [tenant, formData]);

  const hasFeatChanges = useCallback((): boolean => {
    return Object.keys(featureFlags).some((feat) => {
      const isRemove = tenant?.features?.some((f) => f.feature === feat) && !feats.includes(feat);
      const isAdd = !tenant?.features?.some((f) => f.feature === feat) && feats.includes(feat);
      return isRemove || isAdd;
    });
  }, [feats, tenant]);

  const hasChanges = useCallback((): boolean => {
    return hasFeatChanges() || hasTenantNameChanges();
  }, [hasFeatChanges, hasTenantNameChanges]);

  const handleSave = useCallback(async () => {
    if (tenant == null) return;
    if (isFormError()) return;

    setFeedback({});
    setFormError(EMPTY_FORM_ERROR);

    let result: FetchResult<{ replaceFeatures: boolean }> | undefined = undefined;
    let result2: FetchResult<{ updateTenant: { id: string } }> | undefined = undefined;

    try {
      if (hasTenantNameChanges()) {
        result2 = await updateTenant({
          variables: { input: { id: tenant.id, name: formData.name } },
        });
      }

      if (hasFeatChanges()) {
        result = await replaceFeatures({
          variables: { input: { tenantId: tenant.id, features: feats } },
        });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
      console.error(err);
    }

    if (!result?.errors && !result2?.errors) {
      handleClose();
    }
  }, [
    tenant,
    formData.name,
    feats,
    isFormError,
    handleClose,
    replaceFeatures,
    hasFeatChanges,
    hasTenantNameChanges,
    updateTenant,
  ]);

  return (
    <Dialog
      className="tenant-settings-dialog"
      title="Tenant settings"
      closable
      open={open}
      onClose={handleClose}
      feedback={feedback}
    >
      <Divider />
      <div className="tenant-settings-dialog__content">
        <FormControl className="textbox-ctrl" {...(formError.name.required ? { error: true } : {})}>
          <d4l-input
            // @ts-ignore
            ref={webComponentWrapper({
              handleInput: (event: UsefulEvent) => {
                setFormData((formData) => ({
                  ...formData,
                  name: event.target.value,
                }));
              },
            })}
            label="Tenant name"
            value={formData.name}
            style={{ width: "96%" }}
          />
          {formError.name.required && <FormHelperText>This is required</FormHelperText>}
        </FormControl>
        <div className="features__title">Features</div>
        {Object.keys(featureFlags).map((feat) => (
          <Checkbox
            key={feat}
            checked={feats.includes(feat)}
            checkbox-id={featureFlags[feat]}
            label={featureFlags[feat].replace("sub:", "")}
            style={featureFlags[feat].startsWith("sub:") ? { marginLeft: 30 } : {}}
            onChange={(event: ChangeEvent<HTMLInputElement>) => handleFeatureChange(event, feat)}
            disabled={subFeaturesDisabledStatus[feat]}
          />
        ))}
      </div>
      <Divider />
      <div className="button-group-actions">
        <Button text="Cancel" onClick={handleClose} variant="secondary" block disabled={isLoading} />
        <Button text="Save" onClick={handleSave} block loading={isLoading} disabled={!hasChanges()} />
      </div>
    </Dialog>
  );
};

export default TenantSettingsDialog;
