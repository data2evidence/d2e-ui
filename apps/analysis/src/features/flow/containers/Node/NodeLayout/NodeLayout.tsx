import React, { useCallback, useState } from "react";
import { Connection, Handle, NodeProps, Position } from "reactflow";
import classNames from "classnames";
import {
  Box,
  EditNoBoxIcon,
  DragIndicatorIcon,
  Button,
} from "@portal/components";
import { CustomHandle, CustomHandleProps } from "./NodeHandle/CustomHandle";
import { NodeDataState } from "../../../types";
import "./NodeLayout.scss";

export interface NodeLayoutProps<T> {
  name?: string;
  resultType?: "error" | "success";
  onResultClick?: () => void;
  onSettingClick?: () => void;
  className?: string;
  children: React.ReactNode;
  node: NodeProps<T>;
}

export const NodeLayout = <T extends NodeDataState>({
  name: title,
  resultType = "success",
  onResultClick,
  onSettingClick,
  className,
  children,
  node,
}: NodeLayoutProps<T>) => {
  const classes = classNames("node", className, {
    "node--has-setting": typeof onSettingClick === "function",
    "node--has-error": resultType === "error",
  });
  const [sourceConnected, setSourceConnected] = useState<string | null>(null);
  const [targetConnected, setTargetConnected] = useState<string | null>(null);
  const INPUT_NODES = ["db_writer_node"];
  const OUTPUT_NODES = ["csv_node", "db_reader_node", "sql_query_node"];

  const handleConnectSource = useCallback((connection: Connection) => {
    setSourceConnected(connection.source);
  }, []);

  const handleConnectTarget = useCallback((connection: Connection) => {
    setTargetConnected(connection.target);
  }, []);

  return (
    <div className={classes}>
      {!INPUT_NODES.includes(node.type) && (
        <div>
          <CustomHandle
            name={"Outcome of Interest"}
            color={"green"}
            type={"target"}
            node={node}
            position={Position.Left}
            style={{
              top: "33%",
              display: "flex",
              alignItems: "center",
            }}
            onConnect={handleConnectTarget}
          />
          <CustomHandle
            name={"Exposures"}
            color={"blue"}
            type={"target"}
            node={node}
            position={Position.Left}
            style={{
              top: "55%",
              display: "flex",
              alignItems: "center",
            }}
            onConnect={handleConnectTarget}
          />
          <CustomHandle
            name={"Study Population"}
            color={"pink"}
            type={"target"}
            node={node}
            position={Position.Left}
            style={{
              top: "77%",
              display: "flex",
              alignItems: "center",
            }}
            onConnect={handleConnectTarget}
          />
        </div>
      )}

      {!OUTPUT_NODES.includes(node.type) && (
        <Handle
          className="purple-handle"
          type="source"
          id={`${node.id}_out`}
          position={node.sourcePosition || Position.Right}
          onConnect={handleConnectSource}
        />
      )}

      <div className="node__header">
        <Box display="inline-flex" mr={1}>
          <DragIndicatorIcon className="node__drag" />
        </Box>
        <Box flexGrow={1} className="node__title">
          {title}
        </Box>
        <Box display="flex" gap={2}>
          {typeof onSettingClick === "function" && (
            <Box display="inline-flex">
              <EditNoBoxIcon
                onClick={onSettingClick}
                className="node__setting nodrag"
              />
            </Box>
          )}
        </Box>
      </div>
      {/* <div className="node__content">{children}</div> */}
      {typeof onResultClick === "function" && (
        <div className="node__footer">
          <Button
            text={`View ${resultType === "error" ? "error" : "output"}`}
            variant={resultType === "error" ? "alarm" : "secondary"}
            onClick={onResultClick}
          />
        </div>
      )}
    </div>
  );
};
