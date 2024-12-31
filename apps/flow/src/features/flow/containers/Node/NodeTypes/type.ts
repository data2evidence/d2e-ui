export type NodeType =
  | "python_node"
  | "python_notebook_node"
  | "py2table_node"
  | "r_node"
  | "strategus"
  | "sql_query_node"
  | "sql_node"
  | "data_mapping_node"
  | "csv_node"
  | "db_reader_node"
  | "db_writer_node"
  | "subflow";

export type NodeTypeChoice = Exclude<Exclude<NodeType, "start">, "subflow">;

export enum NodeTag {
  Stable = "Stable",
  Experimental = "Experimental",
}

export enum HandleIOType {
  Any = "any",
  Table = "table",
  Object = "object",
}

export const HandleIODict: {
  [key in HandleIOType]: { color: string; text: string };
} = {
  [HandleIOType.Any]: {
    color: "#000080",
    text: "Any",
  },
  [HandleIOType.Table]: {
    color: "#ff5e59",
    text: "Table",
  },
  [HandleIOType.Object]: {
    color: "#00855f",
    text: "Object",
  },
};

export enum HandleTypeColor {
  All = "#000080",
  Table = "#ff5e59",
  Object = "#00855f",
}

export interface NodeChoiceAttr {
  title: string;
  description?: string;
  tag?: NodeTag;
  defaultData?: Record<string, any>;
}
