import React, { FC, useEffect, useMemo } from "react";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { Loader } from "@portal/components";
import { usePublicDatasets } from "../../../hooks";
import { config } from "../../../config/index";
import { useTranslation } from "../../../contexts";
import noStudyImg from "../../shared/StudyOverview/images/no-study.png";
import { PublicDatasetCard } from "../PublicDatasetCard/PublicDatasetCard";
import { SearchBarDataset } from "../../researcher/Overview/components/SearchBarDatasets";
import { HomeHeader } from "../../researcher/Overview/components/HomeHeader";
import { AccountButton } from "../../researcher/Overview/components/AccountButton";
import env from "../../../env";
import "./PublicOverview.scss";

export const PublicOverview: FC = () => {
  const { getText, i18nKeys } = useTranslation();
  const navigate = useNavigate();

  const [datasets, loading, error] = usePublicDatasets();

  useEffect(() => {
    if (datasets && datasets.length === 0) {
      navigate(config.ROUTES.login);
    }
  }, [datasets, navigate]);

  const RenderDatasets = useMemo(() => {
    const isEmpty = datasets == null || datasets.length === 0;
    const classes = classNames("public-overview__datasets", { "public-overview__datasets--empty": isEmpty });

    if (loading) return <Loader />;

    return (
      <div className={classes}>
        {isEmpty ? (
          <>
            <img alt="No dataset" src={noStudyImg} height="160" width="270" />
            <p>{getText(i18nKeys.OVERVIEW__NO_DATASET)}</p>
          </>
        ) : (
          datasets.map((dataset) => (
            <PublicDatasetCard key={dataset.id} dataset={dataset} path={config.ROUTES.public} />
          ))
        )}
      </div>
    );
  }, [datasets, loading, getText]);

  if (error) console.error(error.message);
  if (loading) return <Loader />;

  return (
    <div className="public-overview">
      <HomeHeader />
      <div className="public-overview__banner">
        <div className="public-overview__banner-content">
          <img alt="Illustration" src={`${env.PUBLIC_URL}/assets/landing-page-illustration.svg`} />
          <div className="public-overview__banner-title">
            <div className="public-overview__banner-title-text">Data2Evidence</div>
            <div className="public-overview__banner-description">{getText(i18nKeys.HOME__DESCRIPTION)}</div>
            <SearchBarDataset />
          </div>
        </div>
        <AccountButton />
      </div>
      <div className="public-overview__content">{RenderDatasets}</div>
    </div>
  );
};
