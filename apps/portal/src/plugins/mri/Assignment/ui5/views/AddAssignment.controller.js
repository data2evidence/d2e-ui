sap.ui.define([
    "jquery.sap.global",
    "sap/ui/core/mvc/Controller",
	"hc/hph/config/assignment/ui/lib/BackendLinker",
	"hc/hph/config/assignment/ui/lib/TextUtils"
], function (jQuery, Controller, BackendLinker, TextUtils) {
    "use strict";

	var entityUIConfig = {
		"U": {	icon: "sap-icon://group", field: 'userCombobox' },
		"O": {	icon: "sap-icon://curriculum", field: 'orgCombobox' },
		"Z": {	icon: "sap-icon://hr-approval", field: 'defaultCombobox' },
		"G": {	icon: "sap-icon://manager", field: 'groupCombobox' } 
	};

	var defaultEntity = "O";
	var AddAssignmentController = Controller.extend("hc.hph.config.assignment.ui.views.AddAssignment");

	AddAssignmentController.prototype.onInit = function() {
		this._initModel();
		this._initResultModel();
		this._fetchStudies();
		this._fetchUsers();

		//Init with Org
		this._setEntityTypeInResult(defaultEntity);
		this._setOrgComboBoxVisibilityTo(defaultEntity);
		this.getView().byId('userOrgSegmentedButton').setSelectedKey(defaultEntity);
		this.getView().byId('userOrgSegmentedButton').fireSelectionChange();

		this.configIdCombobox = this.getView().byId('configIdCombobox');
		this.configVersionCombobox = this.getView().byId('configVersionCombobox');
	};

	AddAssignmentController.prototype._initModel = function() {
		var oModel = new sap.ui.model.json.JSONModel();
		// TODO: This is using a synchronous request to load the JSON, because if the json is not available, the view initialization fails. Find a way to do this correctly.
		oModel.loadData(jQuery.sap.getModulePath("hc.hph.config.assignment.ui.db", "/model.json"), {}, false);
		this.getView().setModel(oModel);
		BackendLinker.getConfigList(function(status, oData) {
			oModel.setProperty("/configurations", oData);
		}.bind(this));
	};

	AddAssignmentController.prototype._initResultModel = function() {
		var _oResultModel = new sap.ui.model.json.JSONModel({
			assignmentName: "",
			configType: "",
			configId: "",
			entityType: "O",
			entityValue: ""
		});

		this.getView().setModel(_oResultModel, "result");
	};

  AddAssignmentController.prototype._fetchStudies = function() {

		jQuery.sap.registerModulePath("hc.hph.core", "/hc/hph/core");
		var that = this;

		BackendLinker.getStudies(function (status, oData) {
            if (status === "success") {
                var oModel = new sap.ui.model.json.JSONModel(oData);
                oModel.setSizeLimit(Infinity);
                that.getView().setModel(oModel, "studies");
            }
        });
	};

	AddAssignmentController.prototype._fetchUsers = function() {
	    
		jQuery.sap.registerModulePath("hc.hph.core", "/hc/hph/core");
		var that = this;

		BackendLinker.getUsers(function (status, oData) {
			if (status === "success") {
				var oUsersModel = new sap.ui.model.json.JSONModel(oData);
				oUsersModel.setSizeLimit(Infinity);
				that.getView().setModel(oUsersModel, "users");
			}
		});
	};

	AddAssignmentController.prototype.setAssignments = function(oData) {
	    this.filterConfigIdsByType(oData.configType);
		this.filterConfigVersionsById(oData.configId);
		this.getView().getModel("result").setData(oData);
		var myModel = this.getView().getModel("result");
		this.filterConfigIdsByType(myModel.getProperty("/configType"));
		this.filterConfigVersionsById(myModel.getProperty("/configId"));

		var entityTypeKey = this.getView().getModel("result").getProperty("/entityType");
		this.getView().byId('userOrgSegmentedButton').setSelectedKey(entityTypeKey);
		this._setOrgComboBoxVisibilityTo(entityTypeKey);
		this.getView().byId('userOrgSegmentedButton').fireSelectionChange();
	};

	AddAssignmentController.prototype.getAssignments = function() {
		return this.getView().getModel("result").getData();
	};

	AddAssignmentController.prototype.onConfigTypeChanged = function(oEvent) {
		var selectedItem = oEvent.getParameter('selectedItem');
		var configType = selectedItem.getKey();
		this.filterConfigIdsByType(configType);
		this.configIdCombobox.setSelectedItemId();
		this.configVersionCombobox.setSelectedItemId();
	};

	AddAssignmentController.prototype.onEntityTypeChanged = function(oEvent) {
		var sKey = oEvent.getParameters().key;
		this._setEntityTypeInResult(sKey);
		this._setOrgComboBoxVisibilityTo(sKey);
	};

	AddAssignmentController.prototype._setOrgComboBoxVisibilityTo = function(bValue) {
		var thisView = this.getView();
		Object.keys(entityUIConfig).forEach(function(key) {
			thisView.byId(entityUIConfig[key].field).setVisible(key === bValue);
		});
	};

	AddAssignmentController.prototype._setEntityTypeInResult = function(sKey) {
		this.getView().getModel("result").setProperty("/entityType", sKey);
	};

	AddAssignmentController.prototype.filterConfigIdsByType = function(configType) {
		var filters = [
			new sap.ui.model.Filter("configType", sap.ui.model.FilterOperator.EQ, configType)
		];
		this.configIdCombobox.getBinding("items").filter(filters, sap.ui.model.FilterType.Application);
	};

	AddAssignmentController.prototype.onConfigIdChanged = function(oEvent) {
		var selectedItem = oEvent.getParameter('selectedItem');
		var configId = selectedItem.getKey();
		this.filterConfigVersionsById(configId);
		this.configVersionCombobox.setSelectedItem(this.configVersionCombobox.getFirstItem());
	};

	AddAssignmentController.prototype.filterConfigVersionsById = function(configId) {
		var filters = [
			new sap.ui.model.Filter("configId", sap.ui.model.FilterOperator.EQ, configId)
		];
		this.configVersionCombobox.getBinding("items").filter(filters, sap.ui.model.FilterType.Application);
	};

	AddAssignmentController.prototype.entityIconFormatter = function(entityType) {
		return entityUIConfig[entityType].icon;
	};

	AddAssignmentController.prototype.entityNameFormatter = function(entityName) {
		return TextUtils.getText(entityName);
	};

	AddAssignmentController.prototype.configTypeFormatter = function(configType) {
	    return TextUtils.getText(configType);
	};

return AddAssignmentController;
});
