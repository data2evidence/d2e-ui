sap.ui.define([
    "sap/ui/core/library"
], function () {
    "use strict";

    sap.ui.getCore().setThemeRoot("sap_bluecrystal", ["sap.hc.mri.pa.config.ui.lib"], "");

    /**
     * SAPUI5 library for MRI PA Configuration.
     *
     * @namespace
     * @name sap.hc.mri.pa.config.ui.lib
     */
    sap.ui.getCore().initLibrary({
        name: "sap.hc.mri.pa.config.ui.lib",
        version: "1.0.0",
        dependencies: [
            "sap.ui.core"
        ],
        types: [],
        interfaces: [],
        controls: [
            "sap.hc.mri.pa.config.ui.lib.ConfigUtils",
            "sap.hc.mri.pa.config.ui.lib.Formatter"
        ],
        elements: []
    });

    return sap.hc.mri.pa.config.ui.lib;
});
