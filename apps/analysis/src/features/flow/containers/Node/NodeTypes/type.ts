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
