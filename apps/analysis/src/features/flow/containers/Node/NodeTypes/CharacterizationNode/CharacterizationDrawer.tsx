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
import { CharacterizationNodeData } from "./CharacterizationNode";

export interface CharacterizationDrawerProps
  extends Omit<NodeDrawerProps, "children"> {
  node: NodeProps<CharacterizationNodeData>;
  onClose: () => void;
}

interface FormData extends CharacterizationNodeData {}

const EMPTY_FORM_DATA: FormData = {
  name: "",
  description: "",
  dechallengeStopiterval: 0,
  dechallengeEvaluationWindow: 0,
};

export const CharacterizationDrawer: FC<CharacterizationDrawerProps> = ({
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
        dechallengeStopiterval: node.data.dechallengeStopiterval,
        dechallengeEvaluationWindow: node.data.dechallengeEvaluationWindow,
      });
    } else {
      setFormData({
        ...EMPTY_FORM_DATA,
        ...NodeChoiceMap["characterization_node"].defaultData,
      });
    }
  }, [node.data]);

  const handleOk = useCallback(() => {
    const updated: NodeState<CharacterizationNodeData> = {
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
          label="DechallengeStopiterval"
          value={formData.dechallengeStopiterval}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onFormDataChange({ dechallengeStopiterval: e.target.value })
          }
          type="number"
        />
      </Box>
      <Box mb={4}>
        <TextInput
          label="DechallengeEvaluationWindow"
          value={formData.dechallengeEvaluationWindow}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onFormDataChange({ dechallengeEvaluationWindow: e.target.value })
          }
          type="number"
        />
      </Box>
    </NodeDrawer>
  );
};
