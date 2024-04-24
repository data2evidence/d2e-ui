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
import { CohortIncidentNodeData } from "./CohortIncidentNode";

export interface CohortIncidentDrawerProps
  extends Omit<NodeDrawerProps, "children"> {
  node: NodeProps<CohortIncidentNodeData>;
  onClose: () => void;
}

interface FormData extends CohortIncidentNodeData {}

const EMPTY_FORM_DATA: FormData = {
  name: "",
  description: "",
  byYear: true,
  byGender: true,
};

export const CohortIncidentDrawer: FC<CohortIncidentDrawerProps> = ({
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
        byYear: node.data.byYear,
        byGender: node.data.byGender,
      });
    } else {
      setFormData({
        ...EMPTY_FORM_DATA,
        ...NodeChoiceMap["cohort_incidence_node"].defaultData,
      });
    }
  }, [node.data]);

  const handleOk = useCallback(() => {
    const updated: NodeState<CohortIncidentNodeData> = {
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
        <div style={{ paddingBottom: "20px" }}>Strata Settings</div>
        <Box mb={4}>
          <Checkbox
            checked={formData.byYear}
            label="By Year"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onFormDataChange({
                byYear: e.target.checked,
              })
            }
          />
        </Box>
        <Box mb={4}>
          <Checkbox
            checked={formData.byGender}
            label="By Gender"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onFormDataChange({
                byGender: e.target.checked,
              })
            }
          />
        </Box>
      </Box>
    </NodeDrawer>
  );
};
