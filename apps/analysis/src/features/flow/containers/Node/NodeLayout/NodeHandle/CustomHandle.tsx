import React from "react";
import { Connection, Handle, NodeProps, Position } from "reactflow";
import { IconButton, AddIcon } from "@portal/components";
import "./CustomHandle.scss";

export interface CustomHandleProps<T> {
  name: string;
  color: string;
  type: string;
  node: NodeProps<T>;
  postion: Position;
  style: object;
  onConnect: (connection: Connection) => void;
}
export const CustomHandle = ({
  name,
  color,
  type,
  node,
  position,
  style,
  onConnect,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        padding: "5px",
        border: "2px solid #999fcb",
        borderRadius: "5px", // Rounded corners
        textAlign: "center",
        ...style,
      }}
    >
      {type === "target" ? (
        <Handle
          className="custom-handle"
          type={type}
          id={`${node.id}_${name}_handle`}
          position={node.sourcePosition || position}
          style={{
            position: "absolute",
            background: color,
            borderRadius: "3px",
            width: "14px",
            height: "100%",
            left: "-10px",
          }}
          onConnect={onConnect}
        ></Handle>
      ) : (
        <Handle
          className="custom-handle"
          type={type}
          id={`${node.id}_${name}_handle`}
          position={node.sourcePosition || position}
          style={{
            position: "absolute",
            background: color,
            borderRadius: "3px",
            width: "14px",
            height: "100%",
            left: "-10px",
          }}
          onConnect={onConnect}
        ></Handle>
      )}
      <span style={{ marginRight: "5px", marginLeft: "5px" }}>
        <IconButton startIcon={<AddIcon />} />
      </span>{" "}
      <span style={{ marginRight: "5px" }}>{name}</span>
    </div>
  );
};
