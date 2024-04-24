import React, { FC, useState } from "react";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { ArrowcirclerightIcon } from "@portal/components";
import { useTranslation } from "../../contexts";
interface SearchBarProps {
  keyword?: any;
  onEnter: (keyword: any) => void;
  width?: Number;
}

const SearchBar: FC<SearchBarProps> = ({ keyword, onEnter, width = 480 }) => {
  const { getText, i18nKeys } = useTranslation();
  const [searchString, setSearchString] = useState("");
  return (
    <div style={{ width: `${width}px `, maxHeight: "40px" }}>
      <div
        style={{
          marginLeft: "10px",
          border: "1px solid lightgray",
          borderRadius: 32,
          marginBottom: 5,
          paddingLeft: "10px",
          display: "flex",
        }}
      >
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
          <ArrowcirclerightIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default SearchBar;
