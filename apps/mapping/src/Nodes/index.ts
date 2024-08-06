import { SourceTableNode } from "./SourceTableNode";
import { TargetTableNode } from "./TargetTableNode";
import { PlaceholderNode } from "./PlaceholderNode";

export const nodeTypes = {
  sourceTable: SourceTableNode,
  targetTable: TargetTableNode,
  placeholderNode: PlaceholderNode,
};

export * from "./MappingHandle";
