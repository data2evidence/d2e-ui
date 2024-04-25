import React, { FC, useState } from "react";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslation } from "../../../../../contexts";
interface SearchBarProps {
  keyword?: any;
  onEnter: (keyword: any) => void;
}

const SearchBar: FC<SearchBarProps> = ({ keyword, onEnter }) => {
  const { getText, i18nKeys } = useTranslation();
  const [searchString, setSearchString] = useState("");
  const fullWidthPx = 400;
  return (
    <div style={{ width: `${fullWidthPx}px`, maxHeight: "10%" }}>
      <div style={{ marginLeft: "10px", borderBottom: "1px solid lightgray", marginBottom: 5 }}>
        <InputBase
          sx={{ flex: 1, width: `${fullWidthPx - 45}px` }}
          placeholder="Search"
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
        <IconButton type="button" sx={{ p: "5px" }} aria-label="search" onClick={() => onEnter(searchString)}>
          <SearchIcon sx={{ color: "#000080" }} />
        </IconButton>
      </div>
    </div>
  );
};

export default SearchBar;
