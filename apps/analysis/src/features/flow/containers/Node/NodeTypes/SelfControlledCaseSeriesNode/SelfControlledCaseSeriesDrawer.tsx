import React, { ChangeEvent, FC, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { NodeProps } from "reactflow";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextInput,
} from "@portal/components";
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
import { SelfControlledCaseSeriesNodeData } from "./SelfControlledCaseSeriesNode";

export interface SelfControlledCaseSeriesDrawerProps
  extends Omit<NodeDrawerProps, "children"> {
  node: NodeProps<SelfControlledCaseSeriesNodeData>;
  onClose: () => void;
}

const booleanOptions: string[] = ["TRUE", "FALSE"];

interface FormData extends SelfControlledCaseSeriesNodeData {}

const EMPTY_FORM_DATA: FormData = {
  name: "",
  description: "",
  combineDataFetchAcrossOutcomes: "FALSE",
};

export const SelfControlledCaseSeriesDrawer: FC<
  SelfControlledCaseSeriesDrawerProps
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
        combineDataFetchAcrossOutcomes:
          node.data.combineDataFetchAcrossOutcomes,
      });
    } else {
      setFormData({
        ...EMPTY_FORM_DATA,
        ...NodeChoiceMap["self_controlled_case_series_node"].defaultData,
      });
    }
  }, [node.data]);

  const handleOk = useCallback(() => {
    const updated: NodeState<SelfControlledCaseSeriesNodeData> = {
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
        <FormControl variant="standard" fullWidth>
          <InputLabel shrink>CombineDataFetchAcrossOutcomes</InputLabel>
          <Select
            value={formData.combineDataFetchAcrossOutcomes}
            onChange={(e: SelectChangeEvent) =>
              onFormDataChange({
                combineDataFetchAcrossOutcomes: e.target.value,
              })
            }
          >
            <MenuItem value="">&nbsp;</MenuItem>
            {booleanOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </NodeDrawer>
  );
};
