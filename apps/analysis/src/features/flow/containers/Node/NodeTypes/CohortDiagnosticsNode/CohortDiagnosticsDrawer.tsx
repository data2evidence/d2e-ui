import React, { ChangeEvent, FC, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { NodeProps } from "reactflow";
import {
  Box,
  TextInput,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  SelectChangeEvent,
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
import { NodeChoiceMap } from "..";
import { CohortDiagnosticsNodeData } from "./CohortDiagnosticsNode";

export interface CohortIncidentDrawerProps
  extends Omit<NodeDrawerProps, "children"> {
  node: NodeProps<CohortDiagnosticsNodeData>;
  onClose: () => void;
}

const booleanOptions: string[] = ["TRUE", "FALSE"];

interface FormData extends CohortDiagnosticsNodeData {}

const EMPTY_FORM_DATA: FormData = {
  name: "",
  description: "",
  runInclusionStatistics: "TRUE",
  runIncludedSourceConcepts: "TRUE",
  runOrphanConcepts: "TRUE",
  runTimeSeries: "FALSE",
  runVisistContext: "TRUE",
  runBreakdownIndexEvents: "TRUE",
  runIncidenceRate: "TRUE",
  runCohortRelationship: "TRUE",
  runTemporalCohortCharacterization: "TRUE",
  incremental: "FALSE",
};

export const CohortDiagnosticsDrawer: FC<CohortIncidentDrawerProps> = ({
  node,
  onClose,
  ...props
}) => {
  const { formData, setFormData, onFormDataChange } =
    useFormData<FormData>(EMPTY_FORM_DATA);
  const nodeState = useSelector((state: RootState) =>
    selectNodeById(state, node.id)
  );
  const selectBoxConfig = [
    {
      label: "RunInclusionStatistics",
      value: formData.runInclusionStatistics,
      onChange: (value: string) =>
        onFormDataChange({ runInclusionStatistics: value }),
    },
    {
      label: "RunIncludedSourceConcepts",
      value: formData.runIncludedSourceConcepts,
      onChange: (value: string) =>
        onFormDataChange({ runIncludedSourceConcepts: value }),
    },
    {
      label: "RunOrphanConcepts",
      value: formData.runOrphanConcepts,
      onChange: (value: string) =>
        onFormDataChange({ runOrphanConcepts: value }),
    },
    {
      label: "RunTimeSeries",
      value: formData.runTimeSeries,
      onChange: (value: string) => onFormDataChange({ runTimeSeries: value }),
    },
    {
      label: "RunVisistContext",
      value: formData.runVisistContext,
      onChange: (value: string) =>
        onFormDataChange({ runVisistContext: value }),
    },
    {
      label: "RunBreakdownIndexEvents",
      value: formData.runBreakdownIndexEvents,
      onChange: (value: string) =>
        onFormDataChange({ runBreakdownIndexEvents: value }),
    },
    {
      label: "RunIncidenceRate",
      value: formData.runIncidenceRate,
      onChange: (value: string) =>
        onFormDataChange({ runIncidenceRate: value }),
    },
    {
      label: "RunCohortRelationship",
      value: formData.runCohortRelationship,
      onChange: (value: string) =>
        onFormDataChange({ runCohortRelationship: value }),
    },
    {
      label: "RunTemporalCohortCharacterization",
      value: formData.runTemporalCohortCharacterization,
      onChange: (value: string) =>
        onFormDataChange({ runTemporalCohortCharacterization: value }),
    },
    {
      label: "Incremental",
      value: formData.incremental,
      onChange: (value: string) => onFormDataChange({ incremental: value }),
    },
  ];

  useEffect(() => {
    if (node.data) {
      setFormData({
        name: node.data.name,
        description: node.data.description,
        runInclusionStatistics: node.data.runInclusionStatistics,
        runIncludedSourceConcepts: node.data.runIncludedSourceConcepts,
        runOrphanConcepts: node.data.runOrphanConcepts,
        runTimeSeries: node.data.runTimeSeries,
        runVisistContext: node.data.runVisistContext,
        runBreakdownIndexEvents: node.data.runBreakdownIndexEvents,
        runIncidenceRate: node.data.runIncidenceRate,
        runCohortRelationship: node.data.runCohortRelationship,
        runTemporalCohortCharacterization:
          node.data.runTemporalCohortCharacterization,
        incremental: node.data.incremental,
      });
    } else {
      setFormData({
        ...EMPTY_FORM_DATA,
        ...NodeChoiceMap["cohort_diagnostics_node"].defaultData,
      });
    }
  }, [node.data]);

  const handleOk = useCallback(() => {
    const updated: NodeState<CohortDiagnosticsNodeData> = {
      ...nodeState,
      data: formData,
    };
    dispatch(setNode(updated));
    dispatch(markStatusAsDraft());

    typeof onClose === "function" && onClose();
  }, [formData]);

  const renderSelectBox = (
    label: string,
    value: string,
    onChange: (value: string) => void
  ) => (
    <Box mb={4}>
      <FormControl variant="standard" fullWidth>
        <InputLabel shrink>{label}</InputLabel>
        <Select
          value={value}
          onChange={(e: SelectChangeEvent) =>
            onChange(e.target.value as string)
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
  );

  return (
    <NodeDrawer {...props} onOk={handleOk} onClose={onClose} width="500px">
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
      {selectBoxConfig.map(({ label, value, onChange }) =>
        renderSelectBox(label, value, onChange)
      )}
    </NodeDrawer>
  );
};
