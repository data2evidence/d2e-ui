import React, { FC, useState } from "react";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { CollapsibleDrawer, MenuIcon } from "@portal/components";
import { SuperAdminPlugins } from "../../SuperAdmin";
import SideDropdown from "../../../shared/SideDropDown/SideDropdown";
import { sortPluginsByType } from "../../../../utils";
interface ConfigurationProps {
  activeTab: string;
  handleTabChange: (value: string) => void;
}

const ConfigurationMenu: FC<ConfigurationProps> = ({ activeTab, handleTabChange }) => {
  const [open, setOpen] = useState(true);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <CollapsibleDrawer variant="permanent" open={open}>
      <div>
        <List>
          <ListItem button onClick={handleDrawerToggle}>
            <ListItemIcon>
              <MenuIcon />
            </ListItemIcon>
            <ListItemText primary="Menu" />
          </ListItem>
        </List>
        <Divider />
        <List>
          {sortPluginsByType(SuperAdminPlugins).map((item: any, index) => (
            <SideDropdown plugin={item} key={index} activeTab={activeTab} onClick={handleTabChange} open={open} />
          ))}
        </List>
      </div>
    </CollapsibleDrawer>
  );
};

export default ConfigurationMenu;
