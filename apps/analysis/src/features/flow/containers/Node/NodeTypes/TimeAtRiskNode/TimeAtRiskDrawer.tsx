import React, { ChangeEvent, FC, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { NodeProps } from "reactflow";
import { Box, TextInput } from "@portal/components";
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
import { TimeAtRiskNodeData } from "./TimeAtRiskNode";

export interface TimeAtRiskDrawerProps
  extends Omit<NodeDrawerProps, "children"> {
  node: NodeProps<TimeAtRiskNodeData>;
  onClose: () => void;
}

interface FormData extends TimeAtRiskNodeData {}

const EMPTY_FORM_DATA: FormData = {
  name: "",
  description: "",
  riskWindowStart: [1, 1],
  riskWindowEnd: [1, 1],
  startAnchor: ["cohort start", "cohort start"],
  endAnchor: ["cohort end", "cohort end"],
};

export const TimeAtRiskDrawer: FC<TimeAtRiskDrawerProps> = ({
  node,
  onClose,
  ...props
}) => {
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
        riskWindowStart: node.data.riskWindowStart,
        riskWindowEnd: node.data.riskWindowEnd,
        startAnchor: node.data.startAnchor,
        endAnchor: node.data.endAnchor,
      });
    } else {
      setFormData({
        ...EMPTY_FORM_DATA,
        ...NodeChoiceMap["time_at_risk_node"].defaultData,
      });
    }
  }, [node.data]);

  const handleOk = useCallback(() => {
    const updated: NodeState<TimeAtRiskNodeData> = {
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

      <Box mb={4} display="flex">
        <TextInput
          label="riskWindowStart[0]"
          value={formData.riskWindowStart[0]}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onFormDataChange({
              riskWindowStart: [
                Number(e.target.value),
                formData.riskWindowStart[1],
              ],
            })
          }
          type="number"
          style={{ marginRight: "30px" }}
        />
        <TextInput
          label="riskWindowStart[1]"
          value={formData.riskWindowStart[1]}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onFormDataChange({
              riskWindowStart: [
                formData.riskWindowStart[0],
                Number(e.target.value),
              ],
            })
          }
          type="number"
        />
      </Box>

      <Box mb={4} display="flex">
        <TextInput
          label="riskWindowEnd[0]"
          value={formData.riskWindowEnd[0]}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onFormDataChange({
              riskWindowStart: [
                Number(e.target.value),
                formData.riskWindowEnd[1],
              ],
            })
          }
          type="number"
          style={{ marginRight: "30px" }}
        />
        <TextInput
          label="riskWindowEnd[1]"
          value={formData.riskWindowEnd[1]}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onFormDataChange({
              riskWindowStart: [
                formData.riskWindowEnd[0],
                Number(e.target.value),
              ],
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
    </NodeDrawer>
  );
};
