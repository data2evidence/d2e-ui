import { Handle, NodeProps, Position } from "reactflow";
import classNames from "classnames";
import "./MappingNode.scss";

export const MappingNode = (props: Partial<NodeProps>) => {
  const { label, type, tableName, isField } = props.data;
  const isInput = type === "input";

  return (
    <div
      className={classNames(
        "mapping-node",
        { "mapping-node__input": isInput },
        { "mapping-node__output": !isInput }
      )}
    >
      <div className="mapping-node__header">{label}</div>
      <Handle
        id={isField ? `${tableName}-${label}` : label}
        type={isInput ? "source" : "target"}
        position={isInput ? Position.Right : Position.Left}
      />
    </div>
  );
};
