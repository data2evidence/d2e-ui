sap.ui.define(
  ["jquery.sap.global", "sap/m/library", "sap/ui/core/library"],
  function () {
    "use strict";
    sap.ui
      .getCore()
      .setThemeRoot("sap_bluecrystal", ["sap.hc.hph.core.ui"], "");
    /**
     * SAPUI5 library for FFH Core.
     *
     * @namespace
     * @name sap.hc.hph.core.ui
     */
    sap.ui.getCore().initLibrary({
      name: "sap.hc.hph.core.ui",
      version: "1.0.0",
      dependencies: ["sap.m", "sap.ui.core"],
      types: ["sap.hc.hph.core.ui.FioriUtils.DensityClass"],
      interfaces: [],
      controls: ["sap.hc.hph.core.ui.ConfigDialog"],
      elements: [
        "sap.hc.hph.core.ui.AjaxUtils",
        "sap.hc.hph.core.ui.DateUtils",
        "sap.hc.hph.core.ui.FioriUtils",
        "sap.hc.hph.core.ui.HPHFormatter",
        "sap.hc.hph.core.ui.JSONUtils",
        "sap.hc.hph.core.ui.MessageBox",
        "sap.hc.hph.core.ui.ScopedUtils",
        "sap.hc.hph.core.ui.TextUtils",
        "sap.hc.hph.core.ui.TimeoutHandler",
        "sap.hc.hph.core.ui.UserPrefsUtils",
        "sap.hc.hph.core.ui.XsrfHandler",
        "sap.hc.hph.core.ui.odata.ODataModel",
      ],
    });
    return sap.hc.hph.core.ui;
  }
);
