import React, { FC, useCallback, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";
import {
  Loader,
  TableCell,
  TableRow,
  Title,
  Text,
  VisibilityPublicIcon,
  VisibilityOnIcon,
  VisibilityOffIcon,
  Button,
} from "@portal/components";
import { CloseDialogType, Study, StudyAttribute } from "../../../types";
import { useDialogHelper, useDatasets, useDatabases } from "../../../hooks";
import AddStudyDialog from "./AddStudyDialog/AddStudyDialog";
import UpdateStudyDialog from "./UpdateStudyDialog/UpdateStudyDialog";
import DatasetResourcesDialog from "./DatasetResourcesDialog/DatasetResourcesDialog";
import CopyStudyDialog from "./CopyStudyDialog/CopyStudyDialog";
import DeleteStudyDialog from "./DeleteStudyDialog/DeleteStudyDialog";
import ActionSelector from "./ActionSelector/ActionSelector";
import PermissionsDialog from "./PermissionsDialog/PermissionsDialog";
import UpdateSchemaDialog from "./UpdateSchemaDialog/UpdateSchemaDialog";
import CreateReleaseDialog from "./CreateReleaseDialog/CreateReleaseDialog";
import "./StudyOverview.scss";

const enum StudyAttributeConfigIds {
  LATEST_SCHEMA_VERSION = "latest_schema_version",
  SCHEMA_VERSION = "schema_version",
}
const MISSING_ATTRIBUTE_ERROR = "Not Available";

const StudyOverview: FC = () => {
  const [refetch, setRefetch] = useState(0);
  const [datasets, loadingDatasets, error] = useDatasets("systemAdmin", undefined, refetch);
  const [databases] = useDatabases();

  const getDbDialect = useCallback(
    (dbName: string) => {
      const currDb = databases.find((db) => db.code === dbName);
      return currDb ? currDb.dialect : "";
    },
    [databases]
  );

  const [showAddStudyDialog, openAddStudyDialog, closeAddStudyDialog] = useDialogHelper(false);
  const [showUpdateStudyDialog, openUpdateStudyDialog, closeUpdateStudyDialog] = useDialogHelper(false);
  const [showResourcesDialog, openResourcesDialog, closeResourcesDialog] = useDialogHelper(false);
  const [showCopyStudyDialog, openCopyStudyDialog, closeCopyStudyDialog] = useDialogHelper(false);
  const [showDeleteStudyDialog, openDeleteStudyDialog, closeDeleteStudyDialog] = useDialogHelper(false);
  const [showPermissionsDialog, openPermissionsDialog, closePermissionsDialog] = useDialogHelper(false);
  const [showUpdateDialog, openUpdateDialog, closeUpdateDialog] = useDialogHelper(false);
  const [showReleaseDialog, openReleaseDialog, closeReleaseDialog] = useDialogHelper(false);

  const [activeStudy, setActiveStudy] = useState<Study>();
  const [loading, setLoading] = useState(false);

  const handleUpdateStudy = useCallback(
    (study: Study) => {
      setActiveStudy(study);
      openUpdateStudyDialog();
    },
    [openUpdateStudyDialog]
  );

  const handleResources = useCallback(
    (study: Study) => {
      setActiveStudy(study);
      openResourcesDialog();
    },
    [openResourcesDialog]
  );

  const handleCopyStudy = useCallback(
    (study: Study) => {
      setActiveStudy(study);
      openCopyStudyDialog();
    },
    [openCopyStudyDialog]
  );

  const handleDeleteStudy = useCallback(
    (study: Study) => {
      setActiveStudy(study);
      openDeleteStudyDialog();
    },
    [openDeleteStudyDialog]
  );

  const handlePermissions = useCallback(
    (study: Study) => {
      setActiveStudy(study);
      openPermissionsDialog();
    },
    [openPermissionsDialog]
  );

  const handleRelease = useCallback(
    (study: Study) => {
      study.dialect = getDbDialect(study.databaseCode);
      setActiveStudy(study);
      openReleaseDialog();
    },
    [getDbDialect, openReleaseDialog]
  );

  const handleUpdate = useCallback(
    (study: Study) => {
      study.dialect = getDbDialect(study.databaseCode);
      setActiveStudy(study);
      openUpdateDialog();
    },
    [getDbDialect, openUpdateDialog]
  );

  const visibilityImgAlt = useCallback((value?: string) => {
    if (!value) return;
    return value === "DEFAULT" ? "Normal" : value.charAt(0).toUpperCase() + value.substring(1).toLowerCase();
  }, []);

  const visibilityIcon = useCallback(
    (visibilityStatus: string) => {
      const alt = visibilityImgAlt(visibilityStatus);
      switch (visibilityStatus) {
        case "HIDDEN":
          return <VisibilityOffIcon title={alt} />;
        case "PUBLIC":
          return <VisibilityPublicIcon title={alt} />;
        default:
          return <VisibilityOnIcon title={alt} />;
      }
    },
    [visibilityImgAlt]
  );

  const handleCloseAddStudyDialog = useCallback(
    (type: CloseDialogType) => {
      closeAddStudyDialog();
      if (type === "success") {
        setRefetch((refetch) => refetch + 1);
      }
    },
    [closeAddStudyDialog]
  );

  const handleCloseUpdateStudyDialog = useCallback(
    (type: CloseDialogType) => {
      closeUpdateStudyDialog();
      if (type === "success") {
        setRefetch((refetch) => refetch + 1);
      }
    },
    [closeUpdateStudyDialog]
  );

  const handleCloseCopyStudyDialog = useCallback(
    (type: CloseDialogType) => {
      closeCopyStudyDialog();
      if (type === "success") {
        setRefetch((refetch) => refetch + 1);
      }
    },
    [closeCopyStudyDialog]
  );

  const handleCloseDeleteStudyDialog = useCallback(
    (type: CloseDialogType) => {
      closeDeleteStudyDialog();
      if (type === "success") {
        setRefetch((refetch) => refetch + 1);
      }
    },
    [closeDeleteStudyDialog]
  );

  const getAttributeValue = (
    studyAttributes: StudyAttribute[] | undefined,
    attributeConfigId: StudyAttributeConfigIds
  ): string => {
    if (!studyAttributes) {
      return MISSING_ATTRIBUTE_ERROR;
    }
    const latestSchemaVersionAttribute = studyAttributes.find((studyAttribute: StudyAttribute) => {
      return studyAttribute.attributeId === attributeConfigId;
    });
    if (latestSchemaVersionAttribute) {
      return latestSchemaVersionAttribute.value;
    } else {
      return MISSING_ATTRIBUTE_ERROR;
    }
  };

  const checkIfStudyIsUpdatable = (study: Study): boolean => {
    // If schema version and
    const currentSchemaVersion = getAttributeValue(study.attributes, StudyAttributeConfigIds.SCHEMA_VERSION);
    const latestSchemaVersion = getAttributeValue(study.attributes, StudyAttributeConfigIds.LATEST_SCHEMA_VERSION);

    // If current versions or latest verison attribute is missing, return false
    if (currentSchemaVersion === MISSING_ATTRIBUTE_ERROR || latestSchemaVersion === MISSING_ATTRIBUTE_ERROR) {
      return false;
    }

    return currentSchemaVersion !== latestSchemaVersion;
  };

  if (error) console.error(error.message);
  if (loadingDatasets) return <Loader />;

  return (
    <div className="studyoverview__container">
      <div className="studyoverview">
        <Title>Dataset overview</Title>

        <div className="studyoverview__actions">
          <h3 className="studyoverview__actions-title">Datasets</h3>
          <Button text="Add dataset" onClick={openAddStudyDialog}></Button>
          <AddStudyDialog
            open={showAddStudyDialog}
            onClose={handleCloseAddStudyDialog}
            loading={loading}
            setLoading={setLoading}
            studies={datasets}
            databases={databases}
          />
        </div>

        <div className="studyoverview__content">
          <TableContainer className="studyoverview__list">
            <Table>
              <colgroup>
                <col style={{ width: "1%" }} />
                <col />
                <col />
                <col />
                <col />
                <col />
                <col />
                <col />
              </colgroup>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Study ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Schema name</TableCell>
                  <TableCell>Schema version</TableCell>
                  <TableCell>Latest available schema version</TableCell>
                  <TableCell>Data model</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(!datasets || datasets.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
                {datasets?.map((dataset: Study, index: number) => (
                  <TableRow key={dataset.id} style={index % 2 ? { background: "#ebf1f8" } : { background: "white" }}>
                    <TableCell style={{ paddingLeft: "2.75em" }}>{visibilityIcon(dataset.visibilityStatus)}</TableCell>
                    <TableCell style={{ maxWidth: "120px" }}>
                      <Text textFormat="wrap" showCopy textStyle={{ paddingTop: "5px" }}>
                        {dataset.id}
                      </Text>
                    </TableCell>
                    <TableCell>{dataset.studyDetail?.name ? dataset.studyDetail.name : "Untitled"}</TableCell>
                    <TableCell style={{ maxWidth: "120px" }}>
                      <Text
                        textFormat="wrap"
                        {...(dataset.schemaName && { showCopy: true })}
                        textStyle={{ paddingTop: "5px" }}
                      >
                        {dataset.schemaName ? dataset.schemaName.toUpperCase() : "-"}
                      </Text>
                      {dataset.vocabSchemaName && dataset.schemaName !== dataset.vocabSchemaName && (
                        <Text textFormat="wrap" textStyle={{ paddingTop: "5px" }}>
                          {dataset.vocabSchemaName}
                        </Text>
                      )}
                    </TableCell>
                    <TableCell style={{ maxWidth: "120px" }}>
                      {getAttributeValue(dataset.attributes, StudyAttributeConfigIds.SCHEMA_VERSION)}
                    </TableCell>
                    <TableCell>
                      {getAttributeValue(dataset.attributes, StudyAttributeConfigIds.LATEST_SCHEMA_VERSION)}
                    </TableCell>
                    <TableCell>{dataset.dataModel ? dataset.dataModel : "-"}</TableCell>

                    <TableCell className="col-action">
                      <ActionSelector
                        study={dataset}
                        isSchemaUpdatable={checkIfStudyIsUpdatable(dataset)}
                        handleDeleteStudy={handleDeleteStudy}
                        handleCopyStudy={handleCopyStudy}
                        handleMetadata={handleUpdateStudy}
                        handleResources={handleResources}
                        handlePermissions={handlePermissions}
                        handleUpdate={handleUpdate}
                        handleRelease={handleRelease}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {activeStudy && (
            <UpdateStudyDialog
              dataset={activeStudy}
              open={showUpdateStudyDialog}
              onClose={handleCloseUpdateStudyDialog}
            />
          )}
          {showResourcesDialog && (
            <DatasetResourcesDialog study={activeStudy} open={showResourcesDialog} onClose={closeResourcesDialog} />
          )}
          {showCopyStudyDialog && (
            <CopyStudyDialog
              study={activeStudy}
              open={showCopyStudyDialog}
              onClose={handleCloseCopyStudyDialog}
              loading={loading}
              setLoading={setLoading}
            />
          )}
          {showDeleteStudyDialog && (
            <DeleteStudyDialog
              study={activeStudy}
              open={showDeleteStudyDialog}
              onClose={handleCloseDeleteStudyDialog}
            />
          )}
          {showPermissionsDialog && (
            <PermissionsDialog study={activeStudy} open={showPermissionsDialog} onClose={closePermissionsDialog} />
          )}

          {showUpdateDialog && (
            <UpdateSchemaDialog study={activeStudy} open={showUpdateDialog} onClose={closeUpdateDialog} />
          )}

          {showReleaseDialog && (
            <CreateReleaseDialog
              study={activeStudy}
              open={showReleaseDialog}
              onClose={closeReleaseDialog}
              loading={loading}
              setLoading={setLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyOverview;
