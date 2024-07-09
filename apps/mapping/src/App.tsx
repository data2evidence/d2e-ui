import { useState } from "react";
import "./App.css";
import { Navbar } from "./Navbar/Navbar";
import { Outlet } from "react-router-dom";
import { ReactFlowProvider } from "reactflow";
import { FlowProvider } from "./contexts/FlowContext";

function App() {
  return (
    <>
      <ReactFlowProvider>
        <FlowProvider>
          <Navbar />
          <div className="content-container">
            <Outlet />
          </div>
        </FlowProvider>
      </ReactFlowProvider>
    </>
  );
}

export default App;
