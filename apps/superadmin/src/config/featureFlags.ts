import { loadPlugins } from "../utils";

// Researcher plugins
const FEATURE_PATIENT_ANALYTICS = "pa";
const FEATURE_STARBOARD = "starboard";
const FEATURE_COHORT = "cohort";
const FEATURE_TERMINOLOGY = "terminology";

// Admin plugins
const FEATURE_PERMISSIONS = "permissions";
const FEATURE_CONFIGURATION = "configuration";

// Non plugin features
const FEATURE_CDM_DOWNLOAD = "cdmDownload";
const FEATURE_DISPLAY_CONTACTS = "displayContacts";
const FEATURE_DISABLE_JUPYTER_CELL = "disableJupyterCell";
const FEATURE_DATASET_FILTER = "datasetFilter";

interface IFeatureFlag {
  [key: string]: string;
}

// Prefix "sub:" indicate indentation in the Tenant Settings dialog
const FEATURES: IFeatureFlag = {
  [FEATURE_DATASET_FILTER]: "Display filter in dataset overview",
  [FEATURE_CDM_DOWNLOAD]: "Display CDM Download button",
  [FEATURE_DISPLAY_CONTACTS]: "Display contact persons",
  [FEATURE_DISABLE_JUPYTER_CELL]: "sub:Disable Jupyter cells",
};

// Define the sequence order of the feature flags in the Tenant Settings dialog
const FEATURE_FLAG_SEQUENCE = [
  FEATURE_DATASET_FILTER,
  FEATURE_PATIENT_ANALYTICS,
  FEATURE_COHORT,

  // Starboard feature flags
  FEATURE_STARBOARD,
  FEATURE_DISABLE_JUPYTER_CELL,

  FEATURE_TERMINOLOGY,

  FEATURE_PERMISSIONS,
  FEATURE_CONFIGURATION,
  FEATURE_CDM_DOWNLOAD,
  FEATURE_DISPLAY_CONTACTS,
];
export const getFeatureFlagsWithChildren = (): { [key: string]: string[] } => {
  const plugins = loadPlugins();
  return plugins.researcher.reduce<{ [key: string]: string[] }>((acc, plugin) => {
    if (plugin.subFeatureFlags) {
      acc[plugin.route] = plugin.subFeatureFlags;
    }
    return acc;
  }, {});
};

// Combine researcher plugins as feature flags and non-plugin feature flags in defined sequence order
export const getFeatureFlags = () => {
  const plugins = loadPlugins();

  const pluginFeatures = plugins.researcher.reduce<IFeatureFlag>((acc, plugin) => {
    acc[plugin.featureFlag!] = plugin.name;
    return acc;
  }, {});

  const combined = { ...pluginFeatures, ...FEATURES };

  const sorted = Object.keys(combined)
    .sort((a, b) => FEATURE_FLAG_SEQUENCE.indexOf(a) - FEATURE_FLAG_SEQUENCE.indexOf(b))
    .reduce<IFeatureFlag>((acc, feat) => {
      acc[feat] = combined[feat];
      return acc;
    }, {});

  return sorted;
};

export const getSystemFeatureFlags = () => {
  const plugins = loadPlugins();
  const pluginFeatures = [...plugins.systemadmin].reduce<IFeatureFlag>((acc, plugin) => {
    if (plugin.featureFlag) {
      acc[plugin.featureFlag] = plugin.name;
    }
    return acc;
  }, {});
  return pluginFeatures;
};
