import { Button } from "@mui/material";
import React from "react";
import "./node.scss";

const TargetTableNode = () => {
  return (
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
  );
};

export default TargetTableNode;
