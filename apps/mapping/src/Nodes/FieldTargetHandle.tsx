import { useCallback, useState } from "react";
import { CGreyIcon, CActiveIcon, CommentIcon, IconButton, TActiveIcon, TGreyIcon } from "@portal/components";
import { MappingHandle, MappingHandleProps } from "./MappingHandle";
import { TransformConfigDialog } from "../Field/components/TransformConfigDialog";
import { ConstantValueDialog } from "../Field/components/ConstantValueDialog";
import { CommentDialog } from "../Field/components/CommentDialog";
import "./FieldTargetHandle.scss";

interface FieldTargetHandleProps extends MappingHandleProps {}

export const FieldTargetHandle = (props: FieldTargetHandleProps) => {
  const [isTransformDialogOpen, setIsTransformDialogOpen] = useState(false);
  const [isConstantDialogOpen, setIsConstantDialogOpen] = useState(false);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);

  const handleOpenTransformDialog = useCallback(() => {
    setIsTransformDialogOpen(true);
  }, [props]);

  const handleCloseTransformDialog = useCallback(() => {
    setIsTransformDialogOpen(false);
  }, []);

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
          <div>
            <IconButton
              startIcon={props.data.isSqlEnabled || props.data.isLookupEnabled ? <TActiveIcon /> : <TGreyIcon />}
              size="small"
              disableRipple
              onClick={handleOpenTransformDialog}
            />
            <IconButton
              startIcon={props.data.constantValue ? <CActiveIcon /> : <CGreyIcon />}
              size="small"
              disableRipple
              onClick={handleOpenConstantDialog}
            />
          </div>
          <div className="field-target-handle__label">{props.data.label}</div>
          <div className="field-target-handle__column-type">{props.data.columnType}</div>
          <IconButton
            startIcon={<CommentIcon width={16} height={16} />}
            size="small"
            disableRipple
            onClick={handleOpenCommentDialog}
          />
        </div>
      </MappingHandle>
      <TransformConfigDialog open={isTransformDialogOpen} onClose={handleCloseTransformDialog} handleId={props.id} />
      <ConstantValueDialog open={isConstantDialogOpen} onClose={handleCloseConstantDialog} handleId={props.id} />
      <CommentDialog open={isCommentDialogOpen} onClose={handleCloseCommentDialog} handleId={props.id} />
    </>
  );
};
