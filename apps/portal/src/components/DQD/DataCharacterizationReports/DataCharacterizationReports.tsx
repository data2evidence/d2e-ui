import React, { FC, useState } from "react";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import { FormControl } from "@mui/material";

import Dashboard from "../../Charts/Reports/Dashboard/Dashboard";
import DataDensity from "../../Charts/Reports/DataDensity/DataDensity";
import Person from "../../Charts/Reports/Person/Person";
import Death from "../../Charts/Reports/Death/Death";
import ObservationPeriod from "../../Charts/Reports/ObservationPeriod/ObservationPeriod";
import SharedDrilldown from "../../Charts/Reports/Drilldown/SharedDrilldown";

import { WEBAPI_CDMRESULTS_SOURCE_KEYS } from "../types";
import "./DataCharacterizationReports.scss";
import { TranslationContext } from "../../../contexts/TranslationContext";

interface DataCharacterizationReportsProps {
  flowRunId: string;
}

enum READABLE_MENU_ITEMS {
  SHOW_ALL = "Show All Reports",
  DASHBOARD = "Dashboard",
  DATA_DENSITY = "Data Density",
  PERSON = "Person",
  VISIT = "Visit",
  CONDITION = "Condition Occurence",
  CONDITION_ERA = "Condition Era",
  PROCEDURE = "Procedure",
  DRUG = "Drug Exposure",
  DRUG_ERA = "Drug Era",
  MEASUREMENT = "Measurement",
  OBSERVATION = "Observation",
  OBSERVATION_PERIOD = "Observation Period",
  DEATH = "Death",
}

const DataCharacterizationReports: FC<DataCharacterizationReportsProps> = ({ flowRunId }) => {
  const { getText, i18nKeys } = TranslationContext();
  const [selectedReport, setSelectedReport] = useState(WEBAPI_CDMRESULTS_SOURCE_KEYS.DASHBOARD as string);

  const handleMenuSelect = (selection: string) => {
    setSelectedReport(selection);
  };

  const renderReports = (sourceKey: string) => {
    switch (sourceKey) {
      case WEBAPI_CDMRESULTS_SOURCE_KEYS.DASHBOARD:
        return <Dashboard flowRunId={flowRunId} />;
      case WEBAPI_CDMRESULTS_SOURCE_KEYS.DATA_DENSITY:
        return <DataDensity flowRunId={flowRunId} />;
      case WEBAPI_CDMRESULTS_SOURCE_KEYS.PERSON:
        return <Person flowRunId={flowRunId} />;
      case WEBAPI_CDMRESULTS_SOURCE_KEYS.OBSERVATION_PERIOD:
        return <ObservationPeriod flowRunId={flowRunId} />;
      case WEBAPI_CDMRESULTS_SOURCE_KEYS.DEATH:
        return <Death flowRunId={flowRunId} />;

      // These sourceKeys share reuseable drilldown chart logic
      case WEBAPI_CDMRESULTS_SOURCE_KEYS.VISIT:
      case WEBAPI_CDMRESULTS_SOURCE_KEYS.CONDITION:
      case WEBAPI_CDMRESULTS_SOURCE_KEYS.CONDITION_ERA:
      case WEBAPI_CDMRESULTS_SOURCE_KEYS.PROCEDURE:
      case WEBAPI_CDMRESULTS_SOURCE_KEYS.DRUG:
      case WEBAPI_CDMRESULTS_SOURCE_KEYS.DRUG_ERA:
      case WEBAPI_CDMRESULTS_SOURCE_KEYS.MEASUREMENT:
      case WEBAPI_CDMRESULTS_SOURCE_KEYS.OBSERVATION:
        return <SharedDrilldown flowRunId={flowRunId} sourceKey={sourceKey} key={sourceKey} />;

      case READABLE_MENU_ITEMS.SHOW_ALL:
        return (
          <>
            <Dashboard flowRunId={flowRunId} />
            <DataDensity flowRunId={flowRunId} />
            <Person flowRunId={flowRunId} />
            <ObservationPeriod flowRunId={flowRunId} />
            <Death flowRunId={flowRunId} />
            <SharedDrilldown
              flowRunId={flowRunId}
              sourceKey={WEBAPI_CDMRESULTS_SOURCE_KEYS.VISIT}
              key={WEBAPI_CDMRESULTS_SOURCE_KEYS.VISIT}
            />
            <SharedDrilldown
              flowRunId={flowRunId}
              sourceKey={WEBAPI_CDMRESULTS_SOURCE_KEYS.CONDITION}
              key={WEBAPI_CDMRESULTS_SOURCE_KEYS.CONDITION}
            />
            <SharedDrilldown
              flowRunId={flowRunId}
              sourceKey={WEBAPI_CDMRESULTS_SOURCE_KEYS.CONDITION_ERA}
              key={WEBAPI_CDMRESULTS_SOURCE_KEYS.CONDITION_ERA}
            />
            <SharedDrilldown
              flowRunId={flowRunId}
              sourceKey={WEBAPI_CDMRESULTS_SOURCE_KEYS.PROCEDURE}
              key={WEBAPI_CDMRESULTS_SOURCE_KEYS.PROCEDURE}
            />
            <SharedDrilldown
              flowRunId={flowRunId}
              sourceKey={WEBAPI_CDMRESULTS_SOURCE_KEYS.DRUG}
              key={WEBAPI_CDMRESULTS_SOURCE_KEYS.DRUG}
            />
            <SharedDrilldown
              flowRunId={flowRunId}
              sourceKey={WEBAPI_CDMRESULTS_SOURCE_KEYS.DRUG_ERA}
              key={WEBAPI_CDMRESULTS_SOURCE_KEYS.DRUG_ERA}
            />
            <SharedDrilldown
              flowRunId={flowRunId}
              sourceKey={WEBAPI_CDMRESULTS_SOURCE_KEYS.MEASUREMENT}
              key={WEBAPI_CDMRESULTS_SOURCE_KEYS.MEASUREMENT}
            />
            <SharedDrilldown
              flowRunId={flowRunId}
              sourceKey={WEBAPI_CDMRESULTS_SOURCE_KEYS.OBSERVATION}
              key={WEBAPI_CDMRESULTS_SOURCE_KEYS.OBSERVATION}
            />
          </>
        );
    }
  };

  // Map backend source_key enum to a more friendly human readable text
  const mapToReadable = (key: string) => {
    return READABLE_MENU_ITEMS[key as keyof typeof READABLE_MENU_ITEMS];
  };

  return (
    <>
      <FormControl className="report-selector-form" fullWidth>
        <InputLabel id="report-selector-label">
          {getText(i18nKeys.DATA_CHARACTERIZATION_REPORTS__REPORT_SELECTOR_LABEL)}
        </InputLabel>
        <Select
          labelId="report-selector-label"
          id="report-selector"
          value={selectedReport}
          label={getText(i18nKeys.DATA_CHARACTERIZATION_REPORTS__REPORT_SELECTOR_LABEL)}
          onChange={(e) => {
            handleMenuSelect(e.target.value);
          }}
        >
          {/* Additional menu item to show all */}
          <MenuItem value={READABLE_MENU_ITEMS.SHOW_ALL} key={READABLE_MENU_ITEMS.SHOW_ALL}>
            {READABLE_MENU_ITEMS.SHOW_ALL}
          </MenuItem>
          {Object.keys(WEBAPI_CDMRESULTS_SOURCE_KEYS).map((key) => (
            <MenuItem
              value={WEBAPI_CDMRESULTS_SOURCE_KEYS[key as keyof typeof WEBAPI_CDMRESULTS_SOURCE_KEYS]}
              key={key}
            >
              {mapToReadable(key)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <div>{renderReports(selectedReport)}</div>
    </>
  );
};

export default DataCharacterizationReports;
