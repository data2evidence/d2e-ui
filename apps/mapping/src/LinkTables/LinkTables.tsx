import React from "react";
import "./LinkTables.scss";
import { Button, IconButton } from "@mui/material";
import { ManageSearch } from "@mui/icons-material";

export const LinkTables = () => {
  return (
    <div className="link-tables">
      <div className="link-tables__content">
        <div className="link-tables__column">
          <h3>Source columns</h3>
          <div className="content-container"></div>
        </div>
        <div className="link-tables__column">
          <h3>Source tables</h3>
          <div className="content-container">
            <div className="action-container">
              <div className="description">
                Please load New Report to see Source tables
              </div>
              <div className="button-group">
                <Button variant="contained" fullWidth>
                  Load New Report
                </Button>
                <Button variant="contained" fullWidth>
                  Scan Data
                </Button>
                <Button variant="contained" fullWidth>
                  Open Mapping
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="link-tables__column">
          <h3>Target tables</h3>
          <div className="content-container">
            <div className="action-container">
              <div className="description">
                Please select CDM version to see Target tables
              </div>
              <div className="button-group">
                <Button variant="contained" fullWidth>
                  Version 6
                </Button>
                <Button variant="contained" fullWidth>
                  Version 5.3.1
                </Button>
                <Button variant="contained" fullWidth>
                  Select Other Version
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="link-tables__footer">
        <IconButton>
          <ManageSearch />
        </IconButton>

        <div className="button-group">
          <Button variant="contained" disabled>
            Delete mapping
          </Button>
          <Button variant="contained" disabled>
            Go to link fields
          </Button>
        </div>
      </div>
    </div>
  );
};
