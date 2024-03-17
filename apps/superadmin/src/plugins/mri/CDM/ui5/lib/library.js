sap.ui.define([
    "jquery.sap.global",
    "sap/ui/core/library"
], function (jQuery) {
    "use strict";

     sap.ui.getCore().setThemeRoot("sap_bluecrystal", ["sap.hc.hph.cdw.config.ui.lib"], "");

    /**
     * SAPUI5 library for FFH CDM Configuration
     *
     * @namespace
     * @name sap.hc.hph.cdw.config.ui.lib
     * @author SAP SE
     * @version 1.0.0
     * @public
     */
    sap.ui.getCore().initLibrary({
        name: "sap.hc.hph.cdw.config.ui.lib",
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
                   "sap.hc.hph.cdw.config.ui.lib.BackendLinker",
                   "sap.hc.hph.cdw.config.ui.lib.Config",
                   "sap.hc.hph.cdw.config.ui.lib.ConfigModelsData",
                   "sap.hc.hph.cdw.config.ui.lib.ConfigModelsManager",                   
                   "sap.hc.hph.cdw.config.ui.lib.DragDropContainer",
                   "sap.hc.hph.cdw.config.ui.lib.DragDropContainerReceiver",
                   "sap.hc.hph.cdw.config.ui.lib.DragDropContainerTemplate",
                   "sap.hc.hph.cdw.config.ui.lib.FilterCard",
                   "sap.hc.hph.cdw.config.ui.lib.FilterCardGroup",
                   "sap.hc.hph.cdw.config.ui.lib.Formatter",
                   "sap.hc.hph.cdw.config.ui.lib.SmartAccordion",
                   "sap.hc.hph.cdw.config.ui.lib.ValidityVisualElement"
        ],
        elements: [
                    "sap.hc.hph.cdw.config.ui.lib.ConfigUtils"
        ]
    });

    return sap.hc.hph.cdw.config.ui.lib;
});
