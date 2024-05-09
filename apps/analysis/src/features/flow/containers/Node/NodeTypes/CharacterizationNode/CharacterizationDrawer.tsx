import React, { ChangeEvent, FC, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { NodeProps } from "reactflow";
import { Box, TextInput, Autocomplete, TextField } from "@portal/components";
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
import { CONFIGS_USER_INPUT_ARRAY_STYLES } from "../common";

export interface CharacterizationDrawerProps
  extends Omit<NodeDrawerProps, "children"> {
  node: NodeProps<CharacterizationNodeData>;
  onClose: () => void;
}

interface FormData extends CharacterizationNodeData {}

const EMPTY_FORM_DATA: FormData = {
  name: "",
  description: "",
  dechallengeStopInterval: 0,
  dechallengeEvaluationWindow: 0,
  minPriorObservation: 0,
  targetIds: ["1", "2"],
  outcomeIds: ["3", "2"],
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
        dechallengeStopInterval: node.data.dechallengeStopInterval,
        dechallengeEvaluationWindow: node.data.dechallengeEvaluationWindow,
        minPriorObservation: node.data.minPriorObservation,
        targetIds: node.data.targetIds,
        outcomeIds: node.data.outcomeIds,
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

  const handleTargetIdsChange = useCallback((event: any, value: string[]) => {
    onFormDataChange({ targetIds: value });
  }, []);

  const handleOutcomeIdsChange = useCallback((event: any, value: string[]) => {
    onFormDataChange({ outcomeIds: value });
  }, []);

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
          label="DechallengeStopInterval"
          value={formData.dechallengeStopInterval}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onFormDataChange({ dechallengeStopInterval: e.target.value })
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
      <Box mb={4}>
        <TextInput
          label="minPriorObservation"
          value={formData.minPriorObservation}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onFormDataChange({ minPriorObservation: e.target.value })
          }
          type="number"
        />
      </Box>
      <Box mb={4}>
        <Autocomplete
          multiple
          sx={CONFIGS_USER_INPUT_ARRAY_STYLES}
          value={formData.targetIds}
          onChange={handleTargetIdsChange}
          options={[]}
          freeSolo
          renderInput={(params) => (
            <TextField
              {...params}
              label="TargetIds"
              placeholder="Enter Target ID"
            />
          )}
        />
      </Box>
      <Box mb={4}>
        <Autocomplete
          multiple
          sx={CONFIGS_USER_INPUT_ARRAY_STYLES}
          value={formData.outcomeIds}
          onChange={handleOutcomeIdsChange}
          options={[]}
          freeSolo
          renderInput={(params) => (
            <TextField
              {...params}
              label="OutcomeIds"
              placeholder="Enter Outcome ID"
            />
          )}
        />
      </Box>
    </NodeDrawer>
  );
};
