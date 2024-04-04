import { ComponentType } from "react";
import { Node, NodeProps } from "reactflow";
import { NodeDataState } from "../../../types";
import { RNode } from "./RNode/RNode";
import { NodeChoiceAttr, NodeType, NodeTypeChoice, NodeTag } from "./type";

export const NODE_TYPES: {
  [key in NodeType]: ComponentType<NodeProps<any>>;
} = {
  cohort_generator_node: RNode,
  cohort_diagnostic_node: RNode,
  negative_control_outcome_cohort_node: RNode,
  cohort_incidence_node: RNode,
  cohort_incidence_target_cohorts_node: RNode,
  time_at_risk_node: RNode,
  covariate_settings_node: RNode,
  characterization_node: RNode,
  target_compartor_outcomes_node: RNode,
  cohort_method_analysis_node: RNode,
  cohort_method_node: RNode,
  era_covariate_settings_node: RNode,
  calendar_time_covariate_settings_node: RNode,
  seasonality_covariate_settings_node: RNode,
  self_controlled_case_series_analysis_node: RNode,
  self_controlled_case_series_node: RNode,
  patient_level_prediction_node: RNode,
  study_poplulation_settings_node: RNode,
};

export const NODE_COLORS: {
  [key in NodeType]: string;
} = {
  cohort_generator_node: "#999fcb",
  cohort_diagnostic_node: "#999fcb",
  negative_control_outcome_cohort_node: "#999fcb",
  cohort_incidence_node: "#999fcb",
  cohort_incidence_target_cohorts_node: "#999fcb",
  time_at_risk_node: "#999fcb",
  covariate_settings_node: "#999fcb",
  characterization_node: "#999fcb",
  target_compartor_outcomes_node: "#999fcb",
  cohort_method_analysis_node: "#999fc",
  cohort_method_node: "#999fcb",
  era_covariate_settings_node: "#999fcb",
  calendar_time_covariate_settings_node: "#999fcb",
  seasonality_covariate_settings_node: "#999fcb",
  self_controlled_case_series_analysis_node: "#999fcb",
  self_controlled_case_series_node: "#999fcb",
  patient_level_prediction_node: "#999fcb",
  study_poplulation_settings_node: "#999fcb",
};

export const NodeChoiceMap: { [key in NodeTypeChoice]: NodeChoiceAttr } = {
  cohort_generator_node: {
    title: "Cohort Generator Module Specifications",
    description: "Run cohort generator code.",
    tag: NodeTag.Stable,
    defaultData: {
      r_code: `source("https://raw.githubusercontent.com/OHDSI/CohortGeneratorModule/v0.3.0/SettingsFunctions.R")

# Create the cohort definition shared resource element for the analysis specification
cohortDefinitionSharedResource <- createCohortSharedResourceSpecifications(
  cohortDefinitionSet = cohortDefinitionSet
)

# Create the negative control outcome shared resource element for the analysis specification
ncoSharedResource <- createNegativeControlOutcomeCohortSharedResourceSpecifications(
  negativeControlOutcomeCohortSet = ncoCohortSet,
  occurrenceType = "all",
  detectOnDescendants = TRUE
)

# Create the module specification
cohortGeneratorModuleSpecifications <- createCohortGeneratorModuleSpecifications(
  incremental = TRUE,
  generateStats = TRUE
)`,
    },
  },
  cohort_diagnostic_node: {
    title: "Cohort Diagnostic Module Specifications",
    description: "Run cohort diagnostic starboard.",
    tag: NodeTag.Experimental,
    defaultData: {},
  },
  negative_control_outcome_cohort_node: {
    title: "Negative Control Outcome Cohort Shared Resource Specifications",
    description: "Run negative control outcome cohort.",
    tag: NodeTag.Experimental,
    defaultData: {},
  },
  cohort_incidence_node: {
    title: "Cohort Incidence",
    description: "Run cohort incidence code.",
    tag: NodeTag.Experimental,
    defaultData: {},
  },
  cohort_incidence_target_cohorts_node: {
    title: "Cohort Incidence Target Cohorts",
    description: "Run cohort incidence target cohorts code.",
    tag: NodeTag.Experimental,
    defaultData: {},
  },
  time_at_risk_node: {
    title: "Time At Risk",
    description: "Run time at risk code.",
    tag: NodeTag.Experimental,
    defaultData: {},
  },
  covariate_settings_node: {
    title: "Covariate Settings",
    description: "Run covariate settings code.",
    tag: NodeTag.Experimental,
    defaultData: {},
  },
  characterization_node: {
    title: "Characterization",
    description: "JSON analysis specification for executing HADES modules",
    tag: NodeTag.Experimental,
    defaultData: {},
  },
  target_compartor_outcomes_node: {
    title: "Target Compartor Outcomes",
    description: "Run target compartor outcomes code",
    tag: NodeTag.Experimental,
    defaultData: {},
  },
  cohort_method_analysis_node: {
    title: "Cohort Method Analysis",
    description: "Run cohort method analysis code",
    tag: NodeTag.Experimental,
    defaultData: {},
  },
  cohort_method_node: {
    title: "Cohort Method",
    description: "Run cohort method code.",
    tag: NodeTag.Experimental,
    defaultData: {},
  },
  era_covariate_settings_node: {
    title: "Era Covariate Settings",
    description: "Run era covariate settings code.",
    tag: NodeTag.Experimental,
    defaultData: {},
  },
  calendar_time_covariate_settings_node: {
    title: "Calendar Time Covariate Settings",
    description: "Run calendar time covariate settings code.",
    tag: NodeTag.Experimental,
    defaultData: {},
  },
  seasonality_covariate_settings_node: {
    title: "Seasonality Covariate Settings",
    description: "Run seasonality covariate settings code.",
    tag: NodeTag.Experimental,
    defaultData: {},
  },
  self_controlled_case_series_analysis_node: {
    title: "Self Controlled Case Series Analysis",
    description: "Run self-controlled case series analysis code.",
    tag: NodeTag.Experimental,
    defaultData: {},
  },
  self_controlled_case_series_node: {
    title: "Self Controlled Case Series",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    tag: NodeTag.Experimental,
    defaultData: {},
  },
  patient_level_prediction_node: {
    title: "Patient Level Prediction",
    description:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.",
    tag: NodeTag.Experimental,
    defaultData: {},
  },
  study_poplulation_settings_node: {
    title: "Study Population Settings",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    tag: NodeTag.Experimental,
    defaultData: {},
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
