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
import { CohortMethodAnalysisNodeData } from "./CohortMethodAnalysisNode";

export interface CohortMethodAnalysisDrawerProps
  extends Omit<NodeDrawerProps, "children"> {
  node: NodeProps<CohortMethodAnalysisNodeData>;
  onClose: () => void;
}

interface FormData extends CohortMethodAnalysisNodeData {}

const EMPTY_FORM_DATA: FormData = {
  name: "",
  description: "Matching on ps and covariates, simple outcomeModel",
  covariant: {
    addDescendantsToExclude: true,
  },
  dbCohortMethodDataArgs: {
    washoutPeriod: 183,
    firstExposureOnly: true,
    removeDuplicateSubjects: "remove all",
    maxCohortSize: 100000,
  },
  modelType: "cox",
  stopOnError: false,
  control: "Cyclops::createControl(cvRepetitions = 1",
  covariateFilter: "FeatureExtraction::getDefaultTable1Specifications()",
};

export const CohortMethodAnalysisDrawer: FC<
  CohortMethodAnalysisDrawerProps
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
        covariant: node.data.covariant,
        dbCohortMethodDataArgs: node.data.dbCohortMethodDataArgs,
        modelType: node.data.modelType,
        stopOnError: node.data.stopOnError,
        control: node.data.control,
        covariateFilter: node.data.covariateFilter,
      });
    } else {
      setFormData({
        ...EMPTY_FORM_DATA,
        ...NodeChoiceMap["cohort_method_analysis_node"].defaultData,
      });
    }
  }, [node.data]);

  const handleOk = useCallback(() => {
    const updated: NodeState<CohortMethodAnalysisNodeData> = {
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
      <Box mb={4} border={"0.5px solid grey"} padding={"20px"}>
        <div style={{ paddingBottom: "20px" }}>Covariant</div>
        <Box mb={4}>
          <Checkbox
            checked={formData.covariant.addDescendantsToExclude}
            label="Add descendants to exclude"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onFormDataChange({
                covariant: { addDescendantsToExclude: e.target.checked },
              })
            }
          />
        </Box>
      </Box>
      <Box mb={4} border={"0.5px solid grey"} padding={"20px"}>
        <div style={{ paddingBottom: "20px" }}>DbCohortMethodDataArgs</div>
        <Box mb={4}>
          <TextInput
            label="Washout Period"
            value={formData.dbCohortMethodDataArgs.washoutPeriod}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onFormDataChange({
                dbCohortMethodDataArgs: {
                  ...formData.dbCohortMethodDataArgs,
                  washoutPeriod: e.target.value,
                },
              })
            }
            type="number"
          />
        </Box>
        <Box mb={4}>
          <Checkbox
            checked={formData.dbCohortMethodDataArgs.firstExposureOnly}
            label="First Exposure Only"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onFormDataChange({
                dbCohortMethodDataArgs: {
                  ...formData.dbCohortMethodDataArgs,
                  firstExposureOnly: e.target.checked,
                },
              })
            }
          />
        </Box>
        <Box mb={4}>
          <TextInput
            label="Remove Duplicate Subjects"
            value={formData.dbCohortMethodDataArgs.removeDuplicateSubjects}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onFormDataChange({
                dbCohortMethodDataArgs: {
                  ...formData.dbCohortMethodDataArgs,
                  removeDuplicateSubjects: e.target.value,
                },
              })
            }
          />
        </Box>
        <Box mb={4}>
          <TextInput
            label="Max Cohort Size"
            value={formData.dbCohortMethodDataArgs.maxCohortSize}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onFormDataChange({
                dbCohortMethodDataArgs: {
                  ...formData.dbCohortMethodDataArgs,
                  maxCohortSize: e.target.value,
                },
              })
            }
            type="number"
          />
        </Box>
      </Box>
      <Box mb={4}>
        <TextInput
          label="Model Type"
          value={formData.modelType}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onFormDataChange({
              modelType: e.target.value,
            })
          }
        />
      </Box>
      <Box mb={4}>
        <Checkbox
          checked={formData.stopOnError}
          label="Stop On Error"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onFormDataChange({
              stopOnError: e.target.checked,
            })
          }
        />
      </Box>
      <Box mb={4}>
        <TextInput
          label="Control"
          value={formData.control}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onFormDataChange({
              control: e.target.value,
            })
          }
        />
      </Box>
      <Box mb={4}>
        <TextInput
          label="CovariateFilter"
          value={formData.covariateFilter}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onFormDataChange({
              covariateFilter: e.target.value,
            })
          }
        />
      </Box>
    </NodeDrawer>
  );
};
