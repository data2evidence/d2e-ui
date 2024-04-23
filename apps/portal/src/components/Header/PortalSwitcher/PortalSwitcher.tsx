import React, { FC, useMemo } from "react";
import { Link } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { ChevronDownIcon, UserIcon } from "@portal/components";
import { useMenuAnchor } from "../../../hooks";
import { NavLink } from "../../../types";
import { useUserInfo } from "../../../contexts/UserContext";
import "../Header.scss";
import { useTranslation } from "../../../contexts";

interface PortalSwitcherProps {
  portalType: string;
}

const PortalSwitcher: FC<PortalSwitcherProps> = ({ portalType }) => {
  const { getText, i18nKeys } = useTranslation();
  const { user } = useUserInfo();
  const [anchorEl, openMenu, closeMenu] = useMenuAnchor();

  const SYSTEMADMIN = {
    id: "systemadmin",
    path: "/systemadmin",
    title: getText(i18nKeys.PORTAL_SWITCHER__ADMIN),
  };

  const RESEARCHER = {
    id: "researcher",
    path: "/researcher",
    title: getText(i18nKeys.PORTAL_SWITCHER__RESEARCHER),
  };

  function getPortalNavLink(portalType: string) {
    if (portalType === "systemadmin") {
      return SYSTEMADMIN;
    }
    return RESEARCHER;
  }
  const portalNavLink: NavLink = getPortalNavLink(portalType);

  const portalMenuItems = useMemo(() => {
    const menuItems: Array<NavLink> = [];

    if (user.canAccessSystemAdminPortal && portalType !== "systemadmin") {
      menuItems.push(SYSTEMADMIN);
    }
    if (user.canAccessResearcherPortal && portalType !== "researcher") {
      menuItems.push(RESEARCHER);
    }
    return menuItems;
  }, [portalType, user]);

  if (portalMenuItems.length === 0) {
    return null;
  }

  return (
    <div className="portal-switcher">
      <ul>
        <li
          key={portalNavLink.path}
          onMouseEnter={openMenu}
          onMouseLeave={closeMenu}
          data-testid="portal-switcher-many"
          className="header__portal-switcher"
        >
          <UserIcon />
          <Link to={portalNavLink.path} data-text={portalNavLink.title}>
            {portalNavLink.title}
          </Link>
          <ChevronDownIcon />
          <Menu
            className="portal__menu"
            elevation={5}
            // getContentAnchorEl={null}
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
              {portalMenuItems.map((link: NavLink) => (
                <MenuItem key={link.id} component={Link} to={link.path}>
                  <div className="portal__menu-item" data-testid="portal-switcher-item">
                    <span data-text={link.title}>{link.title}</span>
                  </div>
                </MenuItem>
              ))}
            </div>
          </Menu>
        </li>
      </ul>
    </div>
  );
};

export default PortalSwitcher;
