sap.ui.define([
    "jquery.sap.global",
    "sap/ui/core/mvc/Controller",
    "sap/hc/hph/config/assignment/ui/lib/Formatter",
    "sap/hc/hph/config/assignment/ui/lib/BackendLinker",
    "sap/hc/hph/config/assignment/ui/lib/TextUtils",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/Button",
    "sap/m/Dialog",
    "sap/ui/model/Filter"
], function (jQuery, Controller, Formatter, BackendLinker, TextUtils, MessageBox, MessageToast, Button, Dialog, Filter) {
    "use strict";

    var entityUIConfig = {
		"U": {	icon: "sap-icon://group" },
		"O": {	icon: "sap-icon://curriculum" },
		"Z": {	icon: "sap-icon://hr-approval" },
		"G": {	icon: "sap-icon://manager" } 
	};

    var AssignmentTableController = Controller.extend("sap.hc.hph.config.assignment.ui.views.AssignmentTable");

    AssignmentTableController.prototype.onInit = function () {
        this.updateModel();
    };

    AssignmentTableController.prototype.updateModel = function () {
        var that = this;

        var oDefModel = new sap.ui.model.json.JSONModel([{ "DEFAULTID": "DEFAULT_CONFIG_ASSIGNMENT" }]);
        that.getView().setModel(oDefModel, "defaults");

        BackendLinker.getStudies(function (status, oData) {
            if (status === "success") {
                var oModel = new sap.ui.model.json.JSONModel(oData);
                oModel.setSizeLimit(Infinity);
                that.getView().setModel(oModel, "studies");
            }           

            BackendLinker.getAssignmentList(function (status, oData) {

                var formattedData = that._formatModel(oData, {
                    "configType": that.configTypeFormatter
                });
    
                var modelData = {
                    assignments: formattedData
                };
                var table = that.getView().byId("idMAssignmentTable");
    
                // clear filters and sorting
                var oListBinding = table.getBinding();
                if (oListBinding) {
                    var cols = table.getColumns();
                    cols.forEach(function (col, index) {
    
                        col.setFiltered(false);
                        col.setFilterValue(null);
                        col.setSorted(false);
                    });
    
                    table.getModel().refresh(true);
                }
    
    
                var model = new sap.ui.model.json.JSONModel(modelData);
                that.getView().setModel(model);
    
                // sort by the first column
                table.sort(table.getColumns()[0], sap.ui.table.SortOrder.Ascending);
    
            });
        });

        BackendLinker.getUsers(function (status, oData) {
            if (status === "success") {
                var oUsersModel = new sap.ui.model.json.JSONModel(oData);
                oUsersModel.setSizeLimit(Infinity);
                that.getView().setModel(oUsersModel, "users");
            }
        });


                               
    };

    AssignmentTableController.prototype.onDeletePressed = function (oEvent) {
        var oBindingContext = oEvent.getSource().getBindingContext();
        var sId = oBindingContext.getModel().getProperty(
            oBindingContext.getPath() + "/assignmentId");
        var that = this;

        MessageBox.show(TextUtils.getText("HPH_CFG_ASSIGN_MSG_DELETE_ASSIGNMENT"), {
            icon: "sap.m.MessageBox.Icon.QUESTION",
            title: TextUtils.getText("HPH_CFG_ASSIGN_DELETE_ASSIGNMENT_TITLE"),
            actions: [MessageBox.Action.DELETE,
                MessageBox.Action.CANCEL
            ],
            onClose: function (oAction) {
                if (oAction === MessageBox.Action.DELETE) {
                    BackendLinker.deleteAssignment(sId, that.deletionCallback
                        .bind(that));
                }
            }
        });
    };

    AssignmentTableController.prototype.onEditPressed = function (oEvent) {
        var oBindingContext = oEvent.getSource().getBindingContext(),
            sPath = oBindingContext.sPath,
            oModel = oBindingContext.getModel();

        var oAssignment = JSON.parse(JSON.stringify(oModel.getProperty(sPath)));

        var createAssignmentView = new sap.ui.xmlview("sap.hc.hph.config.assignment.ui.views.AddAssignment");
        var oDialog = new Dialog({
            title: TextUtils.getText("HPH_CFG_ASSIGN_ADD_ASSIGNMENT_DIALOG_TITLE"),
            content: createAssignmentView,
            buttons: [
                new Button({
                    text: "{i18n>HPH_CFG_ASSIGN_ADD_ASSIGNMENT_DIALOG_SAVE_BTN}",
                    press: (function () {
                        BackendLinker.updateAssignment(createAssignmentView.getController().getAssignments(), this._getAssignmentUpdatedCallback());
                        oDialog.close();
                    }).bind(this)
                }),
                new Button({
                    text: "{i18n>HPH_CFG_ASSIGN_ADD_ASSIGNMENT_DIALOG_CLOSE_BTN}",
                    press: function () {
                        oDialog.close();
                    }
                })
            ],
            afterClose: function () {
                oDialog.destroy();
            }
        });

        createAssignmentView.getController().setAssignments(oAssignment);

        this.getView().addDependent(oDialog);
        oDialog.open();
    };

    AssignmentTableController.prototype.deletionCallback = function (status, oData) {
        this.updateModel();
        if (status === "success") {
            MessageToast.show(TextUtils
                .getText("HPH_CFG_ASSIGN_MSG_DELETION_SUCCESSFUL_TEXT"));
        } else {
            MessageToast.show(TextUtils
                .getText("HPH_CFG_ASSIGN_MSG_DELETION_FAILED_TEXT") + "\n" + TextUtils.getText(JSON.stringify(oData)), {
                    autoClose: false
                });
        }
    };

    AssignmentTableController.prototype.onCreateAssignment = function () {
        var createAssignmentView = new sap.ui.xmlview("sap.hc.hph.config.assignment.ui.views.AddAssignment");
        var oDialog = new Dialog({
            title: TextUtils.getText("HPH_CFG_ASSIGN_ADD_ASSIGNMENT_DIALOG_TITLE"),
            content: createAssignmentView,
            buttons: [
                new Button({
                    text: "{i18n>HPH_CFG_ASSIGN_ADD_ASSIGNMENT_DIALOG_CREATE_BTN}",
                    press: (function () {
                        BackendLinker.createAssignment(createAssignmentView.getController().getAssignments(), this._getAssignmentCreatedCallback());
                        oDialog.close();
                    }).bind(this)
                }),
                new Button({
                    text: "{i18n>HPH_CFG_ASSIGN_ADD_ASSIGNMENT_DIALOG_CLOSE_BTN}",
                    press: function () {
                        oDialog.close();
                    }
                })
            ],
            afterClose: function () {
                oDialog.destroy();
            }
        });
        this.getView().addDependent(oDialog);
        oDialog.open();
    };

    AssignmentTableController.prototype._getAssignmentCreatedCallback = function () {
        return (function (sStatus, oData) {
            this._updateTable();
            this._showToast("HPH_CFG_ASSIGN_MSG_CREATION_SUCCESSFUL_TEXT", "HPH_CFG_ASSIGN_MSG_CREATION_FAILED_TEXT", sStatus, oData);
        }).bind(this);
    };

    AssignmentTableController.prototype._getAssignmentUpdatedCallback = function () {
        return (function (sStatus, oData) {
            this._updateTable();
            this._showToast("HPH_CFG_ASSIGN_MSG_UPDATE_SUCCESSFUL_TEXT", "HPH_CFG_ASSIGN_MSG_UPDATE_FAILED_TEXT", sStatus, oData);
        }).bind(this);
    };

    AssignmentTableController.prototype._showToast = function (sMsgIdSuccess, sMsgIdFailure, status, oData) {
        if (status === "success") {
            MessageToast.show(TextUtils.getText(sMsgIdSuccess));
        } else {
            var key = oData;

            if(oData.hasOwnProperty("message")) {
                key = oData.message;
            }
            MessageToast.show(TextUtils.getText(sMsgIdFailure) + "\n" + TextUtils.getText(key), {
                autoClose: false
            });
        }
    };

    AssignmentTableController.prototype._updateTable = function () {
        this.updateModel();
    };

    AssignmentTableController.prototype.entityIconFormatter = function (entityType) {
        return entityUIConfig[entityType] ? entityUIConfig[entityType].icon : "";
    };

    AssignmentTableController.prototype.entityTextFormatter = function (entityType, entityValue) {

        var returnValue = entityValue;

        if (entityType === "U" || entityType === "G") {
            var usrModel = this.getView().getModel("users");
        } else if (entityType == "O") {
            var oModel = this.getView().getModel("studies");
            oModel.getData().forEach(function (orgObject) {
                if (orgObject.studyId === entityValue) returnValue = orgObject.name;
            });
        } else {
            returnValue = "DEFAULT_CONFIG_ASSIGNMENT";
        }

        return returnValue;
    };

    AssignmentTableController.prototype.configTypeFormatter = function (configType) {
        // TODO: Load this from json and reuse in AddAssignmentView
        switch (configType) {
            case "HC/HPH/PATIENT":
                return TextUtils.getText("HPH_CFG_ASSIGN_CONFIG_TYPE_PV");
            case "HC/MRI/PA":
                return TextUtils.getText("HPH_CFG_ASSIGN_CONFIG_TYPE_PA");
            default:
                return configType;
        }
    };

    AssignmentTableController.prototype._formatModel = function (data, columnFormatter) {

        var newData = data.slice();
        var studiesData = this.getView().getModel("studies").getData();

        for (var column in columnFormatter) {
            if (columnFormatter.hasOwnProperty(column)) {
                var formattedColumnName = column + "Formatted";



                newData.map(function (row) {
                    row[formattedColumnName] = columnFormatter[column](row[column]);
                });

                newData.map(function (row) {
                    row.entityType = (row.entityType === "U" && row.entityValue === "DEFAULT_CONFIG_ASSIGNMENT") ? "Z" : row.entityType;
                });

            }
        }

        // Create concatenated Column
        newData.map(function (row) {
            row.configTypeAndNameConcatenated = row.configTypeFormatted + " - " + row.configName;
        });

        // Create Text Value of Entity
        newData.map(function (row) {
            row.entityValueText = row.entityValue;
            if(row.entityType === "O") {
                for(var i = 0; i< studiesData.length; i++) {
                    if(studiesData[i].studyId === row.entityValue) {
                        row.entityValueText = studiesData[i].name;
                    }
                }
            }
        });

        return newData;
    };

    AssignmentTableController.prototype.onSearch = function (oEvt) {

        // add filter for search

        var searchFilter = [];
        var aFilters = [];
        var sQuery = oEvt.getSource().getValue();
        if (sQuery && sQuery.length > 0) {
            var filter = new Filter("assignmentName", sap.ui.model.FilterOperator.Contains, sQuery);
            aFilters.push(filter);

            filter = new Filter("configTypeFormatted", sap.ui.model.FilterOperator.Contains, sQuery);
            aFilters.push(filter);

            filter = new Filter("configName", sap.ui.model.FilterOperator.Contains, sQuery);
            aFilters.push(filter);

            searchFilter = new Filter(aFilters, false);
        }

        // update list binding
        var list = this.getView().byId("idMAssignmentTable");
        var binding = list.getBinding("rows");
        binding.filter(searchFilter);

    };

    return AssignmentTableController;
});
