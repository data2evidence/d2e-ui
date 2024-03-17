import { useCallback, useEffect, useState } from "react";
import { IDatabase } from "../types";
import { DbCredentialsMgr } from "../axios/db-credentials-mgr";

export const useVocabSchemas = (databases: IDatabase[], databaseCode: string): [{ [key: string]: string[] }] => {
  const [vocabSchemas, setVocabSchemas] = useState<{ [key: string]: string[] }>({});

  const getVocabSchemas = useCallback(
    async (dialect: string) => {
      try {
        const dbCredentialsMgr = new DbCredentialsMgr();
        const vocabSchemas = await dbCredentialsMgr.getDbVocabSchemas(dialect);
        setVocabSchemas(vocabSchemas);
      } catch (error) {
        console.error(error);
      }
    },
    [setVocabSchemas]
  );

  useEffect(() => {
    const db = databases.find((db) => {
      return db.code === databaseCode;
    });
    if (db) {
      getVocabSchemas(db.dialect);
    }
  }, [databases, databaseCode, getVocabSchemas]);

  return [vocabSchemas];
};
