sap.ui.define([
    "jquery.sap.global",
    "sap/ui/core/library"
], function (jQuery) {
    "use strict";

    sap.ui.getCore().setThemeRoot("sap_bluecrystal", ["hc.hph.config.assignment.ui.lib"], "");

    /**
     * SAPUI5 library for Configurations Assignment.
     *
     * @namespace
     * @name hc.hph.config.assignment.ui.lib
     * @author SAP SE
     * @version 1.0.0
     * @public
     */
    sap.ui.getCore().initLibrary({
        name: "hc.hph.config.assignment.ui.lib",
        version: "1.0.0",
        dependencies: [
            "sap.ui.core",
            "sap.ui.commons"
        ],
        types: [
        ],
        interfaces: [
        ],
        controls: [
        ],
        elements: [
            "hc.hph.config.assignment.ui.lib.Formatter",
            "hc.hph.config.assignment.ui.lib.TextUtils",
            "hc.hph.config.assignment.ui.lib.BackendLinker"
        ]
    });

    return hc.hph.config.assignment.ui.lib;
});
