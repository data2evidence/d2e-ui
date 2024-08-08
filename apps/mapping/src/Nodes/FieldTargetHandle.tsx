import { useCallback, useState } from "react";
import { IconButton } from "@portal/components";
import { CGreyIcon, CActiveIcon, CommentIcon } from "@portal/components";
import { MappingHandle, MappingHandleProps } from "./MappingHandle";
import { ConstantValueDialog } from "../Field/components/ConstantValueDialog";
import { CommentDialog } from "../Field/components/CommentDialog";
import "./FieldTargetHandle.scss";

interface FieldTargetHandleProps extends MappingHandleProps {}

export const FieldTargetHandle = (props: FieldTargetHandleProps) => {
  const [isConstantDialogOpen, setIsConstantDialogOpen] = useState(false);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);

  const handleOpenConstantDialog = useCallback(() => {
    setIsConstantDialogOpen(true);
  }, []);

  const handleCloseConstantDialog = useCallback(() => {
    setIsConstantDialogOpen(false);
  }, []);

  const handleOpenCommentDialog = useCallback(() => {
    setIsCommentDialogOpen(true);
  }, []);

  const handleCloseCommentDialog = useCallback(() => {
    setIsCommentDialogOpen(false);
  }, []);

  return (
    <>
      <MappingHandle {...props} className="field-target-handle">
        <div className="field-target-handle__content">
          <IconButton
            startIcon={
              props.data.constantValue ? <CActiveIcon /> : <CGreyIcon />
            }
            size="small"
            disableRipple
            onClick={handleOpenConstantDialog}
          />
          <div className="field-target-handle__label">{props.data.label}</div>
          <IconButton
            startIcon={<CommentIcon />}
            size="small"
            disableRipple
            onClick={handleOpenCommentDialog}
          />
        </div>
      </MappingHandle>
      <ConstantValueDialog
        open={isConstantDialogOpen}
        onClose={handleCloseConstantDialog}
        handleId={props.id}
      />
      <CommentDialog
        open={isCommentDialogOpen}
        onClose={handleCloseCommentDialog}
        handleId={props.id}
      />
    </>
  );
};
