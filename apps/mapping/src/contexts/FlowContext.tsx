import React, { createContext, useContext, useState, ReactNode } from "react";
import { Node, Edge } from "reactflow";

interface FlowContextType {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

const FlowContext = createContext<FlowContextType | undefined>(undefined);

export const FlowProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: "A",
      type: "sourceColumn",
      position: { x: 0, y: 0 },
      style: {
        width: "25vw",
        height: "100vh",
      },
      data: { label: "A" },
    },
    {
      id: "B",
      type: "sourceTable",
      position: { x: 500, y: 0 },
      style: {
        width: "25vw",
        height: "100vh",
      },
      data: { label: "B" },
    },
    {
      id: "C",
      type: "targetTable",
      position: { x: 1000, y: 0 },
      style: {
        width: "25vw",
        height: "100vh",
      },
      data: { label: "c" },
    },
  ]);

  const [edges, setEdges] = useState<Edge[]>([]);

  return (
    <FlowContext.Provider value={{ nodes, setNodes, edges, setEdges }}>
      {children}
    </FlowContext.Provider>
  );
};

export const useFlow = (): FlowContextType => {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error("useFlow must be used within a FlowProvider");
  }
  return context;
};
