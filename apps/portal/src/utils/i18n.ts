export const i18nDefault = {
  default: {
    STUDY_CARD__DATASET_INFORMATION: "Dataset information",
    STUDY_CARD__NO_DATASET_SUMMARY: "No dataset summary available",
    STUDY_CARD__STUDY_CODE: "Study code",
    BAR_CHART__NO_DATA: "No data",
    BOX_PLOT_CHART__NO_DATA: "No data",
    DRILLDOWN_PREVALENCE_BY_MONTH_CHART__TITLE: "Prevalence by Month",
    DRILLDOWN_PREVALENCE_BY_MONTH_CHART__X_AXIS_NAME: "Date",
    DRILLDOWN_PREVALENCE_BY_MONTH_CHART__Y_AXIS_NAME: "Prevalence per 1000 People",
    DRILLDOWN_PREVALENCE_BY_MONTH_CHART__TOOLTIP_FORMAT: "Date: {b}<br />Prevalence per 1000 People: {c}",
    DRILLDOWN_PREVALENCE_BY_MONTH_CHART__Y_AXIS_FORMAT: "{value}",
    DRILLDOWN_PREVALENCE_BY_MONTH_CHART__NO_DATA: "No data",
    DRILLDOWN_TRELLIS_CHART__TITLE: "Prevalence",
    DRILLDOWN_TRELLIS_CHART__TRELLIS_TOP_LABEL: "Age Decile",
    DRILLDOWN_TRELLIS_CHART__TRELLIS_BOTTOM_LABEL: "Years of Observation",
    DRILLDOWN_TRELLIS_CHART__Y_AXIS_PREVALENCE_PER_1000_PEOPLE: "Prevalence per 1000 People",
    TEST_KEY: "default",
  },
};

function getKeyMap<T extends object>(obj: T) {
  const result = {} as Record<keyof T, keyof T>;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key as keyof T] = key as keyof T;
    }
  }
  return result as { [K in keyof T]: K };
}

// Exposing the default key map so that getText('MRI_PA_FILTERCARD_SELECTION_NONE')
// can be getText(i18nKeys.MRI_PA_FILTERCARD_SELECTION_NONE)
// to prevent typos with the values
export const i18nKeys = getKeyMap(i18nDefault.default);
