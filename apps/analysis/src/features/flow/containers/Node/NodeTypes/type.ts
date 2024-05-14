export type NodeType =
  | "cohort_generator_node"
  | "cohort_diagnostic_node"
  | "negative_control_outcome_cohort_node"
  | "cohort_incidence_node"
  | "cohort_incidence_target_cohorts_node"
  | "time_at_risk_node"
  | "covariate_settings_node"
  | "characterization_node"
  | "target_comparator_outcomes_node"
  | "cohort_method_analysis_node"
  | "cohort_method_node"
  | "era_covariate_settings_node"
  | "calendar_time_covariate_settings_node"
  | "seasonality_covariate_settings_node"
  | "self_controlled_case_series_analysis_node"
  | "self_controlled_case_series_node"
  | "patient_level_prediction_node"
  | "study_population_settings_node"
  | "nco_cohort_set_node";

export type NodeTypeChoice = Exclude<NodeType, "start">;

export enum NodeTag {
  Aquamarine = "aquamarine",
  Blue = "blue",
  Chocolate = "chocolate",
  Cyan = "cyan",
  Darkgreen = "darkgreen",
  Darkred = "darkred",
  Green = "green",
  Grey = "grey",
  Indigo = "indigo",
  Lavender = "lavender",
  Lightgrey = "lightgrey",
  Lightpink = "lightpink",
  Lime = "lime",
  Magenta = "magenta",
  Mediumpurple = "mediumpurple",
  Orange = "orange",
  Red = "red",
  Wheat = "wheat",
}

export interface NodeChoiceAttr {
  title: string;
  description?: string;
  tag?: NodeTag;
  defaultData?: Record<string, any>;
}

export type StrategusNodeAttributes = {
  name: string;
  connector_list: NodeConnector[];
};

export type NodeConnector = {
  name: string;
  type: string;
  classifier: string;
};

export const ZERO_INCIDENCE_NODE = [
  "cohort_diagnostic_node",
  "cohort_generator_node",
  "time_at_risk_node",
  "era_covariate_settings_node",
  "calendar_time_covariate_settings_node",
  "seasonality_covariate_settings_node",
  "study_population_settings_node",
];
export const ONE_INCIDENCE_NODE = [
  "negative_control_outcome_cohort_node",
  "cohort_incidence_target_cohorts_node",
  "cohort_method_analysis_node",
];
export const TWO_INCIDENCE_NODE = [
  "cohort_method_node",
  "characterization_node",
  "self_controlled_case_series_analysis_node",
];
export const THREE_INCIDENCE_NODE = [
  "cohort_incidence_node",
  "covariate_settings_node",
  "patient_level_prediction_node",
];
export const FOUR_INCIDENCE_NODE = ["self_controlled_case_series_node"];
export const FIVE_INCIDENCE_NODE = ["target_comparator_outcomes_node"];

export const NODE_CONNECTOR_MAPPING = {
  cohort_generator_node: { type: "lightgrey", connector_list: [] },
  cohort_diagnostic_node: { type: "grey", connector_list: [] },
  negative_control_outcome_cohort_node: {
    type: "lime",
    connector_list: [
      {
        name: "negativeControlOutcomeCohortSet",
        type: "blue",
        classifier: "negative_control_outcome_cohort_set",
      },
    ],
  },
  // check if Cohort Incident and Cohort Incident Target Cohort are the same color
  cohort_incidence_node: {
    type: "cyan",
    connector_list: [
      { name: "Target Cohorts", type: "blue", classifier: "target_cohort" },
      {
        name: "Cohort Incident Target Cohorts",
        type: "aquamarine",
        classifier: "cohort_incident_target_cohort",
      },
      { name: "Time At Risk", type: "wheat", classifier: "time_at_risk" },
    ],
  },
  cohort_incidence_target_cohorts_node: {
    type: "aquamarine",
    connector_list: [
      { name: "Outcomes", type: "green", classifier: "outcomes" },
    ],
  },
  time_at_risk_node: { type: "wheat", connector_list: [] },
  covariate_settings_node: {
    type: "darkgreen",
    connector_list: [
      { name: "Target Cohort", type: "blue", classifier: "target_cohort" },
      { name: "Outcomes", type: "green", classifier: "outcomes" },
      { name: "Time At Risk", type: "wheat", classifier: "time_at_risk" },
    ],
  },
  characterization_node: {
    type: "darkgreen",
    connector_list: [
      {
        name: "Covariate Settings",
        type: "darkgreen",
        classifier: "covariate_settings",
      },
      {
        name: "Time At Risk",
        type: "wheat",
        classifier: "time_at_risk",
      },
    ],
  },
  target_comparator_outcomes_node: {
    type: "indigo",
    connector_list: [
      {
        name: "Negative Control Outcomes",
        type: "lime",
        classifier: "negative_control_outcomes",
      },
      {
        name: "Outcome of Interest",
        type: "green",
        classifier: "outcome_of_interest",
      },
      { name: "Target", type: "blue", classifier: "target" },
      { name: "Comparator", type: "blue", classifier: "comparator" },
      { name: "Exclude", type: "orange", classifier: "exclude" },
    ],
  },
  cohort_method_analysis_node: {
    type: "lavender",
    connector_list: [
      {
        name: "Study Population",
        type: "lightpink",
        classifier: "study_population",
      },
    ],
  },
  cohort_method_node: {
    type: "mediumpurple",
    connector_list: [
      {
        name: "Target Comparator Outcomes",
        type: "indigo",
        classifier: "target_comparator_outcomes",
      },
      { name: "CM Analysis", type: "lavender", classifier: "cm_analysis" },
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
      {
        name: "Covariate Settings",
        type: "chocolate",
        classifier: "covariate_settings",
      },
      {
        name: "Study Population",
        type: "lightpink",
        classifier: "study_population",
      },
    ],
  },
  self_controlled_case_series_node: {
    type: "darkred",
    connector_list: [
      {
        name: "Negative Control Outcomes",
        type: "lime",
        classifier: "negative_control_outcomes",
      },
      {
        name: "Outcome of Interest",
        type: "green",
        classifier: "outcome_of_interest",
      },
      { name: "Exposures", type: "blue", classifier: "exposures" },
      { name: "SCCS Analysis", type: "red", classifier: "scss_analysis" },
    ],
  },
  patient_level_prediction_node: {
    type: "magenta",
    connector_list: [
      {
        name: "Outcome of Interest",
        type: "green",
        classifier: "outcome_of_interest",
      },
      { name: "Exposures", type: "blue", classifier: "exposures" },
      {
        name: "Study Population",
        type: "lightpink",
        classifier: "study_population",
      },
    ],
  },
  study_population_settings_node: { type: "lightpink", connector_list: [] },
  nco_cohort_set_node: { type: "lightpink", connector_list: [] },
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
