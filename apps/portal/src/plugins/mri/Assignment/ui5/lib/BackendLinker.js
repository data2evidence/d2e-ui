sap.ui.define([
    "jquery.sap.global",
    "hc/hph/core/ui/AjaxUtils"
], function (jQuery, ConfigUtils) {
    "use strict";

	var BackendLinker = {};
	
	/**
	* Make a POST-request and execute the callback on response.
	* Some default settings are applied.
	* @param   {Object}          oSettings jQuery.ajax settings object
	* @param   {Function}        fCallback Callback function to be called on success or error.
	*/
	BackendLinker._postJson = function(oSettings, fCallback) {
		ConfigUtils.ajax(jQuery.extend({
			url: "/hc/hph/config/services/assignment.xsjs",
			type: "POST",
			dataType: "json",
			contentType: "application/json; charset=utf-8"
		}, oSettings)).done(function(oData) {
			fCallback("success", oData);
		}).fail(function($jqXHR) {
			fCallback("error", $jqXHR.responseJSON);
		});
	};
	
	BackendLinker.createAssignment = function(oSettings, fCallback) {
		ConfigUtils.ajax(jQuery.extend({
			url: "/hc/hph/config/assignment/",
			type: "POST",
			dataType: "json",
			contentType: "application/json; charset=utf-8"
		}, BackendLinker._somethingWithAssignment("create", oSettings, fCallback))).done(function(oData) {
			fCallback("success", oData);
		}).fail(function($jqXHR) {
			fCallback("error", $jqXHR.responseJSON);
		});
		//BackendLinker._somethingWithAssignment("create", oSettings, fCallback);
	};
	
	BackendLinker.updateAssignment = function(oSettings, fCallback) {
		ConfigUtils.ajax(jQuery.extend({
			url: "/hc/hph/config/assignment/id/"+oSettings.assignmentId,
			type: "PATCH",
			dataType: "json",
			contentType: "application/json; charset=utf-8"
		}, BackendLinker._somethingWithAssignment("update", oSettings, fCallback))).done(function(oData) {
			fCallback("success", oData);
		}).fail(function($jqXHR) {
			fCallback("error", $jqXHR.responseJSON);
		});
	};
	
	BackendLinker._somethingWithAssignment = function(sAction, oSettings, callback) {		
		var request = {
			assignmentId: oSettings.assignmentId,
			name: oSettings.assignmentName,
			configs: [{
				configType: oSettings.configType,
				configId: oSettings.configId,
				configVersion: oSettings.configVersion
			}],
			message: ""
		};
	
		if (oSettings.entityType === "U" || oSettings.entityType === "Z") {
			request.action = sAction + "UserAssignment";
			request.user = oSettings.entityValue;
		} else if (oSettings.entityType === "O") {
			request.action = sAction + "StudyAssignment";
			request.study = oSettings.entityValue;
		} else if (oSettings.entityType === "G") {
			request.action = sAction + "GroupAssignment";
			request.group = oSettings.entityValue;
		} else {
			throw new Error("ENTITY_TYPE_NOT_SUPPORTED");
		}
	
		return {
			data: JSON.stringify(request)
		};
	};
	
	BackendLinker.getConfigList = function(callback) {
		ConfigUtils.ajax(jQuery.extend({
			url: "/hc/hph/config/assignment/configs",
			type: "GET",
			dataType: "json",
			contentType: "application/json; charset=utf-8"
		},JSON.stringify({
			action: "getList"
		}))).done(function(oData) {
			callback("success", oData);
		}).fail(function($jqXHR) {
			callback("error", $jqXHR.responseJSON);
		});
	};
	
	BackendLinker.getAssignmentList = function(callback) {
		ConfigUtils.ajax(jQuery.extend({
			url: "/hc/hph/config/assignment/",
			type: "GET",
			dataType: "json",
			contentType: "application/json; charset=utf-8"
		},JSON.stringify({
			action: "getAssignmentList"
		}))).done(function(oData) {
			callback("success", oData);
		}).fail(function($jqXHR) {
			callback("error", $jqXHR.responseJSON);
		});
	};
	
	BackendLinker.getOrgs = function(callback) {
		ConfigUtils.ajax(jQuery.extend({
			url: "/hc/hph/config/assignment/orgs",
			type: "GET",
			dataType: "json",
			contentType: "application/json; charset=utf-8"
		},JSON.stringify({
			action: "getOrgs"
		}))).done(function(oData) {
			callback("success", oData);
		}).fail(function($jqXHR) {
			callback("error", $jqXHR.responseJSON);
		});
	};

	BackendLinker.getStudies = function(callback) {
		ConfigUtils.ajax(jQuery.extend({
			url: "/hc/hph/config/assignment/studies",
			type: "GET",
			dataType: "json",
			contentType: "application/json; charset=utf-8"
		},JSON.stringify({
			action: "getStudies"
		}))).done(function(oData) {
			callback("success", oData);
		}).fail(function($jqXHR) {
			callback("error", $jqXHR.responseJSON);
		});
	};
	
	BackendLinker.getUsers = function(callback) {
		ConfigUtils.ajax(jQuery.extend({
			url: "/hc/hph/config/assignment/users",
			type: "GET",
			dataType: "json",
			contentType: "application/json; charset=utf-8"
		},JSON.stringify({
			action: "getUsers"
		}))).done(function(oData) {
			callback("success", oData);
		}).fail(function($jqXHR) {
			callback("error", $jqXHR.responseJSON);
		});
	};
	
	BackendLinker.deleteAssignment = function(sId, callback) {
		ConfigUtils.ajax(jQuery.extend({
			url: "/hc/hph/config/assignment/id/"+sId,
			type: "DELETE",
			dataType: "json",
			contentType: "application/json; charset=utf-8"
		},JSON.stringify({
			action: "deleteAssignment"
		}))).done(function(oData) {
			callback("success", oData);
		}).fail(function($jqXHR) {
			callback("error", $jqXHR.responseJSON);
		});
	};
	
	return BackendLinker;
});

