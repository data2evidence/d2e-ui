import React, { FC, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { IPlugin, NavLink, Plugins } from "../../types";
import PortalSwitcher from "./PortalSwitcher/PortalSwitcher";
import MenuTab from "./MenuTab/MenuTab";
import PublicStudyOverviewNav from "./PublicStudyOverviewNav/PublicStudyOverviewNav";
import MenuNav, { MenuType } from "./MenuNav/MenuNav";
import { isAuthenticated } from "../../containers/auth";
import AccountTab from "./AccountTab/AccountTab";
import env from "../../env";
import "./Header.scss";

interface HeaderProps {
  nav?: NavLink[];
  portalType: string;
  plugins?: IPlugin;
  systemAdminPlugins?: Plugins[];
}

export const Header: FC<HeaderProps> = ({ nav, portalType, plugins, systemAdminPlugins }) => {
  const location = useLocation();
  const isAuth = isAuthenticated();

  const getClassNames = useCallback(
    (link: NavLink): string =>
      link.path === location.pathname ||
      link.subpaths?.includes(location.pathname) ||
      link.submenu?.some((path) => path.path === location.pathname)
        ? "header__menu-item--active"
        : "",
    [location.pathname]
  );

  return (
    <header className="portal__header" data-testid="header">
      <div className="header__logo-group header__menu-group">
        <img alt="Data2Evidence" className="logo" src={`${env.PUBLIC_URL}/d2e.png`} height="30" />
        {isAuth && <PortalSwitcher portalType={portalType} />}
      </div>

      <div className="header__menu-group">
        <ul data-testid="nav">
          {portalType === "public" && <PublicStudyOverviewNav />}
          {isAuth && portalType === "researcher" && plugins && (
            <>
              <MenuNav type={MenuType.Dataset} />
              {plugins.researcher.map((plugin) => (
                <MenuNav type={MenuType.Plugin} plugin={plugin} key={plugin.name} />
              ))}
            </>
          )}

          {isAuth && portalType === "systemadmin" && systemAdminPlugins && (
            <>
              {systemAdminPlugins.map((plugin) => (
                <MenuNav type={MenuType.Plugin} plugin={plugin} isSysAdmin={true} key={plugin.name} />
              ))}
            </>
          )}

          {nav &&
            nav.map((link: NavLink) => {
              if (link.submenu) {
                // Navigation with onhover submenu
                if (link.submenu?.length !== 0) {
                  return <MenuTab key={link.id} link={link} className={getClassNames(link)} />;
                }
              } else {
                // Clickable navigation. The behavior depends on the path value
                return (
                  <li key={link.id} className={getClassNames(link)}>
                    {link.path.indexOf("http://") === 0 || link.path.indexOf("https://") === 0 ? (
                      <a href={link.path} target="_blank" rel="noopener noreferrer" data-text={link.title}>
                        {link.title}
                      </a>
                    ) : (
                      <Link to={link.path} data-text={link.title}>
                        {link.title}
                      </Link>
                    )}
                  </li>
                );
              }
              return "";
            })}

          {portalType !== "public" && <AccountTab portalType={portalType} />}
        </ul>
      </div>
    </header>
  );
};
