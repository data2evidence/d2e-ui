import React, { FC, useState, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import { Loader, TableCell, TableRow, SubTitle } from "@portal/components";
import { StudyAttribute, StudyTag, LocationState } from "../../../types";
import { PublicStudyMenu } from "./StudyMenu/PublicStudyMenu";
import "./PublicInformation.scss";
import { usePublicDatasets } from "../../../hooks";
import { TranslationContext } from "../../../contexts/TranslationContext";

export const StudyInfoTab = {
  DataInfo: "data_info",
  DataExplore: "data_explore",
};

export const PublicInformation: FC = () => {
  const { getText, i18nKeys } = TranslationContext();
  const [datasets, loading, error] = usePublicDatasets();

  const location = useLocation();
  const state = location.state as LocationState;

  const [activeStudyId, setActiveStudyId] = useState<string>(state?.studyId || "");
  const [activeTab, setActiveTab] = useState(state?.tab || StudyInfoTab.DataInfo);
  const activeStudy = datasets?.find((s) => s.id === activeStudyId);
  const attributes = activeStudy?.attributes || [];
  const tags = activeStudy?.tags || [];

  useEffect(() => {
    setActiveStudyId(state.studyId);
    setActiveTab(state.tab);
    window.scrollTo(0, 0);
  }, [state]);

  const handleTabChange = useCallback(
    (value: string): void => {
      if (value !== StudyInfoTab.DataExplore) {
        setActiveTab(value);
      }
      setActiveTab(value);
    },
    [setActiveTab]
  );

  if (error) console.error(error.message);
  if (loading) return <Loader />;

  return (
    <>
      <div className="public-information__container">
        <div className="public-information__studies">
          <PublicStudyMenu activeStudy={activeStudy} activeTab={activeTab} onClick={handleTabChange} />
        </div>
        <div className="public-information__study_content">
          <div className="tab__content">
            {activeTab === StudyInfoTab.DataInfo && (
              <div className="tab__content__container">
                <div className="tab__content__title">
                  {activeStudy?.studyDetail?.name
                    ? activeStudy?.studyDetail?.name
                    : getText(i18nKeys.PUBLIC_INFORMATION__UNTITLED)}
                </div>

                <div className="tab__content__info">
                  <ReactMarkdown>{activeStudy?.studyDetail?.description || ""}</ReactMarkdown>
                </div>

                <div className="metadata_tags__container">
                  {tags.length > 0 && (
                    <>
                      <div className="tags__content">
                        <SubTitle>{getText(i18nKeys.PUBLIC_INFORMATION__TAGS)}</SubTitle>
                        <Paper component="ul" className="tag__list" elevation={0}>
                          {tags.map((tag: StudyTag) => (
                            <li key={tag.id}>
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
                        <SubTitle>{getText(i18nKeys.PUBLIC_INFORMATION__METADATA)}</SubTitle>
                        <TableContainer className="study-metadata">
                          <Table>
                            <colgroup>
                              <col style={{ width: "40%" }} />
                              <col style={{ width: "60%" }} />
                            </colgroup>
                            <TableHead>
                              <TableRow>
                                <TableCell>{getText(i18nKeys.PUBLIC_INFORMATION__RESOURCE_TYPE)}</TableCell>
                                <TableCell>{getText(i18nKeys.PUBLIC_INFORMATION__DATASET)}</TableCell>
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
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
