import React, {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { NodeProps } from "reactflow";
import { Box, TextInput, IconButton, AddSquareIcon } from "@portal/components";
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
import {
  TimeAtRiskConfigsForm,
  TimeAtRiskConfigsFormError,
  EMPTY_TIMEATRISK_FORM_DATA,
} from "./TimeAtRiskConfigsForm/TimeAtRiskConfigsForm";

export interface TimeAtRiskDrawerProps
  extends Omit<NodeDrawerProps, "children"> {
  node: NodeProps<TimeAtRiskNodeData>;
  onClose: () => void;
}

interface FormData extends TimeAtRiskNodeData {}

const EMPTY_FORM_DATA: FormData = {
  name: "",
  description: "",
  timeAtRiskConfigs: [
    {
      riskWindowStart: 1,
      riskWindowEnd: 1,
      startAnchor: "cohort start",
      endAnchor: "cohort end",
    },
  ],
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
  const [dashboardErrorIndex, setDashboardErrorIndex] = useState<
    Record<number, TimeAtRiskConfigsFormError>
  >({});

  useEffect(() => {
    if (node.data) {
      setFormData({
        name: node.data.name,
        description: node.data.description,
        timeAtRiskConfigs: node.data.timeAtRiskConfigs,
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

  const handleRemove = useCallback(
    (indexToRemove: number) => {
      onFormDataChange({
        timeAtRiskConfigs: [
          ...formData.timeAtRiskConfigs.slice(0, indexToRemove),
          ...formData.timeAtRiskConfigs.slice(indexToRemove + 1),
        ],
      });
    },
    [formData]
  );

  const handleChange = useCallback(
    (
      indexToUpdate: number,
      riskWindowStart: number,
      riskWindowEnd: number,
      startAnchor: string,
      endAnchor: string
    ) => {
      onFormDataChange({
        timeAtRiskConfigs: [
          ...formData.timeAtRiskConfigs.slice(0, indexToUpdate),
          {
            ...formData.timeAtRiskConfigs[indexToUpdate],
            riskWindowStart,
            riskWindowEnd,
            startAnchor,
            endAnchor,
          },
          ...formData.timeAtRiskConfigs.slice(indexToUpdate + 1),
        ],
      });
    },
    [formData]
  );

  return (
    <NodeDrawer {...props} width="800px" onOk={handleOk} onClose={onClose}>
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
        <Box fontWeight="bold" mb={1}>
          Time At Risk Dataframe Configs
        </Box>
        {formData.timeAtRiskConfigs.length !== 0 &&
          formData.timeAtRiskConfigs.map((data, index) => (
            <TimeAtRiskConfigsForm
              key={index}
              index={index}
              configs={data}
              onRemove={() => handleRemove(index)}
              onChange={(
                riskWindowStart: number,
                riskWindowEnd: number,
                startAnchor: string,
                endAnchor: string
              ) =>
                handleChange(
                  index,
                  riskWindowStart,
                  riskWindowEnd,
                  startAnchor,
                  endAnchor
                )
              }
              error={dashboardErrorIndex[index]}
            />
          ))}
        <Box mt={2}>
          <IconButton
            startIcon={<AddSquareIcon />}
            title="Add timeAtRisk configuration"
            onClick={() =>
              setFormData((prevFormData) => ({
                ...prevFormData,
                timeAtRiskConfigs: [
                  ...prevFormData.timeAtRiskConfigs,
                  EMPTY_TIMEATRISK_FORM_DATA,
                ],
              }))
            }
          />
        </Box>
      </Box>
    </NodeDrawer>
  );
};
