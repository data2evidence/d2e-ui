import React, { useCallback, useRef, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { Breadcrumbs, IconButton, Link, Menu, MenuItem } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useApp } from "../contexts";
import { CloseDialogType, SaveMappingDialog } from "../components/SaveMappingDialog/SaveMappingDialog";
import { SelectVocabDatasetDialog } from "../components/SelectVocabDatasetDialog/SelectVocabDatasetDialog";
import { TerminologyProps } from "../types/vocabSearchDialog";
import "./Navbar.scss";

const MENU_ITEMS = [
  "New Mapping",
  "Open Mapping",
  "Save Mapping",
  "Convert Data",
  "Open Vocabulary Search",
  "Change Vocabulary Dataset",
  "Delete All Mappings",
];

const BREADCRUMBS_NAME_MAP: { [key: string]: string } = {
  "/link-fields": "Link Fields",
};

export const Navbar = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const { reset, load, clearHandles, saved, datasetSelected } = useApp();
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
          selectedDatasetId: datasetSelected,
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
  }, [datasetSelected]);

  const handleMenuClick = useCallback(
    (menuName: string) => {
      if (menuName === "New Mapping") {
        reset();
      } else if (menuName === "Delete All Mappings") {
        clearHandles();
      } else if (menuName === "Save Mapping") {
        handleOpenSaveDialog();
      } else if (menuName === "Open Mapping") {
        if (!saved) {
          handleOpenSaveDialog("open-mapping");
        } else {
          handleSelectFile();
        }
      } else if (menuName === "Change Vocabulary Dataset") {
        handleOpenDatasetSelectDialog();
      } else if (menuName === "Open Vocabulary Search") {
        console.log(`IsDatasetSelected: ${datasetSelected}`);
        if (!datasetSelected) {
          handleOpenDatasetSelectDialog();
        } else {
          handleOpenVocabularySearch();
        }
      }

      handleClose();
    },
    [reset, clearHandles, handleOpenSaveDialog, handleSelectFile, handleClose, saved]
  );

  return (
    <div className="navbar">
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

      <div className="breadcrumbs">
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
          {pathnames.length > 0 ? (
            <Link to="/" component={RouterLink} color="inherit">
              Link Tables
            </Link>
          ) : (
            <span>Link Tables</span>
          )}
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;

            return isLast ? (
              <span key={name}>{BREADCRUMBS_NAME_MAP[routeTo]}</span>
            ) : (
              <Link key={name} to={routeTo} component={RouterLink} color="inherit">
                {name}
              </Link>
            );
          })}
        </Breadcrumbs>
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
