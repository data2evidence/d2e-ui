import React, { ChangeEvent, FC, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { NodeProps } from "reactflow";
import { Box, Checkbox, TextInput } from "@portal/components";
import { useFormData } from "~/features/flow/hooks";
import {
  markStatusAsDraft,
  selectNodeById,
  setNode,
} from "~/features/flow/reducers";
import { NodeState } from "~/features/flow/types";
import { RootState, dispatch } from "~/store";
import { NodeDrawer, NodeDrawerProps } from "../../NodeDrawer/NodeDrawer";
import { NodeChoiceMap } from "../../NodeTypes";
import { NegatveControlOutcomeNodeData } from "./NegativeControlOutcomeNode";

export interface NegatveControlOutcomeDrawerProps
  extends Omit<NodeDrawerProps, "children"> {
  node: NodeProps<NegatveControlOutcomeNodeData>;
  onClose: () => void;
}

interface FormData extends NegatveControlOutcomeNodeData {}

const EMPTY_FORM_DATA: FormData = {
  name: "",
  description: "",
  occurenceType: "",
  detectOnDescendants: true,
};

export const NegatveControlOutcomeDrawer: FC<
  NegatveControlOutcomeDrawerProps
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
        occurenceType: node.data.occurenceType,
        detectOnDescendants: node.data.detectOnDescendants,
      });
    } else {
      setFormData({
        ...EMPTY_FORM_DATA,
        ...NodeChoiceMap["cohort_generator_node"].defaultData,
      });
    }
  }, [node.data]);

  const handleOk = useCallback(() => {
    const updated: NodeState<NegatveControlOutcomeNodeData> = {
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
          label="OccurenceType"
          value={formData.occurenceType}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onFormDataChange({ occurenceType: e.target.value })
          }
        />
      </Box>
      <Box mb={4}>
        <Checkbox
          checked={formData.detectOnDescendants}
          label="DetectOnDescendants"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onFormDataChange({
              DetectOnDescendants: e.target.checked,
            })
          }
        />
      </Box>
    </NodeDrawer>
  );
};
