import { SourceTableNode } from "./SourceTableNode";
import { TargetTableNode } from "./TargetTableNode";
import { FieldNode } from "./FieldNode";

export const nodeTypes = {
  sourceTable: SourceTableNode,
  targetTable: TargetTableNode,
  fieldNode: FieldNode,
};

export * from "./MappingHandle";
