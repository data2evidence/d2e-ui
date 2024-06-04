import React, { FC, useEffect, useState } from "react";
import ReactFlow, { Node, Edge, Position } from "reactflow";
import { v4 as uuidv4 } from "uuid";
import { Terminology } from "../../../../../axios/terminology";
import { ConceptHierarchy, ConceptHierarchyNode } from "../../utils/types";
import "reactflow/dist/style.css";

interface ConceptHierachyProps {
  userId?: string;
  conceptId: number;
  datasetId?: string;
}

const xAxisOffset: number = 200;
const yAxisOffset: number = 150;

interface ConceptHierarchyNodeCounts {
  [level: number]: {
    count: number;
    nodes: ConceptHierarchyNode[];
  };
}

const countAndGroupNodesByLevel = (nodes: ConceptHierarchyNode[]) => {
  const nodeCounts: ConceptHierarchyNodeCounts = {};

  nodes.forEach((node: ConceptHierarchyNode) => {
    if (!nodeCounts[node.level]) {
      nodeCounts[node.level] = { count: 0, nodes: [] };
    }

    nodeCounts[node.level].count++;
    nodeCounts[node.level].nodes.push(node);
  });

  return nodeCounts;
};

const createNodes = (nodes: ConceptHierarchyNode[]): Node[] => {
  const parsedNodes: Node[] = [];

  const nodeLevels: ConceptHierarchyNodeCounts = countAndGroupNodesByLevel(nodes);

  for (const [level, value] of Object.entries(nodeLevels)) {
    const { count, nodes } = value as any;
    const mid = Math.floor(nodes.length / 2);
    for (let i = 0; i < nodes.length; i++) {
      const positionY: number = yAxisOffset * (i - mid);
      const positionX: number = -xAxisOffset * parseInt(level);

      parsedNodes.push({
        id: nodes[i].conceptId.toString(),
        position: { x: positionX, y: positionY },
        data: { label: nodes[i].display },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      });
    }
  }
  return parsedNodes;
};

const ConceptHierachy: FC<ConceptHierachyProps> = ({ userId, conceptId, datasetId }) => {
  const [isLoading, setIsLoading] = useState<any>(false);
  const [data, setData] = useState<ConceptHierarchy>();

  useEffect(() => {
    if (userId && datasetId) {
      const depth = 3;
      const fetchData = async () => {
        if (userId) {
          try {
            const terminologyApi = new Terminology();
            const response = await terminologyApi.getConceptHierarchy(datasetId, conceptId, depth);
            setData(response);
          } catch (error) {
            console.log(error);
          }
        }
      };
      fetchData();
    }
  }, []);

  const nodes: Node[] = data ? createNodes(data.nodes) : [];

  const edges: Edge[] = data
    ? data?.edges.map((edge) => ({
        id: uuidv4(),
        source: edge.source.toString(),
        target: edge.target.toString(),
      }))
    : [];

  return <>{data && <ReactFlow nodes={nodes} edges={edges} fitView></ReactFlow>}</>;
};

export default ConceptHierachy;
