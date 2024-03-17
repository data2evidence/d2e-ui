import React, { FC, useState } from "react";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { CollapsibleDrawer, MenuIcon, TermsOfUseIcon, PrivacyPolicyIcon, ImprintIcon } from "@portal/components";
import { LegalTab } from "../Legal";

interface LegalMenuProps {
  activeTab: string;
  onClick: (value: string) => void;
}

const LegalMenu: FC<LegalMenuProps> = ({ activeTab, onClick }) => {
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
          <ListItem button onClick={() => onClick(LegalTab.TermsOfUse)} selected={activeTab === LegalTab.TermsOfUse}>
            <ListItemIcon>
              <TermsOfUseIcon />
            </ListItemIcon>
            <ListItemText primary="Terms of Use" />
          </ListItem>

          <ListItem
            button
            onClick={() => onClick(LegalTab.PrivacyPolicy)}
            selected={activeTab === LegalTab.PrivacyPolicy}
          >
            <ListItemIcon>
              <PrivacyPolicyIcon />
            </ListItemIcon>
            <ListItemText primary="Privacy Policy" />
          </ListItem>

          <ListItem button onClick={() => onClick(LegalTab.Imprint)} selected={activeTab === LegalTab.Imprint}>
            <ListItemIcon>
              <ImprintIcon />
            </ListItemIcon>
            <ListItemText primary="Imprint" />
          </ListItem>
        </List>
      </div>
    </CollapsibleDrawer>
  );
};

export default LegalMenu;
