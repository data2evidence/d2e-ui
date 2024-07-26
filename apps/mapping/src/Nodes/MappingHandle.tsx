import { Handle, NodeProps, Position } from "reactflow";
import classNames from "classnames";
import "./MappingHandle.scss";

export const MappingHandle = (props: Partial<NodeProps>) => {
  const { label, type, tableName, isField } = props.data;
  const isInput = type === "input";

  return (
    <div
      className={classNames(
        "mapping-handle",
        { "mapping-handle__input": isInput },
        { "mapping-handle__output": !isInput }
      )}
    >
      <div className="mapping-handle__header">{label}</div>
      <Handle
        id={isField ? `${tableName}-${label}` : label}
        type={isInput ? "source" : "target"}
        position={isInput ? Position.Right : Position.Left}
      />
    </div>
  );
};
