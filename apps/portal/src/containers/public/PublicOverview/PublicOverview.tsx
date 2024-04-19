import React, { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader, Title } from "@portal/components";
import { StudyCard } from "../../shared/StudyOverview/StudyCard/StudyCard";
import { usePublicDatasets } from "../../../hooks";
import { config } from "../../../config/index";
import "./PublicOverview.scss";
import { TranslationContext } from "../../../contexts/TranslationContext";

export const PublicOverview: FC = () => {
  const { getText, i18nKeys } = TranslationContext();
  const navigate = useNavigate();

  const [datasets, loading, error] = usePublicDatasets();

  useEffect(() => {
    if (datasets && datasets.length === 0) {
      navigate(config.ROUTES.login);
    }
  }, [datasets, navigate]);

  if (error) console.error(error.message);
  if (loading) return <Loader />;

  return (
    <div className="public-overview">
      <div className="public-overview__content">
        <div className="public-overview__header">
          <Title>{getText(i18nKeys.PUBLIC_OVERVIEW__DATASET_OVERVIEW)}</Title>
        </div>
        <div className="public-overview__studies_container">
          <div className="public-overview__studies public-overview__single_tenant">
            {datasets &&
              datasets.map((study) => <StudyCard key={study.id} study={study} path={config.ROUTES.public} />)}
          </div>
        </div>
      </div>
    </div>
  );
};
