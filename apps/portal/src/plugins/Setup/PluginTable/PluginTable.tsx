import React, { FC, useState, useCallback, useEffect, ChangeEvent } from "react";
import {
  Loader,
  TableCell,
  TableRow,
  TablePaginationActions,
  TrashIcon,
  IconButton,
  Button,
  Title,
} from "@portal/components";
import { Table, TableBody, TableHead, TableContainer, TablePagination } from "@mui/material";
import { CloseDialogType, Flow, MetaData } from "../../../types";
import { api } from "../../../axios/api";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import DeleteFlowDialog from "../../SystemAdmin/Jobs/DeleteFlowDialog/DeleteFlowDialog";
import "./PluginTable.scss";
import { useTranslation } from "../../../contexts";

dayjs.extend(utc);

export const PluginTable: FC = () => {
  const { getText, i18nKeys } = useTranslation();
  const [refetch, setRefetch] = useState(0);
  const [flows, setFlows] = useState<Flow[]>([]);
  const [flowMetadata, setFlowMetadata] = useState<MetaData[]>([]);
  const [loading, setLoading] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [activeFlow, setActiveFlow] = useState<Flow | undefined>();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [showDeleteFlow, setShowDeleteFlow] = useState(false);

  const fetchFlows = useCallback(async () => {
    try {
      setLoading(refetch ? false : true);
      const flows = await api.dataflow.getFlows();
      setFlows(flows);
      const flowMetadata = await api.dataflow.getFlowMetadata();
      setFlowMetadata(flowMetadata);
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [refetch]);

  const handleRowsPerPageChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number(event.target.value) || 25);
    setPage(0);
  }, []);

  const handlePageChange = useCallback((event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
    setPage(page);
  }, []);

  useEffect(() => {
    fetchFlows();
  }, [fetchFlows]);

  const handleDelete = useCallback((flow: Flow) => {
    setShowDeleteFlow(true);
    setActiveFlow(flow);
  }, []);

  const closeDeleteFlow = useCallback((type: CloseDialogType) => {
    setShowDeleteFlow(false);
    if (type === "success") {
      setRefetch((refetch) => refetch + 1);
    }
    setActiveFlow(undefined);
  }, []);

  const handleUpdateDeployment = useCallback(async (url: string) => {
    try {
      setDeploying(true);
      await api.dataflow.addFlowFromGitUrlDeployment(url);
    } catch (err) {
      setDeploying(false);
      console.log(err);
    } finally {
      setDeploying(false);
    }
  }, []);

  const isFlowDeployFromGit = (flow: Flow, metadataArray: MetaData[]): boolean => {
    const matchingMetaData = metadataArray.find((metadata) => metadata.flowId === flow.id);
    return !!matchingMetaData && !!matchingMetaData.url;
  };

  const retrieveFlowUrl = (flow: Flow, metadataArray: MetaData[]): string => {
    const matchingMetaData = metadataArray.find((metadata) => metadata.flowId === flow.id);
    return matchingMetaData ? matchingMetaData?.url : "";
  };

  if (loading) return <Loader />;

  const pageData = flows.slice(rowsPerPage * page, rowsPerPage * (page + 1));

  return (
    <>
      <Title className="table__title">Plugins</Title>
      <TableContainer className="flows__list">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{getText(i18nKeys.PLUGIN_TABLE__EXECUTION_ID)}</TableCell>
              <TableCell>{getText(i18nKeys.PLUGIN_TABLE__PLUGIN_NAME)}</TableCell>
              <TableCell>{getText(i18nKeys.PLUGIN_TABLE__START_DATE)}</TableCell>
              <TableCell>{getText(i18nKeys.PLUGIN_TABLE__END_DATE)}</TableCell>
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {(!flows || flows.length === 0) && (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  {getText(i18nKeys.PLUGIN_TABLE__NO_DATA)}
                </TableCell>
              </TableRow>
            )}
            {pageData?.map((flow, index) => (
              <TableRow key={flow.id}>
                <TableCell>{flow.id}</TableCell>
                <TableCell>{flow.name}</TableCell>
                <TableCell>{dayjs.utc(flow.created).format("YYYY-MM-DD HH:mm:ss A")}</TableCell>
                <TableCell>{dayjs.utc(flow.updated).format("YYYY-MM-DD HH:mm:ss A")}</TableCell>
                <TableCell>
                  <IconButton
                    startIcon={<TrashIcon />}
                    title={getText(i18nKeys.PLUGIN_TABLE__DELETE)}
                    onClick={() => handleDelete(flow)}
                  />
                </TableCell>
                <TableCell>
                  {isFlowDeployFromGit(flow, flowMetadata) && (
                    <Button
                      text={getText(i18nKeys.PLUGIN_TABLE__UPDATE_DEPLOYMENT)}
                      onClick={() => handleUpdateDeployment(retrieveFlowUrl(flow, flowMetadata))}
                      disabled={deploying}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}

            {showDeleteFlow && <DeleteFlowDialog flow={activeFlow} open={showDeleteFlow} onClose={closeDeleteFlow} />}
          </TableBody>
        </Table>
      </TableContainer>

      {flows.length > 0 && (
        <TablePagination
          component="div"
          count={flows.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          onPageChange={handlePageChange}
          ActionsComponent={TablePaginationActions}
          sx={{
            overflow: "visible",
            height: "52px",
            "& .MuiButtonBase-root:not(.Mui-disabled)": { color: "#000080" },
            marginRight: "35px",
          }}
        />
      )}
    </>
  );
};
