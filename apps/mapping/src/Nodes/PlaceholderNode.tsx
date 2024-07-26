import { NodeProps, useUpdateNodeInternals } from "reactflow";
import { debounce } from "lodash";
import { useField } from "../contexts";
import { MappingHandle } from "./MappingHandle";
import "./node.scss";

export const PlaceholderNode = (props: NodeProps) => {
  const updateNodeInternals = useUpdateNodeInternals();
  const { sourceHandles, targetHandles } = useField();
  const isSource = props.data.type === "source";
  const data = isSource ? sourceHandles : targetHandles;

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
            isSource
              ? "handle-container handle-container-source"
              : "handle-container"
          }
        >
          {data.map((node) => (
            <MappingHandle {...node} key={node.id} />
          ))}
        </div>
      </div>
    </div>
  );
};
