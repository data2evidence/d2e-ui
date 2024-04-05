export type NodeType =
  | "cohort_generator_node"
  | "cohort_diagnostic_node"
  | "negative_control_outcome_cohort_node"
  | "cohort_incidence_node"
  | "cohort_incidence_target_cohorts_node"
  | "time_at_risk_node"
  | "covariate_settings_node"
  | "characterization_node"
  | "target_compartor_outcomes_node"
  | "cohort_method_analysis_node"
  | "cohort_method_node"
  | "era_covariate_settings_node"
  | "calendar_time_covariate_settings_node"
  | "seasonality_covariate_settings_node"
  | "self_controlled_case_series_analysis_node"
  | "self_controlled_case_series_node"
  | "patient_level_prediction_node"
  | "study_poplulation_settings_node";

export type NodeTypeChoice = Exclude<NodeType, "start">;

export enum NodeTag {
  Stable = "Stable",
  Experimental = "Experimental",
}

export interface NodeChoiceAttr {
  title: string;
  description?: string;
  tag?: NodeTag;
  defaultData?: Record<string, any>;
}

export const ZERO_INCIDENCE_NODE = [
  "cohort_diagnostic_node",
  "cohort_generator_node",
  "time_at_risk_node",
  "era_covariate_settings_node",
  "calendar_time_covariate_settings_node",
  "seasonality_covariate_settings_node",
  "study_poplulation_settings_node",
];
export const ONE_INCIDENCE_NODE = [
  "negative_control_outcome_cohort_node",
  "cohort_incidence_target_cohorts_node",
  "characterization_node",
  "cohort_method_analysis_node",
];
export const TWO_INCIDENCE_NODE = [
  "cohort_method_node",
  "self_controlled_case_series_analysis_node",
];
export const THREE_INCIDENCE_NODE = [
  "cohort_incidence_node",
  "covariate_settings_node",
  "patient_level_prediction_node",
];
export const FOUR_INCIDENCE_NODE = ["self_controlled_case_series_node"];
export const FIVE_INCIDENCE_NODE = ["target_compartor_outcomes_node"];

export const NODE_CONNECTOR_MAPPING = {
  cohort_generator_node: { type: "grey", connector_list: [] },
  cohort_diagnostic_node: { type: "grey", connector_list: [] },
  negative_control_outcome_cohort_node: {
    type: "lime",
    connector_list: [{ name: "negativeControlOutcomeCohortSet", type: "blue" }],
  },
  // check if Cohort Incident and Cohort Incident Target Cohort are the same color
  cohort_incidence_node: {
    type: "cyan",
    connector_list: [
      { name: "Target Cohorts", type: "blue" },
      { name: "Cohort Incident Target Cohorts", type: "cyan" },
      { name: "Time At Risk", type: "grey" },
    ],
  },
  cohort_incidence_target_cohorts_node: {
    type: "cyan",
    connector_list: [{ name: "Outcomes", type: "lime" }],
  },
  time_at_risk_node: { type: "grey", connector_list: [] },
  covariate_settings_node: {
    type: "green",
    connector_list: [
      { name: "Target Cohort", type: "blue" },
      { name: "Outcomes", type: "lime" },
      { name: "Time At Risk", type: "grey" },
    ],
  },
  characterization_node: {
    type: "green",
    connector_list: [{ name: "Covariate Settings", type: "green" }],
  },
  target_compartor_outcomes_node: {
    type: "indigo",
    connector_list: [
      { name: "Negative Control Outcomes", type: "lime" },
      { name: "Outcome of Interest", type: "green" },
      { name: "Target", type: "blue" },
      { name: "Comparator", type: "blue" },
      { name: "Exclude", type: "orange" },
    ],
  },
  cohort_method_analysis_node: {
    type: "lavender",
    connector_list: [{ name: "Study Population", type: "lightpink" }],
  },
  cohort_method_node: {
    type: "mediumpurple",
    connector_list: [
      { name: "Target Comparator Outcomes", type: "indigo" },
      { name: "CM Analysis", type: "lavender" },
    ],
  },
  era_covariate_settings_node: { type: "chocolate", connector_list: [] },
  calendar_time_covariate_settings_node: {
    type: "chocolate",
    connector_list: [],
  },
  seasonality_covariate_settings_node: {
    type: "chocolate",
    connector_list: [],
  },
  self_controlled_case_series_analysis_node: {
    type: "red",
    connector_list: [
      { name: "Covariate Settings", type: "chocolate" },
      { name: "Study Population", type: "lightpink" },
    ],
  },
  self_controlled_case_series_node: {
    type: "darkred",
    connector_list: [
      { name: "Negative Control Outcomes", type: "lime" },
      { name: "Outcome of Interest", type: "green" },
      { name: "Exposures", type: "blue" },
      { name: "SCCS Analysis", type: "red" },
    ],
  },
  patient_level_prediction_node: {
    type: "magenta",
    connector_list: [
      { name: "Outcome of Interest", type: "green" },
      { name: "Exposures", type: "blue" },
      { name: "Study Population", type: "lightpink" },
    ],
  },
  study_poplulation_settings_node: { type: "lightpink", connector_list: [] },
};

export const OUTBOUND_CONNECTOR_STYLE = {
  borderRadius: "3px",
  width: "14px",
  height: "100%",
};

export const INBOUND_CONNECTOR_STYLES = [
  [],
  ["50%"],
  ["33%", "66%"],
  ["25%", "50%", "75%"],
  ["30%", "45%", "60%", "75%"],
  ["25%", "40%", "55%", "70%", "85%"],
];
