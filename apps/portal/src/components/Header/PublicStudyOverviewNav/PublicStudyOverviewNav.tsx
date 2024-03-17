import React, { FC, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { ChevronDownIcon, CheckmarkIcon } from "@portal/components";
import { config } from "../../../config";
import { Study } from "../../../types";
import { StudyInfoTab } from "../../../containers/researcher/Information/Information";
import { LocationState } from "../../../types";
import { useMenuAnchor, usePublicDatasets } from "../../../hooks";
import "../Header.scss";

const PublicStudyOverviewNav: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, openMenu, closeMenu] = useMenuAnchor();
  const [datasets] = usePublicDatasets();

  const handleDatasetClick = useCallback(
    (study: Study) => {
      navigate(`${config.ROUTES.public}/information`, {
        state: {
          studyId: study.id,
          tab: StudyInfoTab.DataInfo,
          tenantId: study.tenant.id,
        },
        replace: location.pathname === `${config.ROUTES.public}/information`,
      });
    },
    [navigate, location]
  );

  const isActiveTab = useCallback(
    (): string =>
      location.pathname === `${config.ROUTES.public}/information`
        ? "header__menu-overview header__menu-item--active"
        : "header__menu-overview",
    [location.pathname]
  );

  const isActiveDataset = useCallback(
    (studyId: string | undefined) => {
      const locationState = location.state as LocationState;
      return locationState?.studyId === studyId;
    },
    [location.state]
  );

  return (
    <li key="study-overview" onMouseEnter={openMenu} onMouseLeave={closeMenu} className={isActiveTab()}>
      <Link to={`${config.ROUTES.public}/overview`} data-text="Dataset overview" className="overview-title">
        Dataset overview
      </Link>
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
          {datasets?.map((study) => (
            <MenuItem key={study.id} onClick={() => handleDatasetClick(study)}>
              <div
                className={
                  isActiveDataset(study.id) ? "portal__menu-item portal__menu-item__is-active" : "portal__menu-item"
                }
              >
                {isActiveDataset(study.id) && <CheckmarkIcon className="active-menu-icon" />}
                <span data-text={study.studyDetail?.name || "Untitled"}>
                  {study.studyDetail?.name ? study.studyDetail?.name : "Untitled"}
                </span>
              </div>
            </MenuItem>
          ))}
        </div>
      </Menu>
    </li>
  );
};

export default PublicStudyOverviewNav;
