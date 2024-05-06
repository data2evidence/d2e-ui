import React, { FC, useCallback, useState } from "react";
import SearchBar from "../../../../components/SearchBar/SearchBar";

interface SearchBarDatasetProps {
  width?: string;
}

export const SearchBarDataset: FC<SearchBarDatasetProps> = ({ width = "100%" }) => {
  const [searchText, setSearchText] = useState("");

  const updateSearchResult = useCallback(
    (keyword: string) => {
      setSearchText(keyword);
    },
    [searchText]
  );

  return <SearchBar keyword={searchText} onEnter={updateSearchResult} width={width} height="48px" />;
};
