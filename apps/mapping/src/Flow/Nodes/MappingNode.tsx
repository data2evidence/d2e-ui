import React from "react";
import { Handle, NodeProps, Position } from "reactflow";
import classNames from "classnames";
import "./MappingNode.scss";

export const MappingNode = (props: NodeProps) => {
  const { label, type } = props.data;
  const isInput = type === "input";

  return (
    <div
      className={classNames(
        "data-mapping-node",
        { "data-mapping-node__input": isInput },
        { "data-mapping-node__output": !isInput }
      )}
    >
      <div className="data-mapping-node__header">{label}</div>
      <Handle
        id={`handle-${label}`}
        type={isInput ? "source" : "target"}
        position={isInput ? Position.Right : Position.Left}
      />
    </div>
  );
};
