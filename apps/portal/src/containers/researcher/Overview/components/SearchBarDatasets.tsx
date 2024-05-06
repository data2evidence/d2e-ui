import React, { FC, useCallback, useState } from "react";
import SearchBar from "../../../../components/SearchBar/SearchBar";
import { useTranslation } from "../../../../contexts";

interface SearchBarDatasetProps {
  width?: string;
}

export const SearchBarDataset: FC<SearchBarDatasetProps> = ({ width = "100%" }) => {
  const [searchText, setSearchText] = useState("");
  const { getText, i18nKeys } = useTranslation();

  const updateSearchResult = useCallback(
    (keyword: string) => {
      setSearchText(keyword);
    },
    [searchText]
  );

  return (
    <SearchBar
      keyword={searchText}
      placeholder={getText(i18nKeys.SEARCH_BAR_DATASET__PLACEHOLDER)}
      onEnter={updateSearchResult}
      width={width}
      height="48px"
    />
  );
};
