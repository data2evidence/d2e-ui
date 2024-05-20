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
import { NodeChoiceMap } from "..";
import { StudyPopulationSettingsNodeData } from "./StudyPopulationSettingsNode";

export interface StudyPopulationSettingsDrawerProps
  extends Omit<NodeDrawerProps, "children"> {
  node: NodeProps<StudyPopulationSettingsNodeData>;
  onClose: () => void;
}

interface FormData extends StudyPopulationSettingsNodeData {}

const EMPTY_FORM_DATA: FormData = {
  name: "",
  description: "",
  startAnchor: ["cohort start", "cohort start"],
  riskWindowStart: 1,
  endAnchor: ["cohort end", "cohort end"],
  riskWindowEnd: 365,
  minTimeAtRisk: 1,
  studyPopulationArgs: {
    minDaysAtRisk: 1,
    riskWindowStart: 0,
    startAnchor: ["cohort start", "cohort start"],
    riskWindowEnd: 30,
    endAnchor: ["cohort end", "cohort end"],
    minAge: 18,
    naivePeriod: 365,
  },
};

export const StudyPopulationSettingsDrawer: FC<
  StudyPopulationSettingsDrawerProps
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
        startAnchor: node.data.startAnchor,
        riskWindowStart: node.data.riskWindowStart,
        endAnchor: node.data.endAnchor,
        riskWindowEnd: node.data.riskWindowEnd,
        minTimeAtRisk: node.data.minTimeAtRisk,
        studyPopulationArgs: node.data.studyPopulationArgs,
      });
    } else {
      setFormData({
        ...EMPTY_FORM_DATA,
        ...NodeChoiceMap["study_population_settings_node"].defaultData,
      });
    }
  }, [node.data]);

  const handleOk = useCallback(() => {
    const updated: NodeState<StudyPopulationSettingsNodeData> = {
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
          label="Risk Window Start"
          value={formData.riskWindowStart}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onFormDataChange({
              riskWindowStart: e.target.value,
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
        <TextInput
          label="Risk Window End"
          value={formData.riskWindowEnd}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onFormDataChange({
              riskWindowEnd: e.target.value,
            })
          }
          type="number"
        />
      </Box>
      <Box mb={4}>
        <TextInput
          label="Min Time At Risk"
          value={formData.minTimeAtRisk}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onFormDataChange({
              minTimeAtRisk: e.target.value,
            })
          }
          type="number"
        />
      </Box>
      <Box mb={4} border={"0.5px solid grey"} padding={"20px"}>
        <div style={{ paddingBottom: "20px" }}>StudyPopulationArgs</div>
        <Box mb={4}>
          <TextInput
            label="Min Days At Risk"
            value={formData.studyPopulationArgs.minDaysAtRisk}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onFormDataChange({
                studyPopulationArgs: {
                  ...formData.studyPopulationArgs,
                  minDaysAtRisk: e.target.value,
                },
              })
            }
            type="number"
          />
        </Box>
        <Box mb={4}>
          <TextInput
            label="Risk Window Start"
            value={formData.studyPopulationArgs.riskWindowStart}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onFormDataChange({
                studyPopulationArgs: {
                  ...formData.studyPopulationArgs,
                  riskWindowStart: e.target.value,
                },
              })
            }
            type="number"
          />
        </Box>
        <Box mb={4} display="flex">
          <TextInput
            label="startAnchor[0]"
            value={formData.studyPopulationArgs.startAnchor[0]}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onFormDataChange({
                studyPopulationArgs: {
                  ...formData.studyPopulationArgs,
                  startAnchor: [
                    Number(e.target.value),
                    formData.studyPopulationArgs.startAnchor[1],
                  ],
                },
              })
            }
            style={{ marginRight: "30px" }}
          />
          <TextInput
            label="startAnchor[1]"
            value={formData.studyPopulationArgs.startAnchor[1]}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onFormDataChange({
                studyPopulationArgs: {
                  ...formData.studyPopulationArgs,
                  startAnchor: [
                    formData.studyPopulationArgs.startAnchor[0],
                    Number(e.target.value),
                  ],
                },
              })
            }
          />
        </Box>
        <Box mb={4}>
          <TextInput
            label="Risk Window End"
            value={formData.studyPopulationArgs.riskWindowEnd}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onFormDataChange({
                studyPopulationArgs: {
                  ...formData.studyPopulationArgs,
                  riskWindowEnd: e.target.value,
                },
              })
            }
            type="number"
          />
        </Box>
        <Box mb={4} display="flex">
          <TextInput
            label="endAnchor[0]"
            value={formData.studyPopulationArgs.endAnchor[0]}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onFormDataChange({
                studyPopulationArgs: {
                  ...formData.studyPopulationArgs,
                  endAnchor: [
                    Number(e.target.value),
                    formData.studyPopulationArgs.endAnchor[1],
                  ],
                },
              })
            }
            style={{ marginRight: "30px" }}
          />
          <TextInput
            label="endAnchor[1]"
            value={formData.studyPopulationArgs.endAnchor[1]}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onFormDataChange({
                studyPopulationArgs: {
                  ...formData.studyPopulationArgs,
                  endAnchor: [
                    formData.studyPopulationArgs.endAnchor[0],
                    Number(e.target.value),
                  ],
                },
              })
            }
          />
        </Box>
        <Box mb={4}>
          <TextInput
            label="Min Age"
            value={formData.studyPopulationArgs.minAge}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onFormDataChange({
                studyPopulationArgs: {
                  ...formData.studyPopulationArgs,
                  minAge: e.target.value,
                },
              })
            }
            type="number"
          />
        </Box>
        <Box mb={4}>
          <TextInput
            label="Naive Period"
            value={formData.studyPopulationArgs.naivePeriod}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onFormDataChange({
                studyPopulationArgs: {
                  ...formData.studyPopulationArgs,
                  naivePeriod: e.target.value,
                },
              })
            }
            type="number"
          />
        </Box>
      </Box>
    </NodeDrawer>
  );
};
