export const i18nDefault = {
  default: {
    TEST_KEY: "default",
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
    TREE_MAP_CHART__PREVALENCE: "Prevalence",
    TREE_MAP_CHART__NUMBER_OF_PEOPLE: "Number of people",
    TREE_MAP_CHART__RECORDS_PER_PERSON: "Records per person",
    TREE_MAP_CHART__CHART_LEGEND: "Box Size: Prevalence, Color: Records per person (Green to Grey = High to Low)",
    TREE_MAP_CHART_TABLE__NO_DATA: "No data",
    TREE_MAP_CHART_TABLE__LABEL_TREEMAP: "Treemap",
    TREE_MAP_CHART_TABLE__LABEL_TABLE: "Table",
    TREE_MAP_TABLE__HEADER_CONCEPT_ID: "Concept Id",
    TREE_MAP_TABLE__HEADER_CONCEPT_PATH: "Name",
    TREE_MAP_TABLE__HEADER_NUM_PERSONS: "Person Count",
    TREE_MAP_TABLE__HEADER_PERCENT_PERSONS: "Prevalence",
    TREE_MAP_TABLE__HEADER_RECORDS_PER_PERSON: "Length of era",
    DASHBOARD__ERROR_MESSAGE: "Error occurred when fetching data characterization dashboard data",
    DASHBOARD__PIE_CHART_TITLE: "Gender",
    DASHBOARD__BAR_CHART_TITLE: "Age at First Observation",
    DASHBOARD__BAR_CHART_X_AXIS_NAME: "Age",
    DASHBOARD__BAR_CHART_Y_AXIS_NAME: "People",
    DASHBOARD__BAR_CHART_TOOLTIP_FORMAT: "Age: {b}<br />Number of People: {c}",
    DASHBOARD__LOADER: "Loading Dashboard Reports",
    DATA_DENSITY__ERROR_MESSAGE: "Error occurred when fetching data characterization data density data",
    DATA_DENSITY__LOADER: "Loading Data Density Reports",
    DATA_DENSITY__BOX_PLOT_TITLE: "Concepts Per Person",
    DATA_DENSITY__BOX_PLOT_X_AXIS_NAME: "Concept Type",
    DATA_DENSITY__BOX_PLOT_Y_AXIS_NAME: "Concepts Per Person",
    DEATH__ERROR_MESSAGE: "Error occurred when fetching data characterization death data",
    DEATH__LOADER: "Loading Death Reports",
    DEATH__PIE_CHART_TITLE: "Death By Type",
    DEATH__BOX_PLOT_CHART_TITLE: "Age at Death",
    DEATH__BOX_PLOT_CHART_X_AXIS_NAME: "Gender",
    DEATH__BOX_PLOT_CHART_Y_AXIS_NAME: "Age at first occurrence",
    SHARED_DRILLDOWN__ERROR_MESSAGE: "Error occurred when fetching data characterization {0} data",
    SHARED_DRILLDOWN__BOX_PLOT_CHART_TITLE_1: "Age at First Occurrence",
    SHARED_DRILLDOWN__BOX_PLOT_CHART_X_AXIS_NAME_1: "Gender",
    SHARED_DRILLDOWN__BOX_PLOT_CHART_Y_AXIS_NAME_1: "Age at First Occurrence",
    SHARED_DRILLDOWN__BOX_PLOT_CHART_TITLE_2: "Length of Era Distribution",
    SHARED_DRILLDOWN__BOX_PLOT_CHART_X_AXIS_NAME_2: "Length of Era",
    SHARED_DRILLDOWN__BOX_PLOT_CHART_Y_AXIS_NAME_2: "Days",
    SHARED_DRILLDOWN__PIE_CHART_TITLE_1: "Value As Concept",
    SHARED_DRILLDOWN__PIE_CHART_TITLE_2: "Operator Concept",
    SHARED_DRILLDOWN__PIE_CHART_TITLE_3: "Qualifier Concept",
    SHARED_DRILLDOWN__PIE_CHART_TITLE_4: "Measurement Records by Unit",
    SHARED_DRILLDOWN__BAR_CHART_TITLE: "Frequency Distribution",
    SHARED_DRILLDOWN__BAR_CHART_X_AXIS_NAME: 'Count ("x" or more Procedures)',
    SHARED_DRILLDOWN__BAR_CHART_Y_AXIS_NAME: "% of total number of persons",
    SHARED_DRILLDOWN__BAR_CHART_TOOLTIP_FORMAT: "Count: {b}<br />% of total number of persons: {c}",
    SHARED_DRILLDOWN__LOADER: "Loading {0} Reports",
    SHARED_DRILLDOWN__DRILLDOWN_LOADER: "Loading {0} Drilldown for concept: {1}",
    SHARED_DRILLDOWN__TREE_MAP_CHART_TITLE: " Tree Map",
  },
};
// const { getText, i18nKeys } = TranslationContext();
// getText(i18nKeys.TREE_MAP_CHART__PREVALENCE)

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
