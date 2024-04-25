import React, { FC, useState } from "react";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { CollapsibleDrawer, MenuIcon, TermsOfUseIcon, PrivacyPolicyIcon, ImprintIcon } from "@portal/components";
import { LegalTab } from "../Legal";
import { useTranslation } from "../../../../contexts";

interface LegalMenuProps {
  activeTab: string;
  onClick: (value: string) => void;
}

const LegalMenu: FC<LegalMenuProps> = ({ activeTab, onClick }) => {
  const { getText, i18nKeys } = useTranslation();
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
            <ListItemText primary={getText(i18nKeys.LEGAL_MENU__MENU)} />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button onClick={() => onClick(LegalTab.TermsOfUse)} selected={activeTab === LegalTab.TermsOfUse}>
            <ListItemIcon>
              <TermsOfUseIcon />
            </ListItemIcon>
            <ListItemText primary={getText(i18nKeys.LEGAL_MENU__TERMS_OF_USE)} />
          </ListItem>

          <ListItem
            button
            onClick={() => onClick(LegalTab.PrivacyPolicy)}
            selected={activeTab === LegalTab.PrivacyPolicy}
          >
            <ListItemIcon>
              <PrivacyPolicyIcon />
            </ListItemIcon>
            <ListItemText primary={getText(i18nKeys.LEGAL_MENU__PRIVACY_POLICY)} />
          </ListItem>

          <ListItem button onClick={() => onClick(LegalTab.Imprint)} selected={activeTab === LegalTab.Imprint}>
            <ListItemIcon>
              <ImprintIcon />
            </ListItemIcon>
            <ListItemText primary={getText(i18nKeys.LEGAL_MENU__IMPRINT)} />
          </ListItem>
        </List>
      </div>
    </CollapsibleDrawer>
  );
};

export default LegalMenu;
