import { Outlet } from "react-router-dom";
import { ReactFlowProvider } from "reactflow";
import { ThemeProvider } from "@mui/material";
import { AppProvider } from "./contexts/AppContext";
import { Navbar } from "./Navbar/Navbar";
import { theme } from "./theme/theme";
import "./App.css";

function App() {
  return (
    <>
      <ReactFlowProvider>
        <ThemeProvider theme={theme}>
          <AppProvider>
            <Navbar />
            <div className="content-container">
              <Outlet />
            </div>
          </AppProvider>
        </ThemeProvider>
      </ReactFlowProvider>
    </>
  );
}

export default App;
