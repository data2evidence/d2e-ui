import { ComponentType } from "react";
import { Node, NodeProps } from "reactflow";
import { NodeDataState } from "../../../types";
import { RNode } from "./RNode/RNode";
import { CohortGeneratorNode } from "./CohortGeneratorNode/CohortGeneratorNode";
import { CohortDiagnosticsNode } from "./CohortDiagnosticsNode/CohortDiagnosticsNode";
import { NegatveControlOutcomeNode } from "./NegativeControlOutcomeNode/NegativeControlOutcomeNode";
import { CharacterizationNode } from "./CharacterizationNode/CharacterizationNode";
import { TimeAtRiskNode } from "./TimeAtRiskNode/TimeAtRiskNode";
import { SelfControlledCaseSeriesNode } from "./SelfControlledCaseSeriesNode/SelfControlledCaseSeriesNode";
import { EraCovariateSettingsNode } from "./EraCovariateSettingsNode/EraCovariateSettingsNode";
import { CalendarTimeCovariateSettingsNode } from "./CalendarTimeCovariateSettingsNode/CalendarTimeCovariateSettingsNode";
import { SeasonalityCovariateSettingsNode } from "./SeasonalityCovariateSettingsNode/SeasonalityCovariateSettingsNode";
import { CohortIncidentNode } from "./CohortIncidentNode/CohortIncidentNode";
import { TargetComparatorOutcomesNode } from "./TargetComparatorOutcomesNode/TargetComparatorOutcomesNode";
import { CohortMethodNode } from "./CohortMethodNode/CohortMethodNode";
import { CohortMethodAnalysisNode } from "./CohortMethodAnalysisNode/CohortMethodAnalysisNode";
import { StudyPopulationSettingsNode } from "./StudyPopulationSettingsNode/StudyPopulationSettingsNode";
import { NodeChoiceAttr, NodeType, NodeTypeChoice, NodeTag } from "./type";

export const NODE_TYPES: {
  [key in NodeType]: ComponentType<NodeProps<any>>;
} = {
  cohort_generator_node: CohortGeneratorNode,
  cohort_diagnostic_node: CohortDiagnosticsNode,
  negative_control_outcome_cohort_node: NegatveControlOutcomeNode,
  cohort_incidence_node: CohortIncidentNode,
  cohort_incidence_target_cohorts_node: RNode,
  time_at_risk_node: TimeAtRiskNode,
  covariate_settings_node: RNode,
  characterization_node: CharacterizationNode,
  target_comparator_outcomes_node: TargetComparatorOutcomesNode,
  cohort_method_analysis_node: CohortMethodAnalysisNode,
  cohort_method_node: CohortMethodNode,
  era_covariate_settings_node: EraCovariateSettingsNode,
  calendar_time_covariate_settings_node: CalendarTimeCovariateSettingsNode,
  seasonality_covariate_settings_node: SeasonalityCovariateSettingsNode,
  self_controlled_case_series_analysis_node: RNode,
  self_controlled_case_series_node: SelfControlledCaseSeriesNode,
  patient_level_prediction_node: RNode,
  study_population_settings_node: StudyPopulationSettingsNode,
};

export const NODE_COLORS: {
  [key in NodeType]: string;
} = {
  cohort_generator_node: "lightgrey",
  cohort_diagnostic_node: "grey",
  negative_control_outcome_cohort_node: "lime",
  cohort_incidence_node: "cyan",
  cohort_incidence_target_cohorts_node: "aquamarine",
  time_at_risk_node: "wheat",
  covariate_settings_node: "darkgreen",
  characterization_node: "darkgreen",
  target_comparator_outcomes_node: "indigo",
  cohort_method_analysis_node: "lavender",
  cohort_method_node: "mediumpurple",
  era_covariate_settings_node: "chocolate",
  calendar_time_covariate_settings_node: "chocolate",
  seasonality_covariate_settings_node: "chocolate",
  self_controlled_case_series_analysis_node: "red",
  self_controlled_case_series_node: "darkred",
  patient_level_prediction_node: "magenta",
  study_population_settings_node: "lightpink",
};

export const NodeChoiceMap: { [key in NodeTypeChoice]: NodeChoiceAttr } = {
  cohort_generator_node: {
    title: "Cohort Generator Module Specifications",
    description: "Run cohort generator code.",
    tag: NodeTag.Lightgrey,
    defaultData: {
      incremental: true,
      generateStats: true,
    },
  },
  cohort_diagnostic_node: {
    title: "Cohort Diagnostic Module Specifications",
    description: "Run cohort diagnostic starboard.",
    tag: NodeTag.Grey,
    defaultData: {
      runInclusionStatistics: true,
      runIncludedSourceConcepts: true,
      runOrphanConcepts: true,
      runTimeSeries: false,
      runVisistContext: true,
      runBreakdownIndexEvents: true,
      runIncidenceRate: true,
      runCohortRelationship: true,
      runTemporalCohortCharacterization: true,
      incremental: false,
    },
  },
  negative_control_outcome_cohort_node: {
    title: "Negative Control Outcome Cohort Shared Resource Specifications",
    description: "Run negative control outcome cohort.",
    tag: NodeTag.Lime,
    defaultData: {
      occurenceType: "all",
      detectOnDescendants: true,
    },
  },
  cohort_incidence_node: {
    title: "Cohort Incidence",
    description: "Run cohort incidence code.",
    tag: NodeTag.Cyan,
    defaultData: {
      byYear: true,
      byGender: true,
    },
  },
  cohort_incidence_target_cohorts_node: {
    title: "Cohort Incidence Target Cohorts",
    description: "Run cohort incidence target cohorts code.",
    tag: NodeTag.Aquamarine,
    defaultData: {},
  },
  time_at_risk_node: {
    title: "Time At Risk",
    description: "Run time at risk code.",
    tag: NodeTag.Wheat,
    defaultData: {
      riskWindowStart: [1, 1],
      riskWindowEnd: [1, 1],
      startAnchor: ["cohort start", "cohort start"],
      endAnchor: ["cohort end", "cohort end"],
    },
  },
  covariate_settings_node: {
    title: "Covariate Settings",
    description: "Run covariate settings code.",
    tag: NodeTag.Darkgreen,
    defaultData: {},
  },
  characterization_node: {
    title: "Characterization",
    description: "JSON analysis specification for executing HADES modules",
    tag: NodeTag.Darkgreen,
    defaultData: {
      dechallengeStopiterval: 0,
      dechallengeEvaluationWindow: 0,
    },
  },
  target_comparator_outcomes_node: {
    title: "Target Compartor Outcomes",
    description: "Run target comparator outcomes code",
    tag: NodeTag.Indigo,
    defaultData: {
      trueEffectSize: 1,
      priorOutcomeLookback: 30,
    },
  },
  cohort_method_analysis_node: {
    title: "Cohort Method Analysis",
    description: "Run cohort method analysis code",
    tag: NodeTag.Lavender,
    defaultData: {
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
    },
  },
  cohort_method_node: {
    title: "Cohort Method",
    description: "Run cohort method code.",
    tag: NodeTag.Mediumpurple,
    defaultData: {},
  },
  era_covariate_settings_node: {
    title: "Era Covariate Settings",
    description: "Run era covariate settings code.",
    tag: NodeTag.Chocolate,
    defaultData: {
      label: "Main",
      includeEraIds: "exposureId",
      start: 0,
      end: 0,
      startAnchor: ["era start", "era start"],
      endAnchor: ["era end", "era end"],
      profileLikelihood: true,
      exposureOfInterest: true,
    },
  },
  calendar_time_covariate_settings_node: {
    title: "Calendar Time Covariate Settings",
    description: "Run calendar time covariate settings code.",
    tag: NodeTag.Chocolate,
    defaultData: {
      caldendarTimeKnots: 5,
      allowRegularization: true,
      computeConfidenceIntervals: false,
    },
  },
  seasonality_covariate_settings_node: {
    title: "Seasonality Covariate Settings",
    description: "Run seasonality covariate settings code.",
    tag: NodeTag.Chocolate,
    defaultData: {
      seasonalityKnots: 5,
      allowRegularization: true,
      computeConfidenceIntervals: false,
    },
  },
  self_controlled_case_series_analysis_node: {
    title: "Self Controlled Case Series Analysis",
    description: "Run self-controlled case series analysis code.",
    tag: NodeTag.Red,
    defaultData: {},
  },
  self_controlled_case_series_node: {
    title: "Self Controlled Case Series",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    tag: NodeTag.Darkred,
    defaultData: {
      combineDataFetchAcrossOutcomes: false,
    },
  },
  patient_level_prediction_node: {
    title: "Patient Level Prediction",
    description:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.",
    tag: NodeTag.Magenta,
    defaultData: {},
  },
  study_population_settings_node: {
    title: "Study Population Settings",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    tag: NodeTag.Lightpink,
    defaultData: {
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
    },
  },
};

export const getNodeColors = (node: Node<NodeDataState>) => {
  if (node.type && Object.keys(NODE_COLORS).includes(node.type)) {
    return NODE_COLORS[node.type as NodeType];
  }
  return "#999fcb";
};

export const getNodeClassName = (node: Node<NodeDataState>) => {
  if (node.type === "start") {
    return "node--round";
  }
  return "";
};

export type { NodeType };
export * from "./SelectNodeTypes/SelectNodeTypesDialog";
export * from "./type";
