import React, { FC, Fragment, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, DatabaseIcon, FileIcon } from "@portal/components";
import { Study, StudyTag, StudyAttribute } from "../../../../types";
import { StudyInfoTab } from "../../../researcher/Information/Information";
import { Chip } from "@mui/material";
import "./StudyCard.scss";
import { TranslationContext } from "../../../../contexts/TranslationContext";
import { i18nKeys } from "../../../../utils/i18n";

export interface StudyCardProps {
  study: Study;
  path: string;
}

export const StudyCard: FC<StudyCardProps> = ({ study, path }) => {
  const navigate = useNavigate();
  const { getText } = TranslationContext();

  const handleInformationClick = useCallback(
    (study: Study) => {
      navigate(`${path}/information`, {
        state: {
          studyId: study.id,
          tab: StudyInfoTab.DataInfo,
          tenantId: study.tenant.id,
        },
      });
    },
    [navigate, path]
  );

  const buttonGroupRender = useMemo(() => {
    return (
      <div className="study-card__buttons">
        <div className="study-card__button" onClick={() => handleInformationClick(study)}>
          <FileIcon />
          <p>{getText(i18nKeys.STUDY_CARD__DATASET_INFORMATION)}</p>
        </div>
      </div>
    );
  }, [handleInformationClick, study]);

  const studyTagsRender = useMemo(() => {
    return (
      <div className={study.tags?.length !== 0 ? "study-card__tags" : "study-card__tags_empty"}>
        {study.tags?.map((tag: StudyTag) => (
          <Fragment key={tag.id}>
            <Chip label={tag.name} />
          </Fragment>
        ))}
      </div>
    );
  }, [study]);

  const studyAttributesRender = useMemo(() => {
    return (
      <div className={study.attributes?.length !== 0 ? "study-card__tags" : "study-card__tags_empty"}>
        {study.attributes?.map(
          (studyAttribute: StudyAttribute) =>
            studyAttribute.attributeConfig.isDisplayed && (
              <div key={studyAttribute.attributeId}>
                {`${studyAttribute.attributeConfig.name}: ${studyAttribute.value}`}
              </div>
            )
        )}
      </div>
    );
  }, [study]);

  return (
    <Card title={study.studyDetail?.name || "Untitled"} icon={DatabaseIcon} className="study-card" borderRadius={20}>
      <div className="study-card__summary">
        {study.studyDetail?.summary ? (
          <div className="study-card__summary_container">
            <div className="study-card__summary_text">
              <p>{study.studyDetail?.summary}</p>
            </div>
            {studyTagsRender}
          </div>
        ) : (
          <div className="study-card__no_summary">
            <div className="study-card__no_summary_text">
              <div>{getText(i18nKeys.STUDY_CARD__NO_DATASET_SUMMARY)}</div>
            </div>
            {studyTagsRender}
          </div>
        )}
        {buttonGroupRender}
      </div>

      <div className="study-card__metadata">
        <div className="metadata-study-code">
          {getText(i18nKeys.STUDY_CARD__STUDY_CODE)}: {study.tokenStudyCode}
        </div>
        {studyAttributesRender}
      </div>
    </Card>
  );
};
