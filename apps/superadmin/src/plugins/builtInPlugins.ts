// const superAdminPagePlugin = async () =>
//   await import(/* webpackChunkName: "super-admin-page-plugin" */ './SuperAdminPage/module')
const moduleNames = [
  "mri/CDM",
  "mri/Assignment",
  "mri/PatientAnalyticsConfig",
  "mri/PatientSummaryConfig",
  "SuperAdmin/SystemOverview",
  "SuperAdmin/ActivityOverview",
  "SuperAdmin/StudyOverview",
  "SuperAdmin/TenantOverview",
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
