sap.ui.define([        
], function () {
    "use strict";
// Declaration of the module. Will ensure that the containing namespace 'hc.hph.config.assignment.ui.lib' exists.
	var Formatter = sap.ui.base.Object.extend("hc.hph.config.assignment.ui.lib.Formatter");
	
	
	Formatter.isSet = function(value) {
		return typeof(value) !== "undefined" && value !== "";
	};
	
	Formatter.areAllSet = function() {
		var valid = true;
		$.each(arguments, function(ind, obj){
			valid = valid && hc.hph.config.assignment.ui.lib.Formatter.isSet(obj);
		});
		return valid;
	};
	
	return Formatter;
});
