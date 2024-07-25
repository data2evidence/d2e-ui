import { Outlet } from "react-router-dom";
import { ReactFlowProvider } from "reactflow";
import { ThemeProvider } from "@mui/material";
import { FlowProvider } from "./contexts/FlowContext";
import { Navbar } from "./Navbar/Navbar";
import { theme } from "./theme/theme";
import "./App.css";

function App() {
  return (
    <>
      <ReactFlowProvider>
        <ThemeProvider theme={theme}>
          <FlowProvider>
            <Navbar />
            <div className="content-container">
              <Outlet />
            </div>
          </FlowProvider>
        </ThemeProvider>
      </ReactFlowProvider>
    </>
  );
}

export default App;
