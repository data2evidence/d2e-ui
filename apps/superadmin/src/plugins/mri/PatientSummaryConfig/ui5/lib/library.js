sap.ui.define(["sap/m/library", "sap/ui/core/library"], function () {
  "use strict";

  // sap.ui.getCore().setThemeRoot("sap_belize", ["sap.hc.hph.patient.app.ui.lib"], "");
  sap.ui.getCore().setThemeRoot("sap_bluecrystal", ["sap.hc.hph.patient.app.ui.lib"], "");
  // sap.ui.getCore().setThemeRoot("sap_hcb", ["sap.hc.hph.patient.app.ui.lib"], "");

  /**
   * SAPUI5 library for FFH Patient Summary Configuration.
   *
   * @namespace
   * @name sap.hc.hph.patient.config.ui.lib
   */
  sap.ui.getCore().initLibrary({
    name: "sap.hc.hph.patient.config.ui.lib",
    version: "1.0.0",
    dependencies: ["sap.m", "sap.ui.core"],
    types: [],
    interfaces: [],
    controls: [
      "sap.hc.hph.patient.config.ui.lib.SortedMultiComboBox",
      "sap.hc.hph.patient.config.ui.lib.PlottableAttributesFormLayout",
      "sap.hc.hph.patient.config.ui.lib.EnterAwareInput",
    ],
    elements: [
      "sap.hc.hph.patient.config.ui.lib.BackendLinker",
      "sap.hc.hph.patient.config.ui.lib.ConfigUpgrade",
      "sap.hc.hph.patient.config.ui.lib.ConfigUtils",
      "sap.hc.hph.patient.config.ui.lib.Formatter",
      "sap.hc.hph.patient.config.ui.lib.PlottableAttributesFormElement",
    ],
  });

  return sap.hc.hph.patient.config.ui.lib;
});
