import React, { FC, useState, useCallback, useEffect } from "react";
import { SxProps } from "@mui/system";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import { SettingsGearIcon as DefaultIcon, ChevronUpIcon, ChevronDownIcon } from "@portal/components";
import { Plugins, IPluginItem } from "../../../types";
import env from "../../../env";

interface SideDropdownProps {
  activeTab: string;
  onClick: (value: string) => void;
  plugin: Plugins;
  open: boolean;
}

const listItemTextStyles: SxProps = {
  ".MuiTypography-root": {
    fontSize: 14,
  },
};

const SideDropdown: FC<SideDropdownProps> = ({ activeTab, onClick, plugin, open }) => {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!open) {
      setExpanded(false);
    }
  }, [open]);

  const handleExpand = useCallback(() => {
    open ? setExpanded(!expanded) : setExpanded(false);
  }, [expanded, open]);

  if (plugin.children) {
    return (
      <>
        <ListItem
          button
          onClick={handleExpand}
          selected={plugin.children.some((s: IPluginItem) => s.route === activeTab) && !expanded}
        >
          <ListItemIcon>
            {plugin.iconUrl ? (
              <img
                src={
                  plugin.iconUrl.startsWith("http://") || plugin.iconUrl.startsWith("https://")
                    ? plugin.iconUrl
                    : `${env.PUBLIC_URL.endsWith("/") ? env.PUBLIC_URL : `${env.PUBLIC_URL}/`}${plugin.iconUrl}`
                }
                alt={plugin.name}
                width={plugin.iconSize}
                height={plugin.iconSize}
              />
            ) : (
              <DefaultIcon />
            )}
          </ListItemIcon>
          <ListItemText primary={plugin.name} />
          {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </ListItem>
        <Collapse in={expanded} unmountOnExit>
          <List>
            <div className="config_list">
              {plugin.children.map((item: any) => (
                <Tooltip title={open ? "" : item.name} placement="right" arrow key={item.route}>
                  <ListItem
                    button
                    key={item.route}
                    style={{ width: "14.5em" }}
                    onClick={() => onClick(item.route)}
                    selected={activeTab === item.route}
                    className="config_list_item"
                  >
                    {activeTab === item.route ? <span className="config_list_span">•</span> : <span>&nbsp;</span>}
                    <ListItemText primary={item.name} sx={listItemTextStyles} />
                  </ListItem>
                </Tooltip>
              ))}
            </div>
          </List>
        </Collapse>
      </>
    );
  } else
    return (
      <Tooltip title={open ? "" : plugin.name} placement="right" arrow key={plugin.route}>
        <ListItem button key={plugin.route} onClick={() => onClick(plugin.route)} selected={activeTab === plugin.route}>
          <ListItemIcon>
            {plugin.iconUrl ? (
              <img
                src={
                  plugin.iconUrl.startsWith("http://") || plugin.iconUrl.startsWith("https://")
                    ? plugin.iconUrl
                    : `${env.PUBLIC_URL.endsWith("/") ? env.PUBLIC_URL : `${env.PUBLIC_URL}/`}${plugin.iconUrl}`
                }
                alt={plugin.name}
                width={plugin.iconSize}
                height={plugin.iconSize}
              />
            ) : (
              <DefaultIcon />
            )}
          </ListItemIcon>
          <ListItemText style={{ whiteSpace: "break-spaces" }} primary={plugin.name} />
        </ListItem>
      </Tooltip>
    );
};

export default SideDropdown;
