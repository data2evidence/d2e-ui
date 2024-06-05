import React, { FC } from "react";
import { Button } from "@portal/components";
import "./PluginMenuItem.scss";
import { useTranslation } from "../../../contexts";

interface PluginMenuItemProps {
  name: string;
  description?: string | React.ReactElement;
  notes?: string;
  onClick: () => void;
}

export const PluginMenuItem: FC<PluginMenuItemProps> = ({ name, description, notes, onClick }) => {
  const { getText, i18nKeys } = useTranslation();
  return (
    <div className="plugin-menu-item">
      <div className="plugin-menu-item__info">
        <div className="plugin-menu-item__title">{name}</div>
        {description && <div className="plugin-menu-item__description">{description}</div>}
        {notes && <div className="plugin-menu-item__notes">{notes}</div>}
      </div>
      <div className="plugin-menu-item__action">
        <Button text={getText(i18nKeys.SETUP_MENU_ITEM__INSTALL)} onClick={onClick} />
      </div>
    </div>
  );
};
