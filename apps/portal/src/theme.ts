import { createTheme } from "@mui/material";

export const theme = createTheme({
  typography: {
    fontFamily:
      'GT-America, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  palette: {
    text: {
      primary: "#000080",
    },
    primary: {
      main: "#000080",
    },
  },
  components: {
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:nth-of-type(even)": {
            backgroundColor: "#ebf1f8",
          },
        },
        head: {
          backgroundColor: "#ebf1f8",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: "#ebf1f8",
          fontSize: 16,
          fontWeight: 500,
          color: "#000080",
        },
        body: {
          fontSize: 16,
          color: "#555555",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});
