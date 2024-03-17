import React, { FC, useState, useCallback } from "react";
import { SxProps } from "@mui/system";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import { CollapsibleDrawer, MenuIcon, StudyInformationIcon } from "@portal/components";
import { Study } from "../../../../types";

interface StudyMenuProps {
  activeStudy?: Study;
  activeTab: string;
  onClick: (value: string) => void;
}

const StudyInfoTab = {
  DataInfo: "data_info",
  DataExplore: "data_explore",
};

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

export const PublicStudyMenu: FC<StudyMenuProps> = ({ activeTab, onClick }) => {
  const [open, setOpen] = useState(true);

  const handleDrawerToggle = useCallback(() => {
    setOpen((open) => !open);
  }, []);

  return (
    <CollapsibleDrawer variant="permanent" open={open}>
      <div>
        <List sx={listStyles}>
          <Tooltip title={open ? "Collapse" : "Expand"} placement="right" arrow>
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
          <Tooltip title={open ? "" : "Dataset information"} placement="right" arrow>
            <ListItem
              button
              onClick={() => onClick(StudyInfoTab.DataInfo)}
              selected={activeTab === StudyInfoTab.DataInfo}
            >
              <ListItemIcon>
                <StudyInformationIcon />
              </ListItemIcon>
              <ListItemText primary="Dataset information" />
            </ListItem>
          </Tooltip>
        </List>
        <Divider />
      </div>
    </CollapsibleDrawer>
  );
};
