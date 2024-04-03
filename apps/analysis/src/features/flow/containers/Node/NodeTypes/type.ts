export type NodeType =
  | "cohort_generator_node"
  | "cohort_diagnostic_node"
  | "cohort_incidence_node"
  | "characterization_node"
  | "cohort_method_node"
  | "self_controlled_case_series_node"
  | "patient_level_prediction_node";

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
