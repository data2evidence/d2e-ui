import React, { FC, useState, useCallback, useEffect } from "react";
import { Button, Dialog, Feedback } from "@portal/components";
import "./CDMDownloadDialog.scss";
import env from "../../../../env";
import QueryModelBuilder from "../../../../utils/mri/ifr/QueryModelBuilder";
import mriClient from "../../../../axios/mri";
import QueryBuilder from "../../../../utils/mri/QueryBuilder";
import QueryString from "../../../../utils/mri/QueryString";
import { createZip } from "../../../../utils/mri/createZip";
import streamSaver from "streamsaver";
import { Zip, AsyncZipDeflate } from "fflate";

interface CDMDownloadDialogProps {
  open: boolean;
  studyId?: string;
  onClose: () => void;
}

const MRI_CONFIG_NAME = env.REACT_APP_MRI_CONFIG_NAME || "";

enum ConfigPath {
  PATIENT_STATUS = "patient.attributes.status",
  PATIENT_ID = "patient.attributes.pid",
  PATIENT_EXTERNAL_ID = "patient.attributes.externalid",
  PATIENT_GROUP_ID = "patient.attributes.groupID",
  PATIENT_ALP_ID = "patient.attributes.alpid",
  QUESTIONAIRE_LINKID = "patient.interactions.questionnaire.attributes.linkID",
  QUESTIONAIRE_VALUE_CODING_VALUE = "patient.interactions.questionnaire.attributes.valueCodingValue",
  QUESTIONAIRE_VALUE_TYPE = "patient.interactions.questionnaire.attributes.valueType",
  QUESTIONAIRE_VALUE = "patient.interactions.questionnaire.attributes.value",
  RECORD_ID = "patient.interactions.questionnaire.attributes.recordID",
  QUESTIONAIRE_LANGUAGE = "patient.interactions.questionnaire.attributes.questionnaireLanguage",
  QUESTIONAIRE_STATUS = "patient.interactions.questionnaire.attributes.questionnaireStatus",
  QUESTIONAIRE_AUTHOR = "patient.interactions.questionnaire.attributes.questionnaireAuthored",
  QUESTIONAIRE_REFERENCE = "patient.interactions.questionnaire.attributes.questionnaireReference",
  QUESTIONAIRE_VERSION = "patient.interactions.questionnaire.attributes.questionnaireVersion",
  QUESTIONAIRE_TEXT = "patient.interactions.questionnaire.attributes.text",
  QUESTIONAIRE_EXTENSION_EFFECTIVE_DATE_URL = "patient.interactions.questionnaire.attributes.extensionEffectiveDateUrl",
  QUESTIONAIRE_EXTENSION_VALUEDATE = "patient.interactions.questionnaire.attributes.extensionValuedate",
}

async function getCDMDataResponse(studyId: string, cancelToken: any) {
  const failedResponse = {
    responseStatus: "Failed",
  };
  const portalConfig = await mriClient
    .getMyConfig(studyId)
    .then((configs) => {
      // Try to find it from environment
      if (MRI_CONFIG_NAME !== "") {
        return configs.find((mriConfig: any) => mriConfig.meta.configName === MRI_CONFIG_NAME);
      } else {
        // find it from the studyID
        return configs.find((mriConfig: any) => mriConfig.meta.assignmentEntityValue === studyId);
      }
    })
    .catch(() => {
      console.error("MRI Config is not found");
      throw failedResponse;
    });

  if (portalConfig === undefined) {
    console.log("Portal config not found");
    throw failedResponse;
  }

  const mriQueryBuilder = new QueryBuilder(portalConfig.meta.configId, portalConfig.meta.configVersion);

  const queryModelBuilder = new QueryModelBuilder();
  const patient = queryModelBuilder.patient();
  const criteriaGroup = queryModelBuilder.criteriaGroup().matchAnyFilters([patient]);
  // Populate columns to fetch from endpoint
  const colArr: Array<string> = [];
  Object.values(ConfigPath).forEach((val) => {
    colArr.push(val);
  });
  const columns = queryModelBuilder.columns(colArr.reverse());
  mriQueryBuilder.addCriteriaGroup(criteriaGroup);
  const cohort = mriQueryBuilder.cohortDefinition(columns, studyId);

  // Split columns Based on entities
  const splitEntitiesByColumns = (columns: Array<{ configPath: string; order: string; seq: number }>) => {
    const entityColumns: any = {};
    columns.forEach((el: { configPath: string }) => {
      const configPathTokens = el.configPath.split(".");
      let entityKey;
      if (configPathTokens[1] === "attributes") {
        // If patient attributes
        entityKey = configPathTokens[0];
      } else if (configPathTokens[1] === "interactions") {
        // If Interaction's attributes
        entityKey = configPathTokens[2];
      } else {
        throw new Error(`Invalid config path ${el.configPath}`);
      }

      entityColumns[entityKey] ? entityColumns[entityKey].push(el) : (entityColumns[entityKey] = [el]);
    });
    return entityColumns;
  };

  const entityColumns = splitEntitiesByColumns(cohort.cohortDefinition.columns);

  const requests = Object.keys(entityColumns).map((el) => {
    const entityParams = JSON.parse(JSON.stringify(cohort));
    entityParams.cohortDefinition.columns = entityColumns[el];

    const urlWithQuerystring = QueryString({
      url: "/api/services/datastream/patient",
      queryString: {
        mriquery: JSON.stringify(entityParams),
        dataFormat: "csv",
      },
      compress: ["mriquery"],
    });

    return mriClient
      .queryMri(urlWithQuerystring, cancelToken)
      .then((response) => {
        return { filename: `${el}.csv`, response };
      })
      .catch((err) => {
        cancelToken.abort();
        console.error("MRI query has failed with the error: ", err);
        throw failedResponse;
      });
  });

  return Promise.all(requests); // Will fire parallel requests for each entity
}

export const CDMDownloadDialog: FC<CDMDownloadDialogProps> = ({ open, studyId, onClose }) => {
  const [isLoading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<Feedback>({});
  const cancelToken = new AbortController();

  let fileStream: WritableStream;
  let writer: WritableStreamDefaultWriter;
  const onCloseWithSuccessCleanup = () => {
    cancelToken.abort();
    if (writer) writer.close();
    onClose();
  };
  const failCleanup = () => {
    cancelToken.abort();
    if (fileStream) fileStream.abort();
    if (writer) writer.abort();
  };
  const onCloseWithFailCleanup = () => {
    failCleanup();
    onClose();
  };

  const handleGetZip = useCallback(async (studyId: string) => {
    try {
      fileStream = streamSaver.createWriteStream(`PatientAnalytics_Patient-List_${new Date().toISOString()}.zip`);
      writer = fileStream.getWriter();
      const responses = await getCDMDataResponse(studyId, cancelToken); //set the zip data

      const zip = new Zip();
      zip.ondata = (err, chunk, final) => {
        if (err) {
          writer.abort();
          throw err;
        }
        writer.write(chunk);
        if (final) {
          setLoading(false);
          onCloseWithSuccessCleanup();
        }
      };

      responses.forEach((obj, index) => {
        const entityFile = new AsyncZipDeflate(obj.filename);
        zip.add(entityFile);
        const reader = obj.response.body.getReader();
        const pump = () => {
          reader.read().then(({ done, value }: { done: boolean; value: Uint8Array }) => {
            if (done) {
              // If there is no more data to read
              entityFile.push(new Uint8Array([]), done);
              return;
            }
            entityFile.push(value);
            pump();
          });
        };
        pump();
        if (responses.length === index + 1) {
          zip.end(); // Must be called after all the files are added
        }
      });
    } catch (err) {
      failCleanup();
      setFeedback({
        type: "error",
        message:
          "Error occurred while retrieving ZIP from MRI. To report the error, please send an email to help@data4life.care",
      });
      console.error("Get Zip error: ", err);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    if (studyId && !fileStream) {
      handleGetZip(studyId).catch((err) => {
        failCleanup();
        setFeedback({
          type: "error",
          message:
            "Error occurred while downloading patient data. To report the error, please send an email to help@data4life.care",
        });
        console.log("There is an error in retrieving the zip, ", err);
      });
    }
  }, [studyId, handleGetZip]);

  return (
    <Dialog
      className="cdm-download-dialog"
      title="CDM Download"
      closable
      open={open}
      onClose={onCloseWithSuccessCleanup}
      feedback={feedback}
    >
      <p className="cdm-download-text">Downloading Zip. This could take a while if the data is large...</p>
      <div className="button-group-actions">
        <Button text="Please wait" loading={isLoading} block disabled />
      </div>
    </Dialog>
  );
};
