import { Breadcrumbs, IconButton, Link, Menu, MenuItem } from "@mui/material";
import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { Link as RouterLink } from "react-router-dom";
import "./Navbar.scss";

const MENU_ITEMS = [
  "New Mapping",
  "Open Mapping",
  "Save Mapping",
  "Convert Data",
  "Vocabulary",
  "Delete All Mappings",
];

export const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className="navbar">
      <div className="menu">
        <IconButton onClick={handleClick}>
          <MenuIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          {MENU_ITEMS.map((item) => (
            <MenuItem key={item} onClick={handleClose}>
              {item}
            </MenuItem>
          ))}
        </Menu>
      </div>

      <div className="breadcrumbs">
        <Breadcrumbs>
          <Link to="/" component={RouterLink} underline="hover" color="inherit">
            Link Tables
          </Link>
        </Breadcrumbs>
      </div>
    </div>
  );
};
