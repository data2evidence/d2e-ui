import { useFlow } from "../../contexts/FlowContext";
import { NodeProps, useUpdateNodeInternals } from "reactflow";
import { MappingNode } from "./MappingNode";
import "./node.scss";
import { debounce } from "lodash";

export const PlaceholderNode = (props: NodeProps) => {
  const updateNodeInternals = useUpdateNodeInternals();
  const { state } = useFlow();
  const { fieldTargetState, fieldSourceState } = state;

  const isSource = props.data.type === "source";
  const data = isSource ? fieldSourceState : fieldTargetState;

  const handleWheel = debounce(() => {
    updateNodeInternals(props.id);
  }, 100);

  return (
    <div
      className="link-tables__column nodrag nowheel"
      onWheel={() => handleWheel()}
    >
      <div className="content-container">
        <div
          className={
            isSource ? "node-container node-container-source" : "node-container"
          }
        >
          {data.map((node) => (
            <MappingNode {...node} key={node.id} />
          ))}
        </div>
      </div>
    </div>
  );
};
