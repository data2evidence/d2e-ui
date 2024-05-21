import React, { FC } from "react";
import SearchBar from "../../../../components/SearchBar/SearchBar";
import { useTranslation } from "../../../../contexts";

interface SearchBarDatasetProps {
  width?: string;
  keyword?: string;
  onEnter?: (keyword: string) => void;
  onChange?: (keyword: string) => void;
}

export const SearchBarDataset: FC<SearchBarDatasetProps> = ({ width = "100%", keyword, onEnter, onChange }) => {
  const { getText, i18nKeys } = useTranslation();

  return (
    <SearchBar
      keyword={keyword}
      placeholder={getText(i18nKeys.SEARCH_BAR_DATASET__PLACEHOLDER)}
      onEnter={onEnter}
      onChange={onChange}
      width={width}
      height="48px"
    />
  );
};
