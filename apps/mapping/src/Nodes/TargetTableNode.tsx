import { useCallback, useEffect, useState } from "react";
import { NodeProps, Position, useUpdateNodeInternals } from "reactflow";
import { debounce } from "lodash";
import { Button } from "@mui/material";
import { TableTargetHandleData, useTable } from "../contexts";
import { MappingHandle } from "./MappingHandle";
import { api } from "../axios/api";
import targetSourceData from "../../dummyData/5.4Version.json";
import "./node.scss";

export const TargetTableNode = (props: NodeProps) => {
  const updateNodeInternals = useUpdateNodeInternals();
  const { targetHandles, setTableTargetHandles } = useTable();
  const [cdmVersions, setCdmVersions] = useState<[]>([]);

  // Populate version 5.4
  const populateCDMVersion = useCallback(() => {
    // TODO: Create other version of CDM selection
    const data = targetSourceData;
    const targetHandles: Partial<NodeProps<TableTargetHandleData>>[] = data.map(
      (table, index) => ({
        id: `C.${index + 1}`,
        data: { label: table.table_name, tableName: table.table_name },
        targetPosition: Position.Left,
      })
    );

    setTableTargetHandles(targetHandles);

    updateNodeInternals(props.id);
  }, []);

  const handleWheel = debounce(() => {
    updateNodeInternals(props.id);
  }, 100);

  const fetchData = useCallback(async () => {
    try {
      const response = await api.backend.getCDMVersions();
      const cdmVersions = response.sort((a: string, b: string) =>
        a > b ? -1 : 1
      );
      setCdmVersions(cdmVersions);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div
      className="link-tables__column nodrag nowheel"
      onWheel={() => {
        handleWheel();
      }}
    >
      <div className="content-container">
        {targetHandles.length ? (
          <div className="handle-container">
            {targetHandles.map((node) => (
              <MappingHandle {...node} key={node.id} />
            ))}
          </div>
        ) : (
          <div className="action-container">
            <div className="description">
              Please select CDM version to see Target tables
            </div>
            <div className="button-group">
              {cdmVersions.slice(0, 2).map((cdmVersion) => {
                return (
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={cdmVersion == 5.4 ? populateCDMVersion : undefined}
                  >
                    Version {cdmVersion}
                  </Button>
                );
              })}

              <Button variant="contained" fullWidth>
                Select Other Version
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
