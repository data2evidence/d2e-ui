import { Breadcrumbs, IconButton, Link, Menu, MenuItem } from "@mui/material";
import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { Link as RouterLink, useLocation } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import "./Navbar.scss";
import { DispatchType, useFlow } from "../contexts/FlowContext";

const MENU_ITEMS = [
  "New Mapping",
  "Open Mapping",
  "Save Mapping",
  "Convert Data",
  "Vocabulary",
  "Delete All Mappings",
];

const BREADCRUMBS_NAME_MAP: { [key: string]: string } = {
  "/link-fields": "Link Fields",
};

export const Navbar = () => {
  const { dispatch } = useFlow();
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClick = (menuName: string) => {
    if (menuName === "New Mapping") {
      dispatch({
        type: DispatchType.RESET_MAPPING,
      });
    }
    if (menuName === "Delete All Mappings") {
      dispatch({
        type: DispatchType.CLEAR_MAPPINGS,
      });
    }
    handleClose();
  };

  return (
    <div className="navbar">
      <div className="menu">
        <IconButton onClick={handleClick}>
          <MenuIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          {MENU_ITEMS.map((item) => (
            <MenuItem key={item} onClick={() => handleMenuClick(item)}>
              {item}
            </MenuItem>
          ))}
        </Menu>
      </div>

      <div className="breadcrumbs">
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
          {pathnames.length > 0 ? (
            <Link to="/" component={RouterLink} color="inherit">
              Link Tables
            </Link>
          ) : (
            <span>Link Tables</span>
          )}
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;

            return isLast ? (
              <span key={name}>{BREADCRUMBS_NAME_MAP[routeTo]}</span>
            ) : (
              <Link
                key={name}
                to={routeTo}
                component={RouterLink}
                color="inherit"
              >
                {name}
              </Link>
            );
          })}
        </Breadcrumbs>
      </div>
    </div>
  );
};
