import React, { FC, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { config } from "../../config";
import { NavLink } from "../../types";
import MenuTab from "./MenuTab/MenuTab";
import "./Header.scss";

interface HeaderProps {
  nav: NavLink[];
  portalType: string;
}

export const Header: FC<HeaderProps> = (props: HeaderProps) => {
  const location = useLocation();

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
      <div className="header__title"> {config.APP_TITLE} </div>
      <div className="header__menu-group">
        <ul data-testid="nav">
          {props.nav.map((link: NavLink) => {
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
        </ul>
      </div>
    </header>
  );
};
