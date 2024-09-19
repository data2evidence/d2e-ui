import React, { useCallback, useRef, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { useApp } from "../../contexts";
import { CloseDialogType, SaveMappingDialog } from "../SaveMappingDialog/SaveMappingDialog";
import { SelectVocabDatasetDialog } from "../SelectVocabDatasetDialog/SelectVocabDatasetDialog";
import { TerminologyProps } from "../../types/vocabSearchDialog";
import "./MenuButton.scss";

const MENU_ITEMS = [
  "New Mapping",
  "Open Mapping",
  "Save Mapping",
  "Open Vocabulary Search",
  "Change Vocabulary Dataset",
  "Delete All Mappings",
];

export const MenuButton = () => {
  const { reset, load, clearHandles, state } = useApp();
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isSelectDatasetDialogOpen, setIsDatasetSelectionDialogOpen] = useState(false);
  const [nextAction, setNextAction] = useState<string | undefined>();
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleOpenSaveDialog = useCallback((nextAction?: string) => {
    setNextAction(nextAction);
    setIsSaveDialogOpen(true);
  }, []);

  const handleSelectFile = useCallback(() => {
    hiddenFileInput.current && hiddenFileInput.current.click();
  }, []);

  const handleFileUpload = useCallback(
    (event: any) => {
      const files = Array.from(event.target.files).map((file: any) => file);
      if (files.length >= 1) {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = () => {
          const jsonData = reader.result as string;

          try {
            const json = JSON.parse(jsonData);
            console.log("JSON content:", json);
            load(json);
            navigate("");
            window.location.reload();
          } catch (err) {
            console.error("Error parsing JSON:", err);
          }
        };
        reader.readAsText(file);
      }
    },
    [load, navigate]
  );

  const handleCloseSaveDialog = useCallback(
    (type: CloseDialogType, nextAction?: string) => {
      setIsSaveDialogOpen(false);

      if (type === "success") {
        if (nextAction === "open-mapping") {
          handleSelectFile();
        }
      }
    },
    [handleSelectFile]
  );

  const handleOpenDatasetSelectDialog = useCallback(() => {
    setIsDatasetSelectionDialogOpen(true);
  }, []);

  const handleCloseDatasetSelectionDialog = useCallback(() => {
    setIsDatasetSelectionDialogOpen(false);
  }, []);

  const handleOpenVocabularySearch = useCallback(() => {
    const event = new CustomEvent<{ props: TerminologyProps }>("alp-terminology-open", {
      detail: {
        props: {
          mode: "CONCEPT_SEARCH",
          selectedDatasetId: state.datasetSelected,
          onClose: (onCloseValues) => {
            // No action to do if no concept set is being created
            if (!onCloseValues?.currentConceptSet) {
              return;
            }
          },
        },
      },
    });
    window.dispatchEvent(event);
  }, [state.datasetSelected]);

  const handleMenuClick = useCallback(
    (menuName: string) => {
      if (menuName === "New Mapping") {
        reset();
      } else if (menuName === "Delete All Mappings") {
        clearHandles();
      } else if (menuName === "Save Mapping") {
        handleOpenSaveDialog();
      } else if (menuName === "Open Mapping") {
        if (!state.saved) {
          handleOpenSaveDialog("open-mapping");
        } else {
          handleSelectFile();
        }
      } else if (menuName === "Change Vocabulary Dataset") {
        handleOpenDatasetSelectDialog();
      } else if (menuName === "Open Vocabulary Search") {
        if (!state.datasetSelected) {
          handleOpenDatasetSelectDialog();
        } else {
          handleOpenVocabularySearch();
        }
      }

      handleClose();
    },
    [reset, clearHandles, handleOpenSaveDialog, handleSelectFile, handleClose, state.saved, state.datasetSelected]
  );

  return (
    <div className="menu-button">
      <div className="menu">
        <IconButton onClick={handleClick}>
          <MenuIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          {MENU_ITEMS.map((item) => (
            <MenuItem key={item} onClick={() => handleMenuClick(item)}>
              {item}
            </MenuItem>
          ))}
        </Menu>
      </div>
      <SaveMappingDialog open={isSaveDialogOpen} nextAction={nextAction} onClose={handleCloseSaveDialog} />
      <SelectVocabDatasetDialog open={isSelectDatasetDialogOpen} onClose={handleCloseDatasetSelectionDialog} />
      <input
        ref={hiddenFileInput}
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        onClick={(event) => {
          (event.target as any).value = null;
        }}
        style={{ display: "none" }}
        id="open-mapping-json"
      />
    </div>
  );
};
