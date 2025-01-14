/*!
 * ${copyright}
 */

sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control', './TimePickerSliderRenderer', 'sap/ui/core/IconPool'],
	function(jQuery, Control, TimePickerSliderRenderer, IconPool) {
		"use strict";

		/**
		 * Constructor for a new TimePickerSlider.
		 *
		 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
		 * @param {object} [mSettings] Initial settings for the new control
		 *
		 * @class
		 * TimePickerSlider is a picker list control used inside a {@link sap.m.TimePicker} to choose a value.
		 * @extends sap.ui.core.Control
		 *
		 * @author SAP SE
		 * @version ${version}
		 *
		 * @constructor
		 * @private
		 * @since 1.32
		 * @alias sap.m.TimePickerSlider
		 */
		var TimePickerSlider = Control.extend("sap.hc.mri.pa.ui.lib.datetimepicker.TimePickerSlider", /** @lends sap.m.TimePickerSlider.prototype */ {
			metadata: {
				properties: {
					/**
					 * The key of the currently selected value of the slider.
					 */
					selectedValue: {type: "string", defaultValue: null},
					/**
					 * Indicates whether the slider supports cyclic scrolling.
					 */
					isCyclic: {type: "boolean", defaultValue: true},
					/**
					 * Defines the descriptive text for the slider, placed as a label above it.
					 */
					label: {type: "string", defaultValue: null},
					/**
					 * Indicates whether the slider is currently expanded.
					 */
					isExpanded: {type: "boolean", defaultValue: false}
				},
				aggregations: {
					/**
					 * Aggregation that contains the items of the slider.
					 */
					items: {type: "sap.ui.core.Item", multiple: true, singularName: "item"},

					/**
					 * Aggregation that contains the up arrow.
					 */
					_arrowUp: {type: "sap.m.Button", multiple: false, visibility: "hidden" },

					/**
					 * Aggregation that contains the down arrow.
					 */
					_arrowDown: {type: "sap.m.Button", multiple: false, visibility: "hidden" }
				},
				events: {
					/**
					 * Fires when the slider is expanded.
					 */
					expanded: {}
				}
			},
			renderer: TimePickerSliderRenderer.render
		});

		var SCROLL_ANIMATION_DURATION = sap.ui.getCore().getConfiguration().getAnimation() ? 200 : 0;
		var MIN_ITEMS = 50;

		/**
		 * Initializes the control.
		 *
		 * @public
		 */
		TimePickerSlider.prototype.init = function() {
			this._bIsDrag = null;
			this._selectionOffset = 0;
			this._mousedown = false;
			this._dragSession = null;
			this._iSelectedItemIndex = -1;
			this._animatingSnap = false;
			this._iSelectedIndex = -1;
			this._contentRepeat = null;
			this._animating = false;
			this._intervalId = null;
			this._maxScrollTop = null;
			this._minScrollTop = null;
			this._marginTop = null;
			this._marginBottom = null;
			this._bOneTimeValueSelectionAnimation = false;

			if (sap.ui.Device.system.desktop) {
				this._fnHandleTypeValues = fnTimedKeydownHelper.call(this);
			}

			this._initArrows();
		};

		/**
		 * Called after the control is rendered.
		 */
		TimePickerSlider.prototype.onAfterRendering = function () {
			if (sap.ui.Device.system.phone) { //the layout still 'moves' at this point - dialog and its content, so wait a little
				jQuery.sap.delayedCall(0, this, this._afterExpandCollapse);
			} else {
				this._afterExpandCollapse();
			}
			this._attachEvents();
		};

		/**
		 * Handles the themeChanged event.
		 *
		 * Does a re-rendering of the control.
		 * @param {jQuery.Event} oEvent Event object
		 */
		TimePickerSlider.prototype.onThemeChanged = function(oEvent) {
			this.invalidate();
		};

		/**
		 * Handles the tap event.
		 *
		 * Expands or selects the taped element.
		 * @param {jQuery.Event} oEvent Event object
		 */
		TimePickerSlider.prototype.fireTap = function(oEvent) {
			var oScrElement,
				sItemText,
				sItemKey;

			//expand column with a click
			if (!this.getIsExpanded()) {
				if (sap.ui.Device.system.desktop) {
					this.focus();
				} else {
					this.setIsExpanded(true);
				}
			} else { //or select an element from the list
				oScrElement = oEvent.srcElement || oEvent.originalTarget;

				if (oScrElement.tagName.toLowerCase() === "li") {
					sItemText = jQuery(oScrElement).text();
					sItemKey  = fnFindKeyByText.call(this, sItemText);

					this._bOneTimeValueSelectionAnimation = true;
					this.setSelectedValue(sItemKey);
				} else { //if no selection is happening, return the selected style which was removed ontouchstart
					this._addSelectionStyle();
				}
			}
		};

		/**
		 * Sets the currently selected value with an item key.
		 *
		 * @override
		 * @param {string} sValue The key of the new selected value
		 * @returns {sap.ui.base.ManagedObject}
		 * @public
		 */
		TimePickerSlider.prototype.setSelectedValue = function(sValue) {
			var iIndexOfValue = findIndexInArray(this.getItems(), function(oElement) {
					return oElement.getKey() === sValue;
				}),
				that = this,
				iIndex,
				$Slider,
				iItemHeightInPx,
				iContentRepeats;

			if (iIndexOfValue === -1) {
				return this;
			}

			//scroll
			if (this.getDomRef()) {
				$Slider = this._getSliderContainerDomRef();
				iItemHeightInPx = this._getItemHeightInPx();
				iContentRepeats = this._getContentRepeat();

				//list items' values are repeated, so find the one nearest to the middle of the list
				if (iIndexOfValue * iItemHeightInPx >= this._selectionOffset) {
					iIndex = this.getItems().length * Math.floor(iContentRepeats / 2) + iIndexOfValue;
				} else {
					iIndex = this.getItems().length * Math.ceil(iContentRepeats / 2) + iIndexOfValue;
				}

				if (this._bOneTimeValueSelectionAnimation) {
					this._animatingSnap = true;
					$Slider.animate({scrollTop: iIndex * iItemHeightInPx - this._selectionOffset}, SCROLL_ANIMATION_DURATION, 'linear', function () {
						$Slider.clearQueue();
						that._animatingSnap = false;
						that._bOneTimeValueSelectionAnimation = false;
					});
				} else {
					$Slider.scrollTop(iIndex * iItemHeightInPx - this._selectionOffset);
				}

				this._removeSelectionStyle();
				this._iSelectedItemIndex = iIndex; //because we repeated content / values

				this._addSelectionStyle();
			}

			return this.setProperty("selectedValue", sValue, true); // no rerendering
		};

		/**
		 * Sets the <code>isExpanded</code> property of the slider.
		 *
		 * @override
		 * @param {boolean} bValue True or false
		 * @param {boolean} suppressEvent Whether to suppress event firing
		 * @returns {sap.m.TimePickerSlider} this instance, used for chaining
		 * @public
		 */
		TimePickerSlider.prototype.setIsExpanded = function(bValue, suppressEvent) {
			this.setProperty("isExpanded", bValue, true);

			if (!this.getDomRef()) {
				return this;
			}

			var $This = this.$();

			if (bValue) {
				$This.addClass("sapMriTPSliderExpanded");

				if (sap.ui.Device.system.phone) {
					jQuery.sap.delayedCall(0, this, function() {
						this._updateSelectionFrameLayout();
						if (!suppressEvent) {
							this.fireExpanded({ctrl: this});
						}
					});
				} else {
					this._updateSelectionFrameLayout();
					if (!suppressEvent) {
						this.fireExpanded({ctrl: this});
					}
				}
			} else {
				this._stopAnimation();
				//stop snap animation also
				if (this._animatingSnap === true) {
					this._animatingSnap = false;
					this._getSliderContainerDomRef().stop(true);
					//be careful not to invoke this method twice (the first time is on animate finish callback)
					this._scrollerSnapped(this._iSelectedIndex);
				}

				$This.removeClass("sapMriTPSliderExpanded");

				if (sap.ui.Device.system.phone) {
					jQuery.sap.delayedCall(0, this, this._afterExpandCollapse);
				} else {
					this._afterExpandCollapse();
				}
			}


			return this;
		};

		/**
		 * Handles the focusin event.
		 *
		 * Expands the focused slider.
		 * @param {jQuery.Event} oEvent Event object
		 */
		TimePickerSlider.prototype.onfocusin = function(oEvent) {
			if (sap.ui.Device.system.desktop && !this.getIsExpanded()) {
				this.setIsExpanded(true);
			}
		};

		/**
		 * Handles the focusout event.
		 *
		 * Make sure the blurred slider is collapsed on desktop.
		 * @param {jQuery.Event} oEvent Event object
		 */
		TimePickerSlider.prototype.onfocusout = function(oEvent) {

			var sFocusedElementId = oEvent.relatedTarget ? oEvent.relatedTarget.id : null,
				aArrowsIds = [this.getAggregation("_arrowUp").getId(), this.getAggregation("_arrowDown").getId()];

			// Do not close, if any of the arrows is clicked
			if (sFocusedElementId && aArrowsIds.indexOf(sFocusedElementId) !== -1) {
				return;
			}


			if (sap.ui.Device.system.desktop && this.getIsExpanded()) {
				this.setIsExpanded(false);
			}
		};

		TimePickerSlider.prototype._onmousewheel = function(oEvent) {
			// prevent the default behavior
			oEvent.preventDefault();
			oEvent.stopPropagation();

			if (!this.getIsExpanded()) {
				return false;
			}

			var oOriginalEvent = oEvent.originalEvent,
					bDirectionPositive = oOriginalEvent.detail ? (-oOriginalEvent.detail > 0) : (oOriginalEvent.wheelDelta > 0),
					fnRound = bDirectionPositive ? Math.ceil : Math.floor,
					wheelData = oOriginalEvent.detail ? (-oOriginalEvent.detail / 3) : (oOriginalEvent.wheelDelta / 120),
					that = this,
					iResultOffset;

			if (!wheelData) {
				return false;
			}

			if (!this._aWheelDeltas) {
				this._aWheelDeltas = [];
			}

			that._aWheelDeltas.push(wheelData);

			if (!this._bWheelScrolling) {
				this._bWheelScrolling = true;

				this._intervalId = setInterval(function () {
					if (!that._aWheelDeltas.length) {
						clearInterval(that._intervalId);
						that._bWheelScrolling = false;
					} else {
						iResultOffset = that._aWheelDeltas[0]; //simplification, we could still use the array in some cases
						that._aWheelDeltas = [];

						iResultOffset = fnRound(iResultOffset);
						if (iResultOffset) { // !== 0, actually move
							that._offsetSlider(iResultOffset);
						}
					}
				}, 150);
			}

			return false;
		};

		/**
		 * Handles the pageup event.
		 *
		 * Selects the first item value.
		 * @param {jQuery.Event} oEvent Event object
		 */
		TimePickerSlider.prototype.onsappageup = function(oEvent) {
			if (this.getIsExpanded()) {
				var iFirstItem = this.getItems()[0];
				this.setSelectedValue(iFirstItem.getKey());
			}
		};

		/**
		 * Handles the pagedown event.
		 *
		 * Selects the last item value.
		 * @param {jQuery.Event} oEvent Event object
		 */
		TimePickerSlider.prototype.onsappagedown = function(oEvent) {
			if (this.getIsExpanded()) {
				var iLastItem = this.getItems()[this.getItems().length - 1];
				this.setSelectedValue(iLastItem.getKey());
			}
		};

		/**
		 * Handles the arrowup event.
		 *
		 * Selects the previous item value.
		 * @param {jQuery.Event} oEvent Event object
		 */
		TimePickerSlider.prototype.onsapup = function(oEvent) {
			if (this.getIsExpanded()) {
				this._offsetValue(-1);
			}
		};

		/**
		 * Handles the arrowdown event.
		 *
		 * Selects the next item value.
		 * @param {jQuery.Event} oEvent Event object
		 */
		TimePickerSlider.prototype.onsapdown = function(oEvent) {
			if (this.getIsExpanded()) {
				this._offsetValue(1);
			}
		};

		/**
		 * Handles the keydown event.
		 *
		 * @param {jQuery.Event} oEvent Event object
		 */
		TimePickerSlider.prototype.onkeydown = function(oEvent) {
			var iKC = oEvent.which || oEvent.keyCode,
				oKCs = jQuery.sap.KeyCodes;

			//we only recieve uppercase codes here, which is nice
			if ((iKC >= oKCs.A && iKC <= oKCs.Z)
				|| (iKC >= oKCs.DIGIT_0 && iKC <= oKCs.DIGIT_9)) {
				this._fnHandleTypeValues(oEvent.timeStamp, iKC);
			}
		};

		/**
		 * Finds the slider's container in the DOM.
		 *
		 * @returns {object} Slider container's jQuery object
		 * @private
		 */
		TimePickerSlider.prototype._getSliderContainerDomRef = function() {
			return this.$().find(".sapMriTimePickerSlider");
		};

		/**
		 * Calculates how many times the slider content should be repeated so that it fills the space.
		 *
		 * The method is called only when isCyclic property is set to true.
		 * @returns {number} Content repetitions needed
		 * @private
		 */
		TimePickerSlider.prototype._getContentRepeat = function() {
			//how many times the content is repeated?
			//we target to get at least MIN_ITEMS items in the list,
			//so repeat the content as many times as it is needed to get that number
			//but repeat the content at least 3 times to ensure cyclic visibility
			if (!this._contentRepeat) {
				if (this.getIsCyclic()) {
					this._contentRepeat = Math.ceil(MIN_ITEMS / this.getItems().length);
					this._contentRepeat = Math.max(this._contentRepeat, 3);
				} else {
					this._contentRepeat = 1;
				}
			}

			return this._contentRepeat;
		};

		/**
		 * Gets the CSS height of a list item.
		 *
		 * @returns {number} CSS height in pixels
		 * @private
		 */
		TimePickerSlider.prototype._getItemHeightInPx = function() {
			return this.$("content").find("li").outerHeight();
		};

		/**
		 * Calculates the center of the column and places the border frame.
		 * @private
		 */
		TimePickerSlider.prototype._updateSelectionFrameLayout = function() {
			var $Frame,
				iFrameTopPosition,
				topPadding,
				iSliderOffsetTop;

			if (this.getDomRef()) {
				$Frame = this.$().find(".sapMriTPPickerSelectionFrame");

				//the frame is absolutly positioned in the middle of its container
				//its height is the same as the list items' height
				//so the top of the middle === container.height/2 - item.height/2
				//corrected with the top of the container
				if (sap.ui.Device.system.phone) {
					iSliderOffsetTop = this.$().offset().top;
					iFrameTopPosition = (this.$().height() - this._getItemHeightInPx()) / 2 + iSliderOffsetTop;
				} else {
					topPadding = this.$().parents(".sapUiSizeCompact").length > 0 ? 8 : 16; //depends if we are in compact mode
					iFrameTopPosition = (this.$().height() - this._getItemHeightInPx()) / 2 + topPadding;
				}

				$Frame.css("top", iFrameTopPosition);

				if (sap.ui.Device.system.phone) {
					jQuery.sap.delayedCall(0, this, this._afterExpandCollapse);
				} else {
					this._afterExpandCollapse();
				}
			}
		};

		/**
		 * Calculates the top offset of the border frame relative to its container.
		 * @private
		 * @returns {number} Top offset of the border frame
		 */
		TimePickerSlider.prototype._getSelectionFrameTopOffset = function() {
			var $Frame = this._getSliderContainerDomRef().find(".sapMriTPPickerSelectionFrame"),
				oFrameOffset = $Frame.offset();
			return oFrameOffset.top;
		};

		/**
		 * Animates slider scrolling.
		 *
		 * @private
		 * @param iSpeed {number} Animating speed
		 */
		TimePickerSlider.prototype._animateScroll = function(iSpeed) {
			var $Container = this._getSliderContainerDomRef(),
				iPreviousScrollTop = $Container.scrollTop(),
				frameFrequencyMs = 25, //milliseconds - 40 frames per second; 1000ms / 40frames === 25
				$ContainerHeight = $Container.height(),
				$ContentHeight = this.$("content").height(),
				//increase the distance that the slider can be dragged before reaching one end of the list
				//because we do not do updates of list offset while dragging,
				//we have to keep that distance long at least while animating
				iDragMarginBuffer = 200,
				iDragMargin = $ContainerHeight + iDragMarginBuffer,
				iContentRepeat = this._getContentRepeat(),
				bCycle = this.getIsCyclic(),
				fDecelerationCoefficient = 0.9,
				fStopSpeed = 0.05,
				that = this;

			this._intervalId = setInterval(function() {
				that._animating = true;
				//calculate the new scroll offset by subtracting the distance
				iPreviousScrollTop = iPreviousScrollTop - iSpeed * frameFrequencyMs;
				if (bCycle) {
					iPreviousScrollTop = that._getUpdatedCycleScrollTop($ContainerHeight, $ContentHeight, iPreviousScrollTop, iDragMargin, iContentRepeat);
				} else {
					if (iPreviousScrollTop > that._maxScrollTop) {
						iPreviousScrollTop = that._maxScrollTop;
						iSpeed = 0;
					}

					if (iPreviousScrollTop < that._minScrollTop) {
						iPreviousScrollTop = that._minScrollTop;
						iSpeed = 0;
					}
				}
				$Container.scrollTop(iPreviousScrollTop);

				iSpeed *= fDecelerationCoefficient;
				if (Math.abs(iSpeed) < fStopSpeed) {  // px/milliseconds
					//snapping
					var iItemHeight = that._getItemHeightInPx();
					var iOffset = that._selectionOffset ? (that._selectionOffset % iItemHeight) : 0;
					var iSnapScrollTop = Math.round((iPreviousScrollTop  + iOffset) / iItemHeight) * iItemHeight - iOffset;

					clearInterval(that._intervalId);
					that._animating = null; //not animating
					that._iSelectedIndex = Math.round((iPreviousScrollTop  + that._selectionOffset) / iItemHeight);

					that._animatingSnap = true;
					$Container.animate({ scrollTop: iSnapScrollTop}, SCROLL_ANIMATION_DURATION, 'linear', function() {
						$Container.clearQueue();
						that._animatingSnap = false;
						that._scrollerSnapped(that._iSelectedIndex);
					});
				}
			}, frameFrequencyMs);
		};

		/**
		 * Stops the scrolling animation.
		 *
		 * @private
		 */
		TimePickerSlider.prototype._stopAnimation = function() {
			if (this._animating) {
				clearInterval(this._intervalId);
				this._animating = null;
			}
		};

		/**
		 * Starts scroll session.
		 *
		 * @param {number} iPageY The starting y-coordinate of the target
		 * @private
		 */
		TimePickerSlider.prototype._startDrag = function(iPageY) {
			//start collecting touch coordinates
			if (!this._dragSession) {
				this._dragSession = {};
				this._dragSession.positions = [];
			}

			this._dragSession.pageY = iPageY;
			this._dragSession.startTop = this._getSliderContainerDomRef().scrollTop();
		};

		/**
		 * Performs vertical scroll.
		 *
		 * @param {number} iPageY The current y-coordinate of the target to scroll to
		 * @param {date} dTimeStamp Timestamp of the event
		 * @private
		 */
		TimePickerSlider.prototype._doDrag = function(iPageY, dTimeStamp) {
			if (this._dragSession) {
				//calculate the distance between the start of the drag and the current touch
				this._dragSession.offsetY = iPageY - this._dragSession.pageY;

				this._dragSession.positions.push({pageY: iPageY, timeStamp: dTimeStamp});
				//to calculate speed we only need the last touch positions
				if (this._dragSession.positions.length > 20) {
					this._dragSession.positions.splice(0, 10);
				}

				if (this._bIsDrag) {
					//while dragging update the list position inside its container
					this._getSliderContainerDomRef().scrollTop(this._dragSession.startTop - this._dragSession.offsetY);
				}
			}
		};

		/**
		 * Finishes scroll session.
		 *
		 * @param {number} iPageY The last y-coordinate of the target to scroll to
		 * @param {date} dTimeStamp Timestamp of the event
		 * @private
		 */
		TimePickerSlider.prototype._endDrag = function(iPageY, dTimeStamp) {
			if (this._dragSession) {
				var iOffsetTime, iOffsetY;
				//get only the offset calculated including the touches in the last 100ms
				for (var i = this._dragSession.positions.length - 1; i >= 0; i--) {
					iOffsetTime = dTimeStamp - this._dragSession.positions[i].timeStamp;
					iOffsetY = iPageY - this._dragSession.positions[i].pageY;
					if (iOffsetTime > 100) {
						break;
					}
				}

				var fSpeed = (iOffsetY / iOffsetTime);   // px/ms

				if (this._animating) {
					clearInterval(this._intervalId);
					this._intervalId = null;
					this._animating = null;
				}

				this._dragSession = null;
				this._animateScroll(fSpeed);
			}
		};

		/**
		 * Calculates the slider's selection y-offset and margins and selects the corresponding list value.
		 *
		 * @private
		 */
		TimePickerSlider.prototype._afterExpandCollapse = function () {
			var sSelectedValue = this.getSelectedValue(),
				oSelectionFrameTopOffset = this._getSelectionFrameTopOffset(),
				$Slider = this._getSliderContainerDomRef(),
				oSliderOffset = $Slider.offset(),
				iSliderHeight,
				$List,
				iListContainerHeight,
				iItemHeightInPx;

			//calculate the offset from the top of the list container to the selection frame
			this._selectionOffset =  oSelectionFrameTopOffset - oSliderOffset.top;

			if (!this.getIsCyclic()) {
				$List = jQuery("#" + this.getId() + "-content");
				iItemHeightInPx = this._getItemHeightInPx();
				iListContainerHeight = this.$().height();

				//if we do not cycle the items, we fill the remaining space with margins
				if (this.getIsExpanded()) {
					this._minScrollTop = 0;
					//top margin is as wide as the selection offset
					this._marginTop = oSelectionFrameTopOffset - oSliderOffset.top;
					this._maxScrollTop = iItemHeightInPx * (this.getItems().length - 1);
					iSliderHeight = $Slider.height();
					//bottom margin allows the bottom of the last item when scrolled down
					//to be aligned with the selection frame - one item offset
					this._marginBottom = iSliderHeight - this._marginTop - iItemHeightInPx;
					if (this._marginBottom < 0) { //android native
						this._marginBottom = iListContainerHeight - this._marginTop - iItemHeightInPx;
					}

					//update top,bottom margins
					$List.css("margin-top", this._marginTop);
					//bottom margin leaves
					$List.css("margin-bottom", this._marginBottom);
				} else {
					this._marginBottom = iListContainerHeight - iItemHeightInPx;
					$List.css("margin-top", 0);
					$List.css("margin-bottom", this._marginBottom);
					//increase the bottom margin so the list can scroll to its last value
				}

				this._selectionOffset = 0;
			}

			if (!this.getIsExpanded()) {
				this._selectionOffset = 0;
			}

			this.setSelectedValue(sSelectedValue);
		};

		/**
		 * Handles the cycle effect of the slider's list items.
		 *
		 * @param iContainerHeight {number} Height of the slider container
		 * @param iContentHeight {number} Height of the slider content
		 * @param iTop {number} Current top position
		 * @param fDragMargin {number} Remaining scroll limit
		 * @param iContentRepeatNumber {number} Content repetition counter
		 * @returns {number} Newly calculated top position
		 * @private
		 */
		TimePickerSlider.prototype._getUpdatedCycleScrollTop = function(iContainerHeight, iContentHeight, iTop, fDragMargin, iContentRepeatNumber) {
			var fContentHeight = iContentHeight - iTop - iContainerHeight;

			while (fContentHeight < fDragMargin) {
				iTop = iTop - iContentHeight / iContentRepeatNumber;
				fContentHeight = iContentHeight - iTop - iContainerHeight;
			}

			//they are not exclusive, we depend on a content long enough
			while (iTop < fDragMargin) {
				iTop = iTop + iContentHeight / iContentRepeatNumber;
			}

			return iTop;
		};

		/**
		 * Calculates the index of the snapped element and selects it.
		 *
		 * @param iCurrentItem {number} Index of the selected item
		 * @private
		 */
		TimePickerSlider.prototype._scrollerSnapped = function(iCurrentItem) {
			var iSelectedItemIndex = iCurrentItem,
				iItemsCount = this.getItems().length,
				sNewValue;

			while (iSelectedItemIndex >= iItemsCount) {
				iSelectedItemIndex = iSelectedItemIndex - iItemsCount;
			}

			if (!this.getIsCyclic()) {
				iSelectedItemIndex = iCurrentItem;
			}

			sNewValue = this.getItems()[iSelectedItemIndex].getKey();

			this.setSelectedValue(sNewValue);
		};

		/**
		 * Updates the scrolltop value to be on the center of the slider.
		 *
		 * @private
		 */
		TimePickerSlider.prototype._updateScroll = function() {
			var sSelectedValue = this.getSelectedValue();
			if (sSelectedValue !== this.getItems()[0].getKey()
				&& this._getSliderContainerDomRef().scrollTop() + (this._selectionOffset ? this._selectionOffset : 0) === 0) {
				this.setSelectedValue(sSelectedValue);
			}
		};

		/**
		 * Adds CSS class to the selected slider item.
		 *
		 * @private
		 */
		TimePickerSlider.prototype._addSelectionStyle = function() {
			var $aItems = this.$("content").find("li"),
				sSelectedItemText = $aItems.eq(this._iSelectedItemIndex).text(),
				sAriaLabel = fnFindKeyByText.call(this, sSelectedItemText);

			$aItems.eq(this._iSelectedItemIndex).addClass("sapMriTimePickerItemSelected").attr("aria-selected", "true");
			//WAI-ARIA region
			document.getElementById(this.getId() + "-valDescription").setAttribute("aria-label", sAriaLabel);
		};

		/**
		 * Removes CSS class to the selected slider item.
		 *
		 * @private
		 */
		TimePickerSlider.prototype._removeSelectionStyle = function() {
			var $aItems = this.$("content").find("li");
			$aItems.eq(this._iSelectedItemIndex).removeClass("sapMriTimePickerItemSelected").attr("aria-selected", "false");
		};

		/**
		 * Attaches all needed events to the slider.
		 *
		 * @private
		 */
		TimePickerSlider.prototype._attachEvents = function () {
			var oElement = this._getSliderContainerDomRef()[0],
				oDevice = sap.ui.Device;

			if (oDevice.support.touch) {
				//Attach touch events
				oElement.addEventListener("touchstart", jQuery.proxy(onTouchStart, this), false);
				oElement.addEventListener("touchmove", jQuery.proxy(onTouchMove, this), false);
				document.addEventListener("touchend", jQuery.proxy(onTouchEnd, this), false);
			} else {
				//Attach mouse events
				oElement.addEventListener("mousedown", jQuery.proxy(onTouchStart, this), false);
				document.addEventListener("mousemove", jQuery.proxy(onTouchMove, this), false);
				document.addEventListener("mouseup", jQuery.proxy(onTouchEnd, this), false);
			}
		};

		/**
		 * Detaches all attached events to the slider.
		 *
		 * @private
		 */
		TimePickerSlider.prototype._detachEvents = function () {
			var oElement = this.getDomRef(),
				oDevice = sap.ui.Device;

			if (oDevice.support.touch) {
				//Detach touch events
				oElement.removeEventListener("touchstart", jQuery.proxy(onTouchStart, this), false);
				oElement.removeEventListener("touchmove", jQuery.proxy(onTouchMove, this), false);
				document.removeEventListener("touchend", jQuery.proxy(onTouchEnd, this), false);
			} else {
				//Detach mouse events
				oElement.removeEventListener("mousedown", jQuery.proxy(onTouchStart, this), false);
				oElement.removeEventListener("mousemove", jQuery.proxy(onTouchMove, this), false);
				document.removeEventListener("mouseup", jQuery.proxy(onTouchEnd, this), false);
			}
		};

		/**
		 * Helper function which enables selecting a slider item with an index offset.
		 *
		 * @param iIndexOffset {number} The index offset to be scrolled to
		 * @private
		 */
		TimePickerSlider.prototype._offsetValue = function(iIndexOffset) {
			var $Slider = this._getSliderContainerDomRef(),
				iScrollTop = $Slider.scrollTop(),
				iItemHeight = this._getItemHeightInPx(),
				iSnapScrollTop = iScrollTop + iIndexOffset * iItemHeight,
				bCycle = this.getIsCyclic(),
				oThat = this,
				iSelIndex = this._iSelectedItemIndex + iIndexOffset;

			if (!bCycle) {
				if (iSelIndex < 0 || iSelIndex >= this.getItems().length) {
					return;
				}

				if (iSnapScrollTop > this._maxScrollTop) {
					iSnapScrollTop = this._maxScrollTop;
				}

				if (iSnapScrollTop < this._minScrollTop) {
					iSnapScrollTop = this._minScrollTop;
				}
			}

			this._animatingSnap = true;
			$Slider.animate({ scrollTop: iSnapScrollTop}, SCROLL_ANIMATION_DURATION, 'linear', function() {
				$Slider.clearQueue();
				oThat._animatingSnap = false;
				oThat._scrollerSnapped(iSelIndex);
			});
		};

		/**
		 * Repositions the slider to match the current item plus or minus the given integer offset.
		 *
		 * @param {number} iOffsetNumberOfItems The number of items to be added or removed to the current item's index
		 * @private
		 */
		TimePickerSlider.prototype._offsetSlider = function(iOffsetNumberOfItems) {
			var iScrollTop = this._getSliderContainerDomRef().scrollTop(),
				that = this,
				$ContainerHeight = that._getSliderContainerDomRef().height(),
				$ContentHeight = that.$("content").height(),
				iDragMarginBuffer = 200,
				iDragMargin = $ContainerHeight + iDragMarginBuffer,
				iContentRepeat = that._getContentRepeat(),
				bCycle = that.getIsCyclic(),
				iItemHeight = that._getItemHeightInPx();

				//calculate the new scroll offset by subtracting the distance
				iScrollTop = iScrollTop - iOffsetNumberOfItems * iItemHeight;
				if (bCycle) {
					iScrollTop = that._getUpdatedCycleScrollTop($ContainerHeight, $ContentHeight, iScrollTop, iDragMargin, iContentRepeat);
				} else {
					if (iScrollTop > that._maxScrollTop) {
						iScrollTop = that._maxScrollTop;
					}

					if (iScrollTop < that._minScrollTop) {
						iScrollTop = that._minScrollTop;
					}
				}

				that._getSliderContainerDomRef().scrollTop(iScrollTop);
				that._iSelectedIndex = Math.round((iScrollTop + that._selectionOffset) / iItemHeight);
				that._scrollerSnapped(that._iSelectedIndex);
		};

		TimePickerSlider.prototype._initArrows = function() {
			var that = this, oArrowUp, oArrowDown;

			oArrowUp = new sap.m.Button({
				icon: IconPool.getIconURI("slim-arrow-up"),
				press: function (oEvent) {
					that._offsetValue(-1);
				},
				type: 'Transparent'
			});
			oArrowUp.addEventDelegate({
				onAfterRendering: function () {
					oArrowUp.$().attr("tabindex", -1);
				}
			});

			this.setAggregation("_arrowUp", oArrowUp);

			oArrowDown = new sap.m.Button({
				icon: IconPool.getIconURI("slim-arrow-down"),
				press: function (oEvent) {
					that._offsetValue(1);
				},
				type: 'Transparent'
			});

			oArrowDown.addStyleClass("sapMriTimePickerItemArrowDown");
			oArrowDown.addEventDelegate({
				onAfterRendering: function () {
					oArrowDown.$().attr("tabindex", -1);
				}
			});

			this.setAggregation("_arrowDown", oArrowDown);
		};

		/**
		 * Finds the index of an element, satisfying provided predicate.
		 *
		 * @param {array} aArray The array to be predicted
		 * @param {function} fnPredicate Testing function
		 * @returns {number} The index in the array, if an element in the array satisfies the provided testing function
		 * @private
		 */
		function findIndexInArray(aArray, fnPredicate) {
			if (aArray == null) {
				throw new TypeError('findIndex called with null or undefined array');
			}
			if (typeof fnPredicate !== 'function') {
				throw new TypeError('predicate must be a function');
			}

			var iLength = aArray.length;
			var fnThisArg = arguments[1];
			var vValue;

			for (var iIndex = 0; iIndex < iLength; iIndex++) {
				vValue = aArray[iIndex];
				if (fnPredicate.call(fnThisArg, vValue, iIndex, aArray)) {
					return iIndex;
				}
			}
			return -1;
		}

		/**
		 * Default onTouchStart handler.
		 * @param oEvent {jQuery.Event} Event object
		 */
		var onTouchStart = function (oEvent) {
			var iPageY = oEvent.touches && oEvent.touches.length ? oEvent.touches[0].pageY : oEvent.pageY;
			this._bIsDrag = false;

			if (!this.getIsExpanded()) {
				return;
			}

			this._stopAnimation();
			this._startDrag(iPageY);

			oEvent.preventDefault();
			this._mousedown = true;
		};

		/**
		 * Default onTouchMove handler.
		 * @param oEvent {jQuery.Event} Event object
		 */
		var onTouchMove = function (oEvent) {
			var iPageY = oEvent.touches && oEvent.touches.length ? oEvent.touches[0].pageY : oEvent.pageY;

			if (!this._mousedown || !this.getIsExpanded()) {
				return;
			}

			//galaxy s5 android 5.0 fires touchmove every time - so see if it's far enough to call it a drag
			if (!this._bIsDrag && this._dragSession && this._dragSession.positions.length) {
				//there is a touch at least 5px away vertically from the initial touch
				var bFarEnough = this._dragSession.positions.some(function(pos) {
					return Math.abs(pos.pageY - iPageY) > 5;
				});

				if (bFarEnough) {
					this._bIsDrag = true;
				}
			}

			this._doDrag(iPageY, oEvent.timeStamp);

			this._mousedown = true;
		};

		/**
		 * Default onTouchEnd handler.
		 * @param oEvent {jQuery.Event} Event object
		 */
		var onTouchEnd = function (oEvent) {
			var iPageY = oEvent.changedTouches && oEvent.changedTouches.length ? oEvent.changedTouches[0].pageY : oEvent.pageY;

			if (this._bIsDrag === false) {
				this.fireTap(oEvent);
				this._dragSession = null;
			}

			this._bIsDrag = true;

			if (!this.getIsExpanded()) {
				this._dragSession = null;
				return;
			}

			this._endDrag(iPageY, oEvent.timeStamp);

			this._mousedown = false;
		};

		var fnFindKeyByText = function(sText) {
			var aItems = this.getItems();

			var index = findIndexInArray(aItems, function(el) {
				return el.getText() === sText;
			});

			return aItems[index].getKey();
		};

		/*
		 * Returns a function that remembers consecutive keydown events and adjust the slider values
		 * if they together match an item key.
		 */
		var fnTimedKeydownHelper = function() {
			var iLastTimeStamp = -1,
				iLastTimeoutId = -1,
				iWaitTimeout = 1000,
				sCurrentKeyPrefix = "",
				fnTimedKeydown = function(iTimeStamp, iKeyCode) {
					var aMatchingItems;
					//the previous call was more than a second ago or this is the first call
					if (iLastTimeStamp + iWaitTimeout < iTimeStamp) {
						sCurrentKeyPrefix = "";
					} else {
						if (iLastTimeoutId !== -1) {
							jQuery.sap.clearDelayedCall(iLastTimeoutId);
							iLastTimeoutId = -1;
						}
					}

					sCurrentKeyPrefix += String.fromCharCode(iKeyCode).toLowerCase();

					aMatchingItems = this.getItems().filter(function(item) {
						return item.getKey().indexOf(sCurrentKeyPrefix) === 0; //starts with the current prefix
					});

					if (aMatchingItems.length > 1) {
						iLastTimeoutId = jQuery.sap.delayedCall(iWaitTimeout, this, function() {
							this.setSelectedValue(sCurrentKeyPrefix);
							sCurrentKeyPrefix = "";
							iLastTimeoutId = -1;
						});
					} else if (aMatchingItems.length === 1) {
						this.setSelectedValue(aMatchingItems[0].getKey());
						sCurrentKeyPrefix = "";
					} // else - 0: do nothing, user just waits 1 second and the sCurrentKeyPrefix gets a reset next call

					iLastTimeStamp = iTimeStamp;
				};

			return fnTimedKeydown;
		};

		return TimePickerSlider;

	}, /* bExport= */ false);
