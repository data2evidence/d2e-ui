import React, { FC, useEffect, useCallback, useMemo } from "react";
import { SxProps } from "@mui/system";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import { CollapsibleDrawer, MenuIcon, StudyInformationIcon } from "@portal/components";
import { isDrawerOpenVar } from "../../../../apollo";
import { Study } from "../../../../types";
import { UserInfo } from "../../../../contexts/UserContext";
import { Roles } from "../../../../config";
import { loadPlugins } from "../../../../utils";
import { IPluginItem, PluginDropdown } from "../../../../types";
import { useEnabledFeatures } from "../../../../hooks";
import SideDropdown from "../../../shared/SideDropDown/SideDropdown";

interface StudyMenuProps {
  user: UserInfo;
  activeTab: string;
  handleTabChange: (value: string) => void;
  activeStudy?: Study;
  pluginDropdown?: PluginDropdown;
  isStudyMenuOpen: boolean;
  setIsStudyMenuOpen: (value: boolean) => void;
}

const plugins = loadPlugins();

const listStyles: SxProps = {
  color: "var(--color-primary)",
  ".MuiListItem-gutters": {
    padding: "8px 20px",
  },
  ".MuiListItem-button": {
    "&.Mui-selected": {
      backgroundColor: "#ebf2fa",
      ".MuiTypography-root": {
        fontWeight: "500",
        whiteSpace: "nowrap",
      },
      "&:hover": {
        backgroundColor: "#ebf2fa",
      },
    },
    "&:hover": {
      backgroundColor: "#ebf2fa",
      ".MuiTypography-root": {
        fontWeight: "500",
      },
    },
  },
};

export const StudyInfoTab = {
  DataInfo: "data_info",
  DataExplore: "data_explore",
};

export const StudyMenu: FC<StudyMenuProps> = ({
  user,
  activeTab,
  handleTabChange,
  activeStudy,
  pluginDropdown,
  isStudyMenuOpen,
  setIsStudyMenuOpen,
}) => {
  const studyId = activeStudy?.id || "";
  const featureFlags = useEnabledFeatures();

  const getSubmenus = useCallback(
    (plugin: IPluginItem) => {
      if (pluginDropdown) {
        const pluginDropdownKeys = Object.keys(pluginDropdown);
        if (pluginDropdownKeys.includes(plugin.route)) {
          return pluginDropdown[plugin.route];
        }
      }
    },
    [pluginDropdown]
  );

  const handleDrawerToggle = () => {
    setIsStudyMenuOpen(!isStudyMenuOpen);
  };

  useEffect(() => {
    isDrawerOpenVar(isStudyMenuOpen);

    const studyMenuEvent = new CustomEvent("studyMenuEvent", {
      detail: {
        isStudyMenuOpen: isStudyMenuOpen,
      },
    });

    window.dispatchEvent(studyMenuEvent);
  }, [isStudyMenuOpen]);

  const showPlugin: { [key: string]: boolean } = useMemo(
    () =>
      plugins.researcher.reduce((accObj, plugin) => {
        let allowed = (plugin.requiredRoles?.length || 0) === 0;
        if (!allowed && plugin.requiredRoles) {
          for (const role of plugin.requiredRoles) {
            if (role === Roles.STUDY_RESEARCHER) {
              allowed = allowed || user.isStudyResearcher(studyId);
            }
          }
        }

        if (allowed) {
          const hasFeature = featureFlags.includes(plugin.featureFlag || "");
          return {
            ...accObj,
            [plugin.name]: hasFeature,
          };
        }

        return accObj;
      }, {}),
    [featureFlags, studyId, user]
  );

  return (
    <CollapsibleDrawer variant="permanent" open={isStudyMenuOpen}>
      <div>
        <List sx={listStyles}>
          <Tooltip title={isStudyMenuOpen ? "Collapse" : "Expand"} placement="right" arrow>
            <ListItem button onClick={handleDrawerToggle}>
              <ListItemIcon>
                <MenuIcon />
              </ListItemIcon>
              <ListItemText primary="Menu" />
            </ListItem>
          </Tooltip>
        </List>
        <Divider />
        <List sx={listStyles}>
          <Tooltip title={isStudyMenuOpen ? "" : "Dataset information"} placement="right" arrow>
            <ListItem
              button
              onClick={() => handleTabChange(StudyInfoTab.DataInfo)}
              selected={activeTab === StudyInfoTab.DataInfo}
            >
              <ListItemIcon>
                <StudyInformationIcon />
              </ListItemIcon>
              <ListItemText primary="Dataset information" />
            </ListItem>
          </Tooltip>

          {plugins.researcher.map(
            (item: IPluginItem) =>
              showPlugin[item.name] && (
                <SideDropdown
                  plugin={item}
                  key={item.route}
                  activeTab={activeTab}
                  onClick={handleTabChange}
                  open={isStudyMenuOpen}
                  submenus={getSubmenus(item)}
                />
              )
          )}
        </List>
        <Divider />
      </div>
    </CollapsibleDrawer>
  );
};
