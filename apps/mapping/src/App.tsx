import { useState } from "react";
import "./App.css";
import { Navbar } from "./Navbar/Navbar";
import { Outlet } from "react-router-dom";
import { ReactFlowProvider } from "reactflow";

function App() {
  return (
    <>
      <ReactFlowProvider>
        <Navbar />
        <div className="content-container">
          <Outlet />
        </div>
      </ReactFlowProvider>
    </>
  );
}

export default App;
