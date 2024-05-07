import React, { FC, useState } from "react";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { ArrowCircleRightIcon } from "@portal/components";
import { useTranslation } from "../../contexts";
import "./SearchBar.scss";

interface SearchBarProps {
  keyword?: any;
  onEnter: (keyword: any) => void;
  width?: string;
}

const SearchBar: FC<SearchBarProps> = ({ keyword, onEnter, width = "100%" }) => {
  const { getText, i18nKeys } = useTranslation();
  const [searchString, setSearchString] = useState("");
  return (
    <div className="SearchBar" style={{ width: `${width}` }}>
      <IconButton sx={{ p: "5px" }}>
        <SearchIcon sx={{ color: "#000080" }} />
      </IconButton>
      <InputBase
        sx={{ width: "100%" }}
        placeholder={getText(i18nKeys.SEARCH_BAR__SEARCH)}
        inputProps={{ "aria-label": getText(i18nKeys.SEARCH_BAR__SEARCH_TERMS) }}
        defaultValue={keyword}
        onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
          if (event.key == "Enter") {
            onEnter(searchString);
          }
        }}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setSearchString(event.target.value.toLowerCase());
        }}
      />
      <IconButton
        type="button"
        sx={{ p: "5px" }}
        aria-label={getText(i18nKeys.SEARCH_BAR__SEARCH)}
        onClick={() => onEnter(searchString)}
      >
        <ArrowCircleRightIcon />
      </IconButton>
    </div>
  );
};

export default SearchBar;