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
import { NodeChoiceMap } from "..";
import { TargetComparatorOutcomesNodeData } from "./TargetComparatorOutcomesNode";

export interface TargetComparatorOutcomesDrawerProps
  extends Omit<NodeDrawerProps, "children"> {
  node: NodeProps<TargetComparatorOutcomesNodeData>;
  onClose: () => void;
}

interface FormData extends TargetComparatorOutcomesNodeData {}

const EMPTY_FORM_DATA: FormData = {
  name: "",
  description: "",
  trueEffectSize: 1,
  priorOutcomeLookback: 30,
};

export const TargetComparatorOutcomesDrawer: FC<
  TargetComparatorOutcomesDrawerProps
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
        trueEffectSize: node.data.trueEffectSize,
        priorOutcomeLookback: node.data.priorOutcomeLookback,
      });
    } else {
      setFormData({
        ...EMPTY_FORM_DATA,
        ...NodeChoiceMap["target_comparator_outcomes_node"].defaultData,
      });
    }
  }, [node.data]);

  const handleOk = useCallback(() => {
    const updated: NodeState<TargetComparatorOutcomesNodeData> = {
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
      <Box
        mb={4}
        border={"0.5px solid grey"}
        paddingLeft={"20px"}
        paddingTop={"20px"}
      >
        <div style={{ paddingBottom: "20px" }}>Negative Control Outcomes</div>
        <Box mb={4}>
          <TextInput
            label="True Effect Size"
            value={formData.trueEffectSize}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onFormDataChange({
                trueEffectSize: e.target.value,
              })
            }
            type="number"
          />
        </Box>
        <Box mb={4}>
          <TextInput
            label="Prior Outcome Lookback"
            value={formData.priorOutcomeLookback}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onFormDataChange({
                priorOutcomeLookback: e.target.value,
              })
            }
            type="number"
          />
        </Box>
      </Box>
    </NodeDrawer>
  );
};
