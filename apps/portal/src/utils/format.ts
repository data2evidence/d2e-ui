import { Study } from "../types";

export const formatDataModelName = ({ dataModel, dataModelCustom }: Study) => {
  if (!dataModel) return "-";
  return dataModelCustom ? dataModelCustom : dataModel;
};
