import React, { FC, useCallback } from "react";
import { Button, Tooltip } from "@portal/components";
import { dispatch } from "~/store";
import { setAddGroupDialog } from "~/features/flow/reducers";

export interface CreateGroupButtonProps {}

export const CreateGroupButton: FC<CreateGroupButtonProps> = () => {
  const handleClick = useCallback(() => {
    dispatch(setAddGroupDialog({ visible: true }));
    console.log("Clicked")
  }, []);

  return (
    <Tooltip title="Create new subflow">
      <div>
        <Button variant="secondary" text="Create subflow" onClick={handleClick} />
      </div>
    </Tooltip>
  );
};
