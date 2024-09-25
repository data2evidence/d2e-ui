import { Edge } from "reactflow";
import { FieldSourceState, FieldTargetState, TableSourceState, TableTargetState } from "../contexts";

interface Ref {
  "@ref": number | undefined;
}

interface Field {
  "@id": number;
  "@type": string;
  table: Ref;
  name: string;
  tableName: string;
  comment: string;
  valueCounts: {
    "@id"?: number;
    valueCounts: Array<{ "@type": string; value: string; frequency: number; this$0: { "@ref": number } }>;
    totalFrequency: number;
    mostFrequentValue: string | null;
    mostFrequentValueCount: number;
  };
  isNullable: boolean;
  type: string;
  description: string;
  maxLength: number;
  isStem: boolean;
  conceptIdHints: null | any;
  fractionEmpty: number;
  uniqueCount: number;
  fractionUnique: number;
}

interface Table {
  "@id": number;
  "@type": string;
  db: Ref;
  name: string;
  description: string;
  rowCount: number;
  rowsCheckedCount: number;
  comment: string;
  fields: {
    "@type": string;
    "@items": Field[];
  };
  isStem: boolean;
}

interface Db {
  "@id": number;
  dbName: string;
  conceptIdHintsVocabularyVersion: number | null;
  tables: {
    "@type": string;
    "@items": Table[];
  };
}

interface ItemToItemMap {
  "@type": string;
  sourceItem: Ref;
  cdmItem: Ref;
  extraFieldToValue: {
    "@type": string;
  };
  comment: string;
  logic: string;
  isCompleted: boolean;
}

export interface EtlModel {
  "@type": string;
  sourceDb: Db;
  cdmDb: Db;
  tableToTableMaps: {
    "@type": string;
    "@items": ItemToItemMap[];
  };
  tableMapToFieldToFieldMaps: {
    "@type": string;
    "@keys": ItemToItemMap[];
    "@items": {
      "@type": string;
      "@items": ItemToItemMap[];
    }[];
  };
}

const getFieldName = (fieldName: string) => fieldName.toLowerCase().replace(/\s+/g, "_");

const createField = (fieldId: number, field: FieldSourceState | FieldTargetState): Omit<Field, "table"> => ({
  "@id": fieldId,
  "@type": "org.ohdsi.rabbitInAHat.dataModel.Field",
  name: getFieldName(field.data.label),
  tableName: field.data.tableName, // Temporary stored for lookup purpose
  comment: "",
  valueCounts: {
    valueCounts: [],
    totalFrequency: 0,
    mostFrequentValue: null,
    mostFrequentValueCount: -1,
  },
  isNullable: true,
  type: field.data.columnType,
  description: "",
  maxLength: 0,
  isStem: false,
  conceptIdHints: null,
  fractionEmpty: 0.1,
  uniqueCount: 10,
  fractionUnique: 1.0,
});

const createTable = (tableId: number, table: TableSourceState | TableTargetState): Omit<Table, "fields" | "db"> => ({
  "@id": tableId,
  "@type": "org.ohdsi.rabbitInAHat.dataModel.Table",
  name: table.data.label,
  description: "",
  rowCount: 0,
  rowsCheckedCount: 0,
  comment: "",
  isStem: false,
});

const createDb = (dbId: number, dbName: string): Omit<Db, "tables"> => ({
  "@id": dbId,
  dbName,
  conceptIdHintsVocabularyVersion: null,
});

const createMap = (sourceId: number | undefined, targetId: number | undefined): ItemToItemMap => ({
  "@type": "org.ohdsi.rabbitInAHat.dataModel.ItemToItemMap",
  sourceItem: {
    "@ref": sourceId,
  },
  cdmItem: {
    "@ref": targetId,
  },
  extraFieldToValue: {
    "@type": "java.util.HashMap",
  },
  comment: "",
  logic: "",
  isCompleted: false,
});

let etlGlobalVar = {
  tableId: 10,
  fieldId: 100,
};

export const transformEtlModel = (
  sourceDbId: number,
  sourceDbName: string,
  sourceTables: TableSourceState[],
  sourceFields: FieldSourceState[],
  targetDbId: number,
  targetDbName: string,
  targetTables: TableTargetState[],
  targetFields: FieldTargetState[],
  tableToTableMaps: Edge[],
  fieldToFieldMaps: Edge[]
): EtlModel => {
  const mappeSourceFields = sourceFields.map((field) => {
    etlGlobalVar.fieldId++;
    return createField(etlGlobalVar.fieldId, field) as Field;
  });

  const mappedSourceTables = sourceTables.map((table) => {
    etlGlobalVar.tableId++;
    return {
      ...createTable(etlGlobalVar.tableId, table),
      db: {
        "@ref": sourceDbId,
      },
      fields: {
        "@type": "java.util.ArrayList",
        "@items": mappeSourceFields
          .filter((field) => field.tableName === table.data.label)
          .map((field) => ({
            ...field,
            table: {
              "@ref": etlGlobalVar.tableId,
            },
          })),
      },
    } as Table;
  });

  const mappedTargetFields = targetFields.map((field) => {
    etlGlobalVar.fieldId++;
    if (field.data.comment) {
      console.log("field.data.comment", field.data.comment);
    }
    return {
      ...createField(etlGlobalVar.fieldId, field),
      comment: field.data.comment,
    } as Field;
  });

  const mappedTargetTables = targetTables.map((table) => {
    etlGlobalVar.tableId++;
    return {
      ...createTable(etlGlobalVar.tableId, table),
      db: {
        "@ref": targetDbId,
      },
      fields: {
        "@type": "java.util.ArrayList",
        "@items": mappedTargetFields
          .filter((field) => field.tableName === table.data.label)
          .map((field) => ({
            ...field,
            table: {
              "@ref": etlGlobalVar.tableId,
            },
          })),
      },
    } as Table;
  });

  const mappedTableToTableMaps = tableToTableMaps.map((item) =>
    createMap(
      mappedSourceTables.find((t) => getFieldName(t.name) === getFieldName(item.sourceHandle || ""))?.["@id"],
      mappedTargetTables.find((t) => getFieldName(t.name) === getFieldName(item.targetHandle || ""))?.["@id"]
    )
  );

  const mappedFieldToFieldMaps = fieldToFieldMaps.map((item) => {
    let sourceField = "",
      targetField = "";

    const sourceParts = item.sourceHandle?.split("-");
    sourceField = sourceParts && sourceParts.length >= 2 ? sourceParts[1] : "";

    const sourceFieldId = mappeSourceFields.find((f) => getFieldName(f.name) === getFieldName(sourceField))?.["@id"];
    if (!sourceFieldId) {
      console.warn("Missing source field", sourceField, mappeSourceFields);
    }

    const targetParts = item.targetHandle?.split("-");
    targetField = targetParts && targetParts.length >= 2 ? targetParts[1] : "";

    const targetFieldId = mappedTargetFields.find((f) => getFieldName(f.name) === getFieldName(targetField))?.["@id"];
    if (!targetFieldId) {
      console.warn("Missing source field", targetField, mappedTargetFields);
    }

    return createMap(sourceFieldId, targetFieldId);
  });

  return {
    "@type": "org.ohdsi.rabbitInAHat.dataModel.ETL",
    sourceDb: {
      ...createDb(sourceDbId, sourceDbName),
      tables: {
        "@type": "java.util.ArrayList",
        "@items": mappedSourceTables,
      },
    },
    cdmDb: {
      ...createDb(targetDbId, targetDbName),
      tables: {
        "@type": "java.util.ArrayList",
        "@items": mappedTargetTables,
      },
    },
    tableToTableMaps: {
      "@type": "java.util.ArrayList",
      "@items": mappedTableToTableMaps,
    },
    tableMapToFieldToFieldMaps: {
      "@type": "java.util.HashMap",
      "@keys": mappedTableToTableMaps,
      "@items": [
        {
          "@type": "java.util.ArrayList",
          "@items": mappedFieldToFieldMaps,
        },
      ],
    },
  };
};
