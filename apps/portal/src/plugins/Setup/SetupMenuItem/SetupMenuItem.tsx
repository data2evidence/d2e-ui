import React, { FC } from "react";
import { Button } from "@portal/components";
import "./SetupMenuItem.scss";

interface SetupMenuItemProps {
  name: string;
  description?: string | React.ReactElement;
  notes?: string;
  onClick: () => void;
}

export const SetupMenuItem: FC<SetupMenuItemProps> = ({ name, description, notes, onClick }) => {
  return (
    <div className="setup-menu-item">
      <div className="setup-menu-item__info">
        <div className="setup-menu-item__title">{name}</div>
        {description && <div className="setup-menu-item__description">{description}</div>}
        {notes && <div className="setup-menu-item__notes">{notes}</div>}
      </div>
      <div className="setup-menu-item__action">
        <Button variant="primary" text="Configure" onClick={onClick} />
      </div>
    </div>
  );
};
