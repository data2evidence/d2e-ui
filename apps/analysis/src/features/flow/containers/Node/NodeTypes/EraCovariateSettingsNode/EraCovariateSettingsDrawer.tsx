import React, { ChangeEvent, FC, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { NodeProps } from "reactflow";
import { Box, TextInput, Checkbox } from "@portal/components";
import { useFormData } from "~/features/flow/hooks";
import {
  markStatusAsDraft,
  selectNodeById,
  setNode,
} from "~/features/flow/reducers";
import { NodeState } from "~/features/flow/types";
import { RootState, dispatch } from "~/store";
import { NodeDrawer, NodeDrawerProps } from "../../NodeDrawer/NodeDrawer";
import { NodeChoiceMap } from "..";
import { EraCovariateSettingsNodeData } from "./EraCovariateSettingsNode";

export interface EraCovariateSettingsDrawerProps
  extends Omit<NodeDrawerProps, "children"> {
  node: NodeProps<EraCovariateSettingsNodeData>;
  onClose: () => void;
}

interface FormData extends EraCovariateSettingsNodeData {}

const EMPTY_FORM_DATA: FormData = {
  name: "",
  description: "",
  label: "",
  includeEraIds: "",
  start: 0,
  end: 0,
  startAnchor: ["era start", "era start"],
  endAnchor: ["era end", "era end"],
  profileLikelihood: true,
  exposureOfInterest: true,
};

export const EraCovariateSettingsDrawer: FC<
  EraCovariateSettingsDrawerProps
> = ({ node, onClose, ...props }) => {
  const { formData, setFormData, onFormDataChange } =
    useFormData<FormData>(EMPTY_FORM_DATA);
  const nodeState = useSelector((state: RootState) =>
    selectNodeById(state, node.id)
  );

  useEffect(() => {
    if (node.data) {
      setFormData({
        name: node.data.name,
        description: node.data.description,
        label: node.data.label,
        includeEraIds: node.data.includeEraIds,
        start: node.data.start,
        end: node.data.end,
        startAnchor: node.data.startAnchor,
        endAnchor: node.data.endAnchor,
        profileLikelihood: node.data.profileLikelihood,
        exposureOfInterest: node.data.exposureOfInterest,
      });
    } else {
      setFormData({
        ...EMPTY_FORM_DATA,
        ...NodeChoiceMap["era_covariate_settings_node"].defaultData,
      });
    }
  }, [node.data]);

  const handleOk = useCallback(() => {
    const updated: NodeState<EraCovariateSettingsNodeData> = {
      ...nodeState,
      data: formData,
    };
    dispatch(setNode(updated));
    dispatch(markStatusAsDraft());

    typeof onClose === "function" && onClose();
  }, [formData]);

  return (
    <NodeDrawer {...props} width="500px" onOk={handleOk} onClose={onClose}>
      <Box mb={4}>
        <TextInput
          label="Name"
          value={formData.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onFormDataChange({ name: e.target.value })
          }
        />
      </Box>
      <Box mb={4}>
        <TextInput
          label="Description"
          value={formData.description}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onFormDataChange({ description: e.target.value })
          }
        />
      </Box>
      <Box mb={4}>
        <TextInput
          label="Label"
          value={formData.label}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onFormDataChange({ label: e.target.value })
          }
        />
      </Box>
      <Box mb={4}>
        <TextInput
          label="includeEraIds"
          value={formData.includeEraIds}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onFormDataChange({ includeEraIds: e.target.value })
          }
        />
      </Box>
      <Box mb={4}>
        <TextInput
          label="start"
          value={formData.start}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onFormDataChange({
              start: e.target.value,
            })
          }
          type="number"
        />
      </Box>
      <Box mb={4} display="flex">
        <TextInput
          label="startAnchor[0]"
          value={formData.startAnchor[0]}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onFormDataChange({
              startAnchor: [Number(e.target.value), formData.startAnchor[1]],
            })
          }
          style={{ marginRight: "30px" }}
        />
        <TextInput
          label="startAnchor[1]"
          value={formData.startAnchor[1]}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onFormDataChange({
              startAnchor: [formData.startAnchor[0], Number(e.target.value)],
            })
          }
        />
      </Box>
      <Box mb={4}>
        <TextInput
          label="end"
          value={formData.end}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onFormDataChange({
              end: e.target.value,
            })
          }
          type="number"
        />
      </Box>
      <Box mb={4} display="flex">
        <TextInput
          label="endAnchor[0]"
          value={formData.endAnchor[0]}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onFormDataChange({
              endAnchor: [Number(e.target.value), formData.endAnchor[1]],
            })
          }
          style={{ marginRight: "30px" }}
        />
        <TextInput
          label="endAnchor[1]"
          value={formData.endAnchor[1]}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onFormDataChange({
              endAnchor: [formData.endAnchor[0], Number(e.target.value)],
            })
          }
        />
      </Box>
      <Box mb={4}>
        <Checkbox
          checked={formData.profileLikelihood}
          label="Profile Likelihood"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onFormDataChange({
              profileLikelihood: e.target.checked,
            })
          }
        />
      </Box>
      <Box mb={4}>
        <Checkbox
          checked={formData.exposureOfInterest}
          label="Exposure of Interest"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onFormDataChange({
              exposureOfInterest: e.target.checked,
            })
          }
        />
      </Box>
    </NodeDrawer>
  );
};
