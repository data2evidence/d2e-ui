import React, { FC, useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { ChevronDownIcon } from "@portal/components";
import { useDialogHelper, useMenuAnchor } from "../../../hooks";
import { NavLink } from "../../../types";
import { config } from "../../../config";
import { ChangeMyPasswordDialog } from "./ChangeMyPasswordDialog/ChangeMyPasswordDialog";
import "../Header.scss";
import { useTranslation } from "../../../contexts";

interface AccountTabProps {
  portalType: string;
}

const ROUTES = {
  account: "account",
  logout: "/logout",
};

const AccountTab: FC<AccountTabProps> = ({ portalType }) => {
  const { getText, i18nKeys } = useTranslation();
  const [anchorEl, openMenu, closeMenu] = useMenuAnchor();
  const [showPwd, openPwdDialog, closePwdDialog] = useDialogHelper(false);
  const location = useLocation();

  const menuItems = [
    {
      id: "legal",
      path: ROUTES.account,
      title: getText(i18nKeys.ACCOUNT_TAB__MENU_ITEMS_LEGAL),
    },
    {
      id: "password",
      path: "",
      title: getText(i18nKeys.ACCOUNT_TAB__MENU_ITEMS_CHANGE_PASSWORD),
    },
    {
      id: "logout",
      path: ROUTES.logout,
      title: getText(i18nKeys.ACCOUNT_TAB__MENU_ITEMS_LOGOUT),
    },
  ];

  const getLink = useCallback(() => {
    if (portalType === "researcher") {
      return `${config.ROUTES.researcher}/${ROUTES.account}`;
    } else {
      return `${config.ROUTES.systemadmin}/${ROUTES.account}`;
    }
  }, [portalType]);

  const isActiveTab = useMemo(() => {
    if (location.pathname === getLink()) {
      return "header__menu-overview header__menu-item--active";
    } else {
      return "header__menu-overview";
    }
  }, [getLink, location.pathname]);

  return (
    <li onMouseEnter={openMenu} onMouseLeave={closeMenu} className={isActiveTab}>
      <Link to={getLink()}>{getText(i18nKeys.ACCOUNT_TAB__LINK)}</Link>
      <ChevronDownIcon />
      <Menu
        className="portal__menu"
        elevation={5}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        hideBackdrop={true}
        style={{ pointerEvents: "none" }}
      >
        <div className="portal__menu-content" onMouseLeave={closeMenu}>
          {menuItems.map((link: NavLink) =>
            link.id === "password" ? (
              <MenuItem key={link.id} onClick={openPwdDialog}>
                <div className="portal__menu-item">
                  <span data-text={link.title}>{link.title}</span>
                </div>
              </MenuItem>
            ) : (
              <MenuItem key={link.id} component={Link} to={link.path}>
                <div className="portal__menu-item">
                  <span data-text={link.title}>{link.title}</span>
                </div>
              </MenuItem>
            )
          )}
        </div>
      </Menu>
      <ChangeMyPasswordDialog open={showPwd} onClose={closePwdDialog} />
    </li>
  );
};

export default AccountTab;
