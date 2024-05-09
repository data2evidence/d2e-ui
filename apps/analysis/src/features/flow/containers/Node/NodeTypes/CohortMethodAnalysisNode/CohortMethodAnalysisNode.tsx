import React from "react";
import { NodeProps } from "reactflow";
import { useBooleanHelper } from "~/features/flow/hooks";
import { NodeDataState } from "../../../../types";
import { NodeLayout } from "../../NodeLayout/NodeLayout";
import { ResultsDrawer } from "../../../Flow/FlowRunResults/ResultsDrawer";
import { CohortMethodAnalysisDrawer } from "./CohortMethodAnalysisDrawer";
import "./CohortMethodAnalysisNode.scss";

interface Covariant {
  addDescendantsToExclude: boolean;
}

interface DbCohortMethodDataArgs {
  washoutPeriod: number;
  firstExposureOnly: boolean;
  removeDuplicateSubjects: string;
  maxCohortSize: number;
}

export interface CohortMethodAnalysisNodeData extends NodeDataState {
  covariant: Covariant;
  dbCohortMethodDataArgs: DbCohortMethodDataArgs;
  modelType: string;
  stopOnError: boolean;
  // TODO: check the type of :: function in R, how to represent in the UI, currently use string
  control: string;
  covariateFilter: string;
}

export const CohortMethodAnalysisNode = (
  node: NodeProps<CohortMethodAnalysisNodeData>
) => {
  const { data } = node;
  const [settingVisible, openSetting, closeSetting] = useBooleanHelper(false);
  const [resultVisible, openResult, closeResult] = useBooleanHelper(false);

  return (
    <>
      <NodeLayout<CohortMethodAnalysisNodeData>
        className="cohort-method-analysis-node"
        name={data.name}
        onSettingClick={openSetting}
        resultType={data.error ? "error" : "success"}
        onResultClick={data.result ? openResult : null}
        node={node}
      >
        {data.description}
      </NodeLayout>
      <CohortMethodAnalysisDrawer
        node={node}
        title="Configure Cohort Method Analysis Node"
        className="cohort-method-analysis-drawer"
        open={settingVisible}
        onClose={closeSetting}
      />
      <ResultsDrawer
        open={resultVisible}
        onClose={closeResult}
        title={data.name}
        error={data.error}
        message={data.error ? data.errorMessage : data.result}
        createdDate={data.resultDate}
      />
    </>
  );
};
