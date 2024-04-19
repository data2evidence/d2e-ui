import React, { FC, useState, useCallback, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { SelectChangeEvent } from "@mui/material/Select";
import { Tabs, Tab, Typography } from "@mui/material";
import { SxProps } from "@mui/system";
import { Button, Loader, TableCell, TableRow, SubTitle, IconButton, DownloadIcon } from "@portal/components";
import { useUserInfo } from "../../../contexts/UserContext";
import { StudyAttribute, StudyTag, DatasetResource } from "../../../types";
import {
  useDialogHelper,
  useFeedback,
  useDatasetResources,
  useDataset,
  useDatasetDashboards,
  useDatasetReleases,
} from "../../../hooks";
import { CDMDownloadDialog } from "./CDMDownloadDialog/CDMDownloadDialog";
import { FeatureGate } from "../../../config/FeatureGate";
import { FEATURE_CDM_DOWNLOAD } from "../../../config";
import webComponentWrapper from "../../../webcomponents/webComponentWrapper";
import { DQDJobResults } from "../../../plugins/SystemAdmin/DQD/DQDJobResults/DQDJobResults";
import DataQualityHistory from "./DataQualityHistory/DataQualityHistory";
import { DatasetDashboards } from "./DatasetDashboards/DatasetDashboards";
import { Roles } from "../../../config";
import { saveBlobAs } from "../../../utils";
import { api } from "../../../axios/api";
import { DQD_TABLE_TYPES, DatasetRelease } from "../../../plugins/SystemAdmin/DQD/types";
import "./Information.scss";
import { TranslationContext } from "../../../contexts/TranslationContext";

enum Access {
  None,
  Pending,
  Approved,
}

enum DatasetInfoTab {
  DatasetInfo = "info",
  DataQuality = "quality",
  DataCharacterization = "characterization",
  History = "history",
  Dashboard = "dashboard",
}

interface StudyAccessRequest {
  id: string;
  userId: string;
  studyId: string;
  role: string;
}

export const StudyInfoTab = {
  DataInfo: "data_info",
  DataExplore: "data_explore",
  GenerateCode: "generate_code",
  PatientAnalytics: "patient_analytics",
  Search: "search",
};

interface StateProps {
  studyId: string;
  tab: string;
  tenantId: string;
}

const styles: SxProps = {
  color: "#000080",
  height: "70%",
  minWidth: 220,
  ".MuiInputLabel-root": {
    color: "#000080",
    "&.MuiInputLabel-shrink, &.Mui-focused": {
      color: "var(--color-neutral)",
    },
  },
  ".MuiInput-input:focus": {
    backgroundColor: "transparent",
    color: "#000080",
  },
  ".MuiInput-root": {
    "&::after, &:hover:not(.Mui-disabled)::before": {
      borderBottom: "2px solid #000080",
    },
  },
  "&.MuiMenuItem-root:hover": {
    backgroundColor: "#ebf2fa",
  },
};

export const Information: FC = () => {
  const { getText, i18nKeys } = TranslationContext();
  const { setFeedback } = useFeedback();
  const [requestLoading, setRequestLoading] = useState(false);

  const { user } = useUserInfo();
  const location = useLocation();
  const state = location.state as StateProps;

  const [tabValue, setTabValue] = useState(DatasetInfoTab.DatasetInfo);
  const [activeTenantId, setActiveTenantId] = useState<string>(state?.tenantId || "");
  const [activeStudyId, setActiveStudyId] = useState<string>(state?.studyId || "");
  const [activeReleaseId, setActiveReleaseId] = useState("");
  const [downloading, setDownloading] = useState<string>();
  const [accessRequests, setAccessRequests] = useState<StudyAccessRequest[]>([]);

  const [showCDMDownloadDialog, openCDMDownload, closeCDMDownload] = useDialogHelper(false);
  const [study, loading, error] = useDataset(activeStudyId);
  const [dashboards] = useDatasetDashboards(activeStudyId);
  const [resources, resourcesLoading, resourcesError] = useDatasetResources(activeStudyId);
  const [releases, releasesLoading, releasesError] = useDatasetReleases(activeStudyId);

  const attributes = useMemo(() => study?.attributes || [], [study]);
  const tags = useMemo(() => study?.tags || [], [study]);

  const handleReleaseSelect = useCallback((releaseId: string) => {
    setActiveReleaseId(releaseId);
  }, []);

  const handleReleaseSelection = useCallback(
    (event: SelectChangeEvent) => {
      const releaseId = event.target.value.toString();
      setActiveReleaseId(releaseId);
      handleReleaseSelect(releaseId);
    },
    [handleReleaseSelect]
  );

  const loadAccessRequests = useCallback(async (): Promise<void> => {
    const accessRequests = await api.userMgmt.getMyStudyAccessRequests();
    setAccessRequests(accessRequests);
  }, []);

  useEffect(() => {
    loadAccessRequests();
  }, [loadAccessRequests]);

  useEffect(() => {
    setActiveStudyId(state.studyId);
    setActiveTenantId(state.tenantId);
    setActiveReleaseId("");
    setTabValue(DatasetInfoTab.DatasetInfo);
    window.scrollTo(0, 0);
  }, [state]);

  const handleTabSelectionChange = async (event: React.SyntheticEvent, newValue: DatasetInfoTab) => {
    setTabValue(newValue);
  };

  const handleDownloadResource = useCallback(
    async (resource: DatasetResource) => {
      try {
        setDownloading(resource.name);
        const blob = await api.systemPortal.downloadResource(activeStudyId, resource.name);
        saveBlobAs(blob, resource.name);
      } finally {
        setDownloading(undefined);
      }
    },
    [activeStudyId]
  );

  const requestAccessRef = webComponentWrapper({
    handleClick: async (event: Event) => {
      event.preventDefault();

      if (activeStudyId && user?.userId) {
        try {
          setRequestLoading(true);
          await api.userMgmt.addStudyAccessRequest(user.userId, activeTenantId, activeStudyId, Roles.STUDY_RESEARCHER);
          loadAccessRequests();

          setFeedback({
            type: "success",
            message: getText(i18nKeys.INFORMATION__FEEDBACK_MESSAGE),
            autoClose: 6000,
          });
        } catch (e) {
          setFeedback({
            type: "error",
            message: getText(i18nKeys.INFORMATION__FEEDBACK_ERROR_MESSAGE),
            description: getText(i18nKeys.INFORMATION__FEEDBACK_ERROR_DESCRIPTION),
          });
        } finally {
          setRequestLoading(false);
        }
      }
    },
  });

  const getAccess = useCallback(() => {
    if (user.isStudyResearcher(activeStudyId)) {
      return Access.Approved;
    } else if (accessRequests?.some((req) => req.role === Roles.STUDY_RESEARCHER && req.studyId === activeStudyId)) {
      return Access.Pending;
    }
    return Access.None;
  }, [activeStudyId, user, accessRequests]);

  if (error || resourcesError || releasesError)
    console.error(error?.message || resourcesError?.message || releasesError?.message);
  if (loading || resourcesLoading) return <Loader />;

  return (
    <div className="information__container">
      <div className="dataset__info__dropdown">
        <SubTitle style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {getText(i18nKeys.INFORMATION__DATASET)}:
          <Typography style={{ color: "grey" }}>
            {study?.studyDetail?.name || getText(i18nKeys.INFORMATION__UNTITLED)}
          </Typography>
        </SubTitle>
        {releases.length !== 0 && (
          <Select
            value={activeReleaseId}
            onChange={handleReleaseSelection}
            displayEmpty
            sx={styles}
            disabled={releasesLoading}
          >
            <MenuItem value="" sx={styles} disableRipple>
              {getText(i18nKeys.INFORMATION__SELECT_RELEASE)}
            </MenuItem>
            {releases?.map((release: DatasetRelease) => (
              <MenuItem value={release.id} key={release.id} sx={styles} disableRipple>
                {release.name} - {release.releaseDate}
              </MenuItem>
            ))}
          </Select>
        )}
      </div>
      <div className="information__study_content">
        <div className="tab__content">
          <div className="tab__content__container">
            <div className="dataset__info__tab">
              <Tabs value={tabValue} onChange={handleTabSelectionChange}>
                <Tab
                  disableRipple
                  sx={{
                    "&.MuiTab-root": {
                      width: "200px",
                    },
                    marginRight: "8px",
                  }}
                  label={getText(i18nKeys.INFORMATION__TAB_DATASET_INFO)}
                  id="tab-0"
                  value="info"
                />
                <Tab
                  disableRipple
                  sx={{
                    "&.MuiTab-root": {
                      width: "200px",
                    },
                  }}
                  label={getText(i18nKeys.INFORMATION__TAB_DATA_QUALITY)}
                  id="tab-1"
                  value="quality"
                />
                <Tab
                  disableRipple
                  sx={{
                    "&.MuiTab-root": {
                      width: "200px",
                    },
                  }}
                  label={getText(i18nKeys.INFORMATION__TAB_DATA_CHARACTERIZATION)}
                  id="tab-2"
                  value="characterization"
                />
                {releases.length !== 0 && (
                  <Tab
                    disableRipple
                    sx={{
                      "&.MuiTab-root": {
                        width: "200px",
                      },
                    }}
                    label={getText(i18nKeys.INFORMATION__TAB_HISTORY)}
                    id="tab-4"
                    value="history"
                  />
                )}
                {(dashboards.length || 0) > 0 && (
                  <Tab
                    disableRipple
                    sx={{
                      "&.MuiTab-root": {
                        width: "200px",
                      },
                    }}
                    label={getText(i18nKeys.INFORMATION__TAB_DASHBOARD)}
                    id="tab-3"
                    value="dashboard"
                  />
                )}
              </Tabs>
            </div>
            <div>
              <hr
                style={{
                  background: "#ACABAB",
                  opacity: "50%",
                  height: "1px",
                  border: "none",
                  marginTop: "-3px",
                }}
              ></hr>
            </div>
            {tabValue === DatasetInfoTab.DatasetInfo && (
              <div className="dataset__info">
                <SubTitle>{getText(i18nKeys.INFORMATION__HOW_TO_ACCESS)}</SubTitle>
                <div className="tab__content__info">
                  <ReactMarkdown>{study?.studyDetail?.description || ""}</ReactMarkdown>
                </div>
                <div className="metadata_tags_files__container">
                  <div className="metadata_tags__container">
                    {tags.length > 0 && (
                      <>
                        <div className="tags__content">
                          <SubTitle>{getText(i18nKeys.INFORMATION__TAGS)}</SubTitle>
                          <Paper component="ul" className="tag__list" elevation={0}>
                            {tags.map((tag: StudyTag) => (
                              <li key={tag.name}>
                                <Chip label={tag.name} />
                              </li>
                            ))}
                          </Paper>
                        </div>
                      </>
                    )}
                    {attributes.length > 0 && (
                      <>
                        <div className="metadata__content">
                          <SubTitle>{getText(i18nKeys.INFORMATION__METADATA)}</SubTitle>
                          <TableContainer className="study-metadata">
                            <Table>
                              <colgroup>
                                <col style={{ width: "40%" }} />
                                <col style={{ width: "60%" }} />
                              </colgroup>
                              <TableHead>
                                <TableRow>
                                  <TableCell>{getText(i18nKeys.INFORMATION__RESOURCE_TYPE)}</TableCell>
                                  <TableCell>{getText(i18nKeys.INFORMATION__DATASET)}</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {attributes.map((studyAttribute: StudyAttribute, index) => (
                                  <TableRow
                                    key={studyAttribute.attributeId}
                                    style={index % 2 ? { background: "#edf2f7" } : { background: "white" }}
                                  >
                                    <TableCell>{studyAttribute.attributeConfig.name}</TableCell>
                                    <TableCell>{studyAttribute.value}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="files__container">
                    <SubTitle>{getText(i18nKeys.INFORMATION__FILES)}</SubTitle>
                    <TableContainer>
                      <Table>
                        <colgroup>
                          <col />
                          <col style={{ width: 140 }} />
                          <col style={{ width: 150 }} />
                        </colgroup>
                        <TableHead>
                          <TableRow>
                            <TableCell>{getText(i18nKeys.INFORMATION__FILENAME)}</TableCell>
                            <TableCell>{getText(i18nKeys.INFORMATION__SIZE)}</TableCell>
                            <TableCell>{getText(i18nKeys.INFORMATION__DOWNLOAD_FILE)}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {(!resources || resources.length === 0) && (
                            <TableRow>
                              <TableCell colSpan={4} align="center">
                                {getText(i18nKeys.INFORMATION__NO_FILE_AVAILABLE)}
                              </TableCell>
                            </TableRow>
                          )}
                          {resources.map((res) => (
                            <TableRow key={res.name}>
                              <TableCell style={{ color: "#000e7e" }}>{res.name}</TableCell>
                              <TableCell style={{ color: "#000e7e" }}>{res.size}</TableCell>
                              <TableCell>
                                <IconButton
                                  startIcon={<DownloadIcon />}
                                  title={getText(i18nKeys.INFORMATION__DOWNLOAD)}
                                  onClick={() => handleDownloadResource(res)}
                                  loading={downloading === res.name}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </div>
                {(user.isStudyResearcher(activeStudyId) || user.isStudyManager(activeStudyId)) && (
                  <>
                    <FeatureGate featureFlags={[FEATURE_CDM_DOWNLOAD]}>
                      <div className="button-keygen__container">
                        <h3 className="keygen__title">{getText(i18nKeys.INFORMATION__PATIENT_DATA)}</h3>
                        <Button
                          className="button-keygen__block"
                          text={getText(i18nKeys.INFORMATION___DOWNLOAD_CDM_DATA)}
                          block
                          onClick={openCDMDownload}
                          loading={showCDMDownloadDialog}
                        />
                      </div>
                    </FeatureGate>
                    {showCDMDownloadDialog && (
                      <CDMDownloadDialog
                        open={showCDMDownloadDialog}
                        onClose={closeCDMDownload}
                        studyId={activeStudyId}
                      />
                    )}
                  </>
                )}

                {study?.studyDetail?.showRequestAccess && [Access.None, Access.Pending].includes(getAccess()) && (
                  <>
                    <div className="tab__content__subtitle">{getText(i18nKeys.INFORMATION__REQUEST_ACCESS)}</div>
                    {getAccess() === Access.None && (
                      <Button
                        // @ts-ignore
                        ref={requestAccessRef}
                        text={getText(i18nKeys.INFORMATION__REQUEST_ACCESS)}
                        className="button__request"
                        loading={requestLoading}
                      />
                    )}
                    {getAccess() === Access.Pending && (
                      <Button
                        text={getText(i18nKeys.INFORMATION__PENDING_APPROVAL)}
                        className="button__request"
                        disabled
                      />
                    )}
                  </>
                )}
              </div>
            )}
            {tabValue === DatasetInfoTab.DataCharacterization && (
              <>
                {!study?.schemaName ? (
                  <div className="info__section">
                    <div>{getText(i18nKeys.INFORMATION__SCHEMA_NAME_UNDEFINED)}</div>
                  </div>
                ) : (
                  <DQDJobResults
                    datasetId={activeStudyId}
                    datasetName={study?.schemaName}
                    tableType={DQD_TABLE_TYPES.DATA_CHARACTERIZATION}
                  />
                )}
              </>
            )}
            {tabValue === DatasetInfoTab.DataQuality && (
              <>
                {!study?.schemaName ? (
                  <div className="info__section">
                    <div>{getText(i18nKeys.INFORMATION__DATABASE_NAME_UNDEFINED)}</div>
                  </div>
                ) : (
                  <>
                    <SubTitle>{getText(i18nKeys.INFORMATION__OVERVIEW)}</SubTitle>
                    <DQDJobResults
                      datasetId={activeStudyId}
                      datasetName={study?.schemaName}
                      tableType={DQD_TABLE_TYPES.DATA_QUALITY_OVERVIEW}
                      activeReleaseId={activeReleaseId}
                    />
                    <SubTitle>{getText(i18nKeys.INFORMATION__RESULTS)}</SubTitle>
                    <DQDJobResults
                      datasetId={activeStudyId}
                      datasetName={study?.schemaName}
                      tableType={DQD_TABLE_TYPES.DATA_QUALITY_RESULTS}
                      activeReleaseId={activeReleaseId}
                    />
                  </>
                )}
              </>
            )}
            {tabValue === DatasetInfoTab.History && <DataQualityHistory activeDatasetId={activeStudyId} />}
            {tabValue === DatasetInfoTab.Dashboard && <DatasetDashboards dashboards={dashboards} />}
          </div>
        </div>
      </div>
    </div>
  );
};
