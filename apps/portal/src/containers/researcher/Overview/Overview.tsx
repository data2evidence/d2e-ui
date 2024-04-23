import React, { FC, useMemo, useState, useCallback } from "react";
import classNames from "classnames";
import debounce from "lodash/debounce";
import { Loader } from "@portal/components";
import { StudyCard } from "../../shared/StudyOverview/StudyCard/StudyCard";
import { useDatasets } from "../../../hooks";
import { FEATURE_DATASET_FILTER, config } from "../../../config/index";
import { DatasetFilters } from "./components/DatasetFilters";
import noStudyImg from "../../shared/StudyOverview/images/no-study.png";
import { FeatureGate } from "../../../config/FeatureGate";
import "./Overview.scss";
import { useTranslation } from "../../../contexts";

export const Overview: FC = () => {
  const { getText, i18nKeys } = useTranslation();
  const [filters, setFilters] = useState<Record<string, string>>({});
  const debounceSetFilters = debounce((filters: Record<string, string>) => setFilters(filters), 300);
  const [datasets, loading, error] = useDatasets("researcher", filters);

  const RenderStudies = useMemo(() => {
    if (loading) return <Loader />;

    if (datasets.length === 0) {
      return (
        <>
          <img alt="No dataset" src={noStudyImg} height="160" width="270" />
          <p>{getText(i18nKeys.OVERVIEW__NO_DATASET)}</p>
        </>
      );
    }

    return (
      <div className="overview__studies overview__single_tenant">
        {datasets.map((study) => (
          <StudyCard key={study.id} study={study} path={config.ROUTES.researcher} />
        ))}
      </div>
    );
  }, [datasets, loading, getText]);

  const handleFiltersChange = useCallback(
    (filters: Record<string, string>) => {
      debounceSetFilters(filters);
    },
    [debounceSetFilters]
  );

  if (error) console.error(error.message);

  return (
    <div className="overview">
      <FeatureGate featureFlags={[FEATURE_DATASET_FILTER]}>
        <div className="overview__filter">
          <DatasetFilters onChange={handleFiltersChange} />
        </div>
      </FeatureGate>
      <div className={classNames("overview__content", { "overview__content--empty": datasets.length === 0 })}>
        {RenderStudies}
      </div>
    </div>
  );
};
