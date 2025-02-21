/*!
 * ${copyright}
 */

sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
		"use strict";

		/**
		 * TimePickerSlider renderer.
		 * @namespace
		 */
		var TimePickerSliderRenderer = {
		};

		/**
		 * Renders the HTML for a {@link sap.m.TimePickerSlider}, using the provided {@link sap.ui.core.RenderManager}.
		 *
		 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer
		 * @param {sap.ui.core.Control} oControl An object representation of the control that should be rendered
		 */
		TimePickerSliderRenderer.render = function(oRm, oControl) {
			var iIndex,
				iRepetition,
				nContentRepetitions = oControl._getContentRepeat(),
				aItems = oControl.getItems(),
				sControlLabel = oControl.getLabel();

			oRm.write("<div");
			oRm.writeControlData(oControl);
			oRm.writeAttribute("tabindex", "0");

			oRm.addClass("sapMriTPColumn");
			if (oControl.getIsExpanded()) {
				oRm.addClass("sapMriTPSliderExpanded");
			}
			oRm.writeClasses();

			//WAI-ARIA region
			oRm.writeAccessibilityState(oControl, {
				role: "listbox",
				multiSelectable: false,
				live: "assertive",
				owns: oControl.getId() + "-content",
				labelledby: {
					value: oControl.getId() + "-label",
					append: true
				},
				describedby: {
					value: oControl.getId() + "-valDescription",
					append: true
				}
			});

			oRm.write(">");

			//Title label of the slider
			oRm.write("<div");
			oRm.writeAttribute("id", oControl.getId() + "-label");
			oRm.addClass("sapMriTimePickerLabel");
			oRm.writeClasses();
			oRm.write(">");
			oRm.writeEscaped(sControlLabel);
			oRm.write("</div>");

			oRm.write("<div");
			oRm.writeAttribute("id", oControl.getId() + "-valDescription");
			oRm.addClass("sapUiInvisibleText");
			oRm.writeClasses();
			oRm.write("></div>");

			oRm.write("<div class='sapMriTimePickerItemArrows'>");
			oRm.renderControl(oControl.getAggregation("_arrowUp"));
			oRm.write("</div>");

			oRm.write("<div");
			oRm.addClass("sapMriTimePickerSlider");
			oRm.writeAttribute("unselectable", "on");
			oRm.writeStyles();
			oRm.writeClasses();
			oRm.write(">");

			//render selection frame, same height - border height
			oRm.write("<div class=\"sapMriTPPickerSelectionFrame\"></div>");

			oRm.write("<ul");
			oRm.writeAttribute("id", oControl.getId() + "-content");
			oRm.writeAttribute("unselectable", "on");
			oRm.write(">");

			for (iRepetition = 1; iRepetition <= nContentRepetitions; iRepetition++) {
				for (iIndex = 0; iIndex < aItems.length; iIndex++) {
					//unselectable for IE9
					oRm.write("<li class=\"sapMriTimePickerItem\" unselectable=\"on\"");
					//WAI-ARIA region
					oRm.writeAccessibilityState(oControl, {
						role: "option",
						selected: false
					});
					oRm.write(">");
					oRm.writeEscaped(aItems[iIndex].getText());
					oRm.write("</li>");
				}
			}
			oRm.write("</ul>");

			oRm.write("</div>");

			//arrow down
			oRm.write("<div class='sapMriTimePickerItemArrows'>");
			oRm.renderControl(oControl.getAggregation("_arrowDown"));
			oRm.write("</div>");

			oRm.write("</div>");
		};

		return TimePickerSliderRenderer;
	}, /* bExport= */ false);
