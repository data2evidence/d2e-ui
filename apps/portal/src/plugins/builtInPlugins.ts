// const superAdminPagePlugin = async () =>
//   await import(/* webpackChunkName: "super-admin-page-plugin" */ './SuperAdminPage/module')

const moduleNames = [
  "mri/CDM",
  "mri/Assignment",
  "mri/PatientAnalyticsConfig",
  "mri/PatientAnalytics",
  "mri/PatientSummaryConfig",
  "mri/Search",
  "Researcher/ConceptSets",
  "Researcher/KaplanMeier",
  "SystemAdmin/Nifi",
  "SystemAdmin/StudyOverview",
  "SystemAdmin/UserOverview",
  "SystemAdmin/NifiRegistry",
  "SystemAdmin/Sqleditor",
  "SystemAdmin/DQD",
  "SystemAdmin/Jobs",
  "SystemAdmin/Terminology",
  "SystemAdmin/Athena",
  "SystemAdmin/FlowOverview",
  "SystemAdmin/ConceptMapping",
  "Starboard",
  "Cohort",
  "Admin/Permissions",
  "Admin/Configuration",
  "Setup",
  "Setup/AzureAD",
  "Setup/Metadata",
  "Setup/Feature",
  "Setup/Db",
  "Setup/HybridSearch",
  "Setup/OverviewDescription",
];

const modulePaths = moduleNames.reduce(
  (acc, moduleName) => ({
    ...acc,
    [`plugins/${moduleName}/module`]: async () => await import(`./${moduleName}/module`),
  }),
  {}
);

const builtInPlugins: { [path: string]: any } = {
  ...modulePaths,
  // 'plugins/SuperAdminPage/module': superAdminPagePlugin
};

export default builtInPlugins;
