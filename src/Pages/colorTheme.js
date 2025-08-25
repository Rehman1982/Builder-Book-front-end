// theme.js
import { blue } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

const getDesignTokens = (mode) => ({
    palette: {
        mode,
        primary: {
            // main: "#1A73E8",
            main: blue[400],
            contrastText: "#ffffff",
        },
        secondary: {
            main: "#FFA726",
            contrastText: "#ffffff",
        },
        success: {
            main: "#2E7D32",
        },
        warning: {
            main: "#FB8C00",
        },
        error: {
            main: "#D32F2F",
        },
        info: {
            main: "#0288D1",
        },
        background: {
            default: mode === "light" ? "#F5F7FA" : "#121212",
            paper: mode === "light" ? "#ffffff" : "#1E1E1E",
        },
        text: {
            primary: mode === "light" ? "#263238" : "#ffffff",
            secondary: mode === "light" ? "#546E7A" : "#B0BEC5",
        },
    },
    typography: {
        fontFamily: `'Poppins', 'Roboto', 'Helvetica', 'Arial', sans-serif`,
        h5: {
            fontWeight: 600,
            color: mode === "light" ? "#1A237E" : "#90CAF9",
        },
        subtitle1: {
            fontWeight: 500,
        },
        body2: {
            fontSize: "0.875rem",
            color: mode === "light" ? "#607D8B" : "#B0BEC5",
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: "none",
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow:
                        mode === "light"
                            ? "0px 2px 8px rgba(0, 0, 0, 0.05)"
                            : "0px 2px 8px rgba(255, 255, 255, 0.1)",
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                rounded: {
                    borderRadius: 16,
                },
            },
        },
    },
});

const theme = (mode = "light") => createTheme(getDesignTokens(mode));

export default theme;
