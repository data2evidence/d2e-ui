import { useFlow } from "../../contexts/FlowContext";
import { NodeProps } from "reactflow";
import { MappingNode } from "./MappingNode";
import "./node.scss";

export const PlaceholderNode = (props: NodeProps) => {
  const { state } = useFlow();
  const { fieldTargetState, fieldSourceState } = state;

  const isSource = props.data.type === "source";
  const data = isSource ? fieldSourceState : fieldTargetState;

  return (
    <div className="link-tables__column nodrag nowheel">
      <div className="content-container">
        <div className="node-container">
          {data.map((node) => (
            <MappingNode {...node} key={node.id} />
          ))}
        </div>
      </div>
    </div>
  );
};
