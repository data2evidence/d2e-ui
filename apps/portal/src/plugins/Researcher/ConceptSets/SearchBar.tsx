import React, { FC, useState } from "react";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { ArrowcirclerightIcon } from "@portal/components";

interface SearchBarProps {
  keyword?: any;
  onEnter: (keyword: any) => void;
}

const SearchBar: FC<SearchBarProps> = ({ keyword, onEnter }) => {
  const [searchString, setSearchString] = useState("");
  const fullWidthPx = 860;
  return (
    <div style={{ width: `${fullWidthPx}px `, maxHeight: "10%" }}>
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
          placeholder="Search"
          inputProps={{ "aria-label": "search terms" }}
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
          <ArrowcirclerightIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default SearchBar;
