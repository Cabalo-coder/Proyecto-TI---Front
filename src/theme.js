import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#3d5a80",
      dark: "#293241",
      light: "#98c1d9",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ee6c4d",
      light: "#f28d73",
      dark: "#d65a39",
      contrastText: "#ffffff",
    },
    info: {
      main: "#98c1d9",
    },
    success: {
      main: "#2f855a",
    },
    background: {
      default: "#e0fbfc",
      paper: "rgba(255,255,255,0.82)",
    },
    text: {
      primary: "#293241",
      secondary: "#5d677b",
    },
    divider: "rgba(61, 90, 128, 0.16)",
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily:
      '"Segoe UI Variable", "Segoe UI", "Inter", "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 800 },
    h4: { fontWeight: 800 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: {
      textTransform: "none",
      fontWeight: 700,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage:
            "radial-gradient(circle at top left, rgba(152,193,217,0.45), transparent 35%), radial-gradient(circle at bottom right, rgba(238,108,77,0.18), transparent 32%), linear-gradient(180deg, #e0fbfc 0%, #edf6f9 100%)",
          minHeight: "100vh",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 18,
          boxShadow: "none",
          transition: "transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease",
        },
        contained: {
          boxShadow: "0 10px 24px rgba(61, 90, 128, 0.18)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.6)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 18px 42px rgba(41, 50, 65, 0.10)",
          transition: "transform 220ms ease, box-shadow 220ms ease",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          backgroundColor: "rgba(255,255,255,0.72)",
          transition: "transform 180ms ease, box-shadow 180ms ease",
        },
        notchedOutline: {
          borderColor: "rgba(61, 90, 128, 0.20)",
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: "none",
          background: "transparent",
        },
        columnHeaders: {
          backgroundColor: "rgba(61,90,128,0.08)",
          borderBottom: "none",
        },
        row: {
          transition: "background-color 180ms ease",
        },
      },
    },
  },
});