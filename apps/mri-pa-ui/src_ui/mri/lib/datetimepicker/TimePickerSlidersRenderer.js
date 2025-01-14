/*!
 * ${copyright}
 */

sap.ui.define(['jquery.sap.global'], function(jQuery) {
	"use strict";

	/**
	 * TimePickerSlidersRenderer renderer.
	 * @namespace
	 */
	var TimePickerSlidersRenderer = {};

	/**
	 * Renders the HTML for the given {@link sap.m.TimePickerSliders} control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager The RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl An object representation of the control that should be rendered
	 */
	TimePickerSlidersRenderer.render = function(oRenderManager, oControl) {
		var aSliders = oControl.getAggregation("_columns"),
			sLabelText = oControl.getLabelText() || "",
			oRb = sap.ui.getCore().getLibraryResourceBundle("sap.m"),
			iSliderIndex,
			bRtl = sap.ui.getCore().getConfiguration().getRTL();

		oRenderManager.write("<div onselectstart=\"return false;\"");
		oRenderManager.writeControlData(oControl);
		oRenderManager.addClass("sapMriTimePickerContainer");
		oRenderManager.writeClasses();

		//WAI-ARIA region
		oRenderManager.writeAccessibilityState(oControl, {
			label: (sLabelText + " " + oRb.getText("TIMEPICKER_SCREENREADER_TAG")).trim()
		});

		oRenderManager.write(">");

		if (!sap.ui.Device.system.desktop) {
			oRenderManager.write("<div id=\"" + oControl.getId() + "-label" + "\"");
			oRenderManager.addClass("sapMriTimePickerContainerLabel");
			oRenderManager.writeClasses();
			oRenderManager.write(">");
			oRenderManager.addStyle("display", "block");
			oRenderManager.writeEscaped(sLabelText);
			oRenderManager.write("</div>");
		}

		if (bRtl) {
			for (iSliderIndex = aSliders.length - 1; iSliderIndex >= 0; iSliderIndex--) {
				oRenderManager.renderControl(aSliders[iSliderIndex]);
			}
		} else {
			for (iSliderIndex = 0; iSliderIndex < aSliders.length; iSliderIndex++) {
				oRenderManager.renderControl(aSliders[iSliderIndex]);
			}
		}

		oRenderManager.write("</div>");
	};


	return TimePickerSlidersRenderer;

}, /* bExport= */ false);
