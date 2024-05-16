import React, { FC, useState, useCallback, useMemo, useEffect } from "react";
import "./Jobs.scss";
import { Title, Button, Loader, ErrorBoundary, IconButton } from "@portal/components";
import { Tabs, Tab } from "@mui/material";
import DatasetSelector from "../DQD/DatasetSelector/DatasetSelector";
import JobRunButtons from "../DQD/JobRunButtons/JobRunButtons";
import JobRunsTable from "./JobRunsTable/JobRunsTable";
import JobTable from "./JobTable/JobTable";
import AddFlowDialog from "./AddFlowDialog/AddFlowDialog";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useJobs } from "../../../hooks";
import { api } from "../../../axios/api";
import { mapTime } from "../DQD/Utils/Shared";
import { CloseDialogType, IPluginItem } from "../../../types";
import { loadPlugins } from "../../../utils";
import { SystemAdminPluginRenderer } from "../../core/SystemAdminPluginRenderer";
import env from "../../../env";
import classNames from "classnames";
import { useLocation, useNavigate } from "react-router-dom";
import LogViewer from "./LogViewer/LogViewer";
import { FeatureGate } from "../../../config/FeatureGate";
import { FEATURE_DATAFLOW } from "../../../config";
import { useTranslation } from "../../../contexts";

enum JobTabs {
  Runs = "Job Runs",
  Jobs = "Jobs",
}

const plugins = loadPlugins();
const CURRENT_SYSTEM = env.REACT_APP_CURRENT_SYSTEM;

const Jobs: FC = () => {
  const { getText, i18nKeys } = useTranslation();
  const [selectedStudy, setSelectedStudy] = useState("");
  const [studyId, setStudyId] = useState("");
  const [isSilentRefresh, setIsSilentRefresh] = useState(false);
  const [refetchJobs, setRefetchJobs] = useState(0);
  const [refetchAddFlow, setRefetchAddFlow] = useState(0);
  const [jobs, loadingJobs, errorJobs] = useJobs(refetchJobs, isSilentRefresh);
  const [showAddFlow, setShowAddFlow] = useState(false);
  const [showDataflow, setShowDataflow] = useState(false);
  const [logViewerScriptsLoaded, setLogViewerScriptsLoaded] = useState(false);
  const [logViewerDivLoaded, setLogViewerDivLoaded] = useState(false);
  const [showLogViewer, setShowLogViewer] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const dataflowPlugin = useMemo(
    () => plugins.systemadmin.find((plugin: IPluginItem) => plugin.name === "Dataflow"),
    []
  );

  const [tabValue, setTabValue] = useState(JobTabs.Runs);

  const handleStudySelect = (study: string, studyId: string) => {
    setSelectedStudy(study);
    setStudyId(studyId);
  };

  const handleGenerateJob = () => {
    handleRefreshJobStatus();
  };

  const handleRefreshJobStatus = () => {
    setIsSilentRefresh(false);
    setRefetchJobs((refetch) => refetch + 1);
  };

  const handleCancelJobClick = async (id: string) => {
    await api.dataflow.cancelFlowRun(id);
    setIsSilentRefresh(true);
    setRefetchJobs((refetch) => refetch + 1);
  };

  const handleTabSelectionChange = async (event: React.SyntheticEvent, value: string) => {
    setTabValue(value as JobTabs);
  };

  const handleOpenAddFlow = useCallback(() => {
    setShowAddFlow(true);
  }, []);

  const handleCloseAddFlow = useCallback((type: CloseDialogType) => {
    setShowAddFlow(false);
    if (type === "success") {
      setRefetchAddFlow((refetchAddFlow) => refetchAddFlow + 1);
    }
  }, []);

  const handleShowDataflow = useCallback(() => {
    setShowDataflow(true);
  }, []);

  const handleCloseDataflow = useCallback(() => {
    setShowDataflow(false);
  }, []);

  const renderJobRunsTable = () => {
    return (
      <>
        {loadingJobs ? (
          <Loader text={getText(i18nKeys.JOBS__LOADER)} />
        ) : errorJobs ? (
          <div>{errorJobs.message}</div>
        ) : (
          jobs && (
            <>
              {/* <Button onClick={handleRefreshJobStatus} text="Refresh Table" /> */}
              <JobRunsTable
                data={mapTime(jobs)}
                handleStudySelect={handleStudySelect}
                handleCancelJobClick={handleCancelJobClick}
              />
            </>
          )
        )}
      </>
    );
  };

  const backToJobs = () => {
    navigate("jobs", { replace: true });
  };

  useEffect(() => {
    const shouldShowLogViewer = location.pathname.includes("/flowrun") || location.pathname.includes("/taskrun");
    setShowLogViewer(shouldShowLogViewer);
  }, [location]);

  useEffect(() => {
    if (logViewerScriptsLoaded && logViewerDivLoaded) {
      if (typeof (window as any)?.mountLogViewer !== "function") {
        setLogViewerScriptsLoaded(false);
      } else {
        console.log("mounting...", typeof (window as any)?.mountLogViewer);
        (window as any).mountLogViewer();
      }
    }
  }, [logViewerScriptsLoaded, logViewerDivLoaded, showLogViewer]);

  return (
    <>
      {showLogViewer ? (
        <LogViewer
          setLogViewerScriptsLoaded={setLogViewerScriptsLoaded}
          setLogViewerDivLoaded={setLogViewerDivLoaded}
          backToJobs={backToJobs}
        />
      ) : null}
      {!showLogViewer ? (
        <div className="jobs">
          {showDataflow && (
            <div className="jobs__back-header">
              <IconButton startIcon={<ArrowBackIcon />} onClick={handleCloseDataflow} />
              <div>{getText(i18nKeys.JOBS__BACK)}</div>
            </div>
          )}

          <div className={classNames("jobs__wrapper", { jobs__plugin: showDataflow })}>
            {!showDataflow && (
              <>
                <Title>{getText(i18nKeys.JOBS__JOBS)}</Title>
                <div className="jobs_header__container">
                  <div className="jobs_header__selector">
                    <span> {getText(i18nKeys.JOBS__DATA_QUALITY_ANALYSIS)}:</span>
                    <DatasetSelector handleStudySelect={handleStudySelect} />
                  </div>
                  <JobRunButtons datasetId={studyId} studyName={selectedStudy} handleGenerateJob={handleGenerateJob} />
                </div>
                <div className="jobs_selector__container">
                  <FeatureGate featureFlags={[FEATURE_DATAFLOW]}>
                    <Button
                      className="jobs__button"
                      text={getText(i18nKeys.JOBS__MANAGE_DATAFLOWS)}
                      onClick={handleShowDataflow}
                      disabled={!dataflowPlugin}
                    />
                  </FeatureGate>
                  <Button
                    className="jobs__button"
                    text={getText(i18nKeys.JOBS__UPLOAD)}
                    variant="outlined"
                    onClick={handleOpenAddFlow}
                  />
                  <AddFlowDialog open={showAddFlow} onClose={handleCloseAddFlow} />
                </div>
                <div className="jobs_content__container">
                  <div className="jobs_content__tabs">
                    <Tabs value={tabValue} onChange={handleTabSelectionChange}>
                      <Tab label={JobTabs.Runs} value={JobTabs.Runs}></Tab>
                      <Tab label={JobTabs.Jobs} value={JobTabs.Jobs}></Tab>
                    </Tabs>
                  </div>
                  <div className="jobs_content__table">
                    {tabValue === JobTabs.Runs && renderJobRunsTable()}
                    {tabValue === JobTabs.Jobs && <JobTable />}
                  </div>
                </div>
              </>
            )}

            {dataflowPlugin && showDataflow && (
              <FeatureGate featureFlags={[FEATURE_DATAFLOW]}>
                <ErrorBoundary name={dataflowPlugin.name} key={dataflowPlugin.route}>
                  <SystemAdminPluginRenderer
                    key={dataflowPlugin.route}
                    path={dataflowPlugin.pluginPath}
                    data={dataflowPlugin.data}
                    system={CURRENT_SYSTEM}
                  />
                </ErrorBoundary>
              </FeatureGate>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Jobs;
