sap.ui.define([        
], function () {
    "use strict";
// Declaration of the module. Will ensure that the containing namespace 'hc.hph.config.assignment.ui.lib' exists.
	var TextUtils = sap.ui.base.Object.extend("hc.hph.config.assignment.ui.lib.TextUtils");
	
	TextUtils.setResourceBundle = function (oResourceBundle) {
		hc.hph.config.assignment.ui.lib.TextUtils._oResourceBundle = oResourceBundle;
	};

	TextUtils.getText = function(sKey, aValues) {	
		if (sKey == "")
			return "";
	
		if (!hc.hph.config.assignment.ui.lib.TextUtils._oResourceBundle) {
			throw new Error("ResourceBundle has to be initialized before getText is called");
		}
		return hc.hph.config.assignment.ui.lib.TextUtils._oResourceBundle.getText(sKey, aValues);
	};
	
	return TextUtils;
});