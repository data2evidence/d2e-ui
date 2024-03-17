jQuery.sap.registerModulePath("sap.hc", "/sap/hc");

sap.ui.define([
    "jquery.sap.global",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/IconPool",
    "sap/ui/model/resource/ResourceModel",
    "./lib/TextUtils"
], function (jQuery, UIComponent, JSONModel, IconPool, ResourceModel, TextUtils) {
    "use strict";

    var Component = UIComponent.extend("sap.hc.hph.config.assignment.ui.Component", {
        metadata: {
            name: "HPH AssignmentConfig",
            version: "${version}",
            dependencies: {
                libs: [
                    "sap.hc.hph.config.assignment.ui.lib",
                    "sap.m",
                    "sap.ui.commons",
                    "sap.ui.core",
                    "sap.ui.layout",
                    "sap.ui.unified",
                    "sap.ui.ux3",
                    "sap.ui.table",
                ],
                ui5version: "1.28.3"
            },
            config: {
                fullWidth: true,
                titleResource: "HPH_CFG_ASSIGN_TITLE_CONFIG_ASSIGNMENT",
                resourceBundle: "i18n/text.properties",
                modulePath: "/sap/hc/hph/config/assignment/ui",
                configService: {
                    modulePath: "/sap/hc/hph/config",
                    resourceBundle: "i18n/text.properties"
                }
            },
            rootView: "sap.hc.hph.config.assignment.ui.views.App"
        }
    });
    /**
     * Initialize the component.
     * @override
     */
    Component.prototype.init = function () {
        

        // ----
        // Resource bundle model for i18n:
        var oRBModel = new ResourceModel({
                bundleUrl:  this.getMetadata().getConfig().modulePath  + "/" + this.getMetadata().getConfig().resourceBundle 
            });
        
        oRBModel.enhance({
            bundleUrl: this.getMetadata().getConfig().configService.modulePath + "/" + this.getMetadata().getConfig().configService.resourceBundle
        });

        this.setModel(oRBModel, "i18n");
        TextUtils.setResourceBundle(oRBModel.getResourceBundle());

        this._fnAddHelpLink();

        UIComponent.prototype.init.apply(this, arguments);
        
    };

    Component.prototype._fnAddHelpLink = function () {
        var oCorei18nResourceModel = new ResourceModel({
            bundleUrl: [jQuery.sap.getModulePath("sap.hc.hph.core.ui"), "i18n/messagebundle.properties"].join("/")
        });
        if (sap.ushell && sap.ushell.renderers) {
            var oRenderer = sap.ushell.renderers.fiori2.RendererExtensions;
            this._oHelpLink = new sap.m.Button({
                icon: "sap-icon://sys-help",
                text: oCorei18nResourceModel.getResourceBundle().getText("APPLICATION_HELP"),
                press: [function () {
                    var sUrl = "https://help.sap.com/viewer/fddd7c5de941469e9803c5a036d8d6ff/2.0.0/en-US/3c1aab7b6c894267a4944f0145eb1307.html";
                    window.open(sUrl, "_blank");

                }, this]
            });
            oRenderer.addOptionsActionSheetButton(this._oHelpLink, oRenderer.LaunchpadState.App);
        }
    };

    /**
     * Cleans up the Component instance before destruction.
     * Removes the Help Button from the Launchpad ActionSheet.
     * @override
     */
    Component.prototype.exit = function () {
        if (sap.ushell && sap.ushell.renderers) {
            var oRendererExtensions = sap.ushell.renderers.fiori2.RendererExtensions;
            oRendererExtensions.removeOptionsActionSheetButton(this._oHelpLink, oRendererExtensions.LaunchpadState.App);
        }
    };

    return Component;
});
