import React from "react";
import { NodeProps } from "reactflow";
import { useBooleanHelper } from "~/features/flow/hooks";
import { NodeDataState } from "../../../../types";
import { NodeLayout } from "../../NodeLayout/NodeLayout";
import { ResultsDrawer } from "../../../Flow/FlowRunResults/ResultsDrawer";
import { StudyPopulationSettingsDrawer } from "./StudyPoplulationSettingsDrawer";
import "./StudyPopulationSettingsNode.scss";

interface StudyPopulationArgs {
  minDaysAtRisk: number;
  riskWindowStart: number;
  startAnchor: string[];
  riskWindowEnd: number;
  endAnchor: string[];
  minAge: number;
  naivePeriod: number;
}

export interface StudyPopulationSettingsNodeData extends NodeDataState {
  startAnchor: string[];
  riskWindowStart: number;
  endAnchor: string[];
  riskWindowEnd: number;
  minTimeAtRisk: number;
  studyPopulationArgs: StudyPopulationArgs;
}

export const StudyPopulationSettingsNode = (
  node: NodeProps<StudyPopulationSettingsNodeData>
) => {
  const { data } = node;
  const [settingVisible, openSetting, closeSetting] = useBooleanHelper(false);
  const [resultVisible, openResult, closeResult] = useBooleanHelper(false);

  return (
    <>
      <NodeLayout<StudyPopulationSettingsNodeData>
        className="study-population-settings-node"
        name={data.name}
        onSettingClick={openSetting}
        resultType={data.error ? "error" : "success"}
        onResultClick={data.result ? openResult : null}
        node={node}
      >
        {data.description}
      </NodeLayout>
      <StudyPopulationSettingsDrawer
        node={node}
        title="Configure Study Population Settings Node"
        className="study-population-settings-drawer"
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
