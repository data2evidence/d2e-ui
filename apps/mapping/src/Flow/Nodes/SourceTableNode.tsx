import { Button } from "@mui/material";
import React from "react";
import "./node.scss";

const SourceTableNode = () => {
  return (
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
  );
};

export default SourceTableNode;
