import { createTheme, responsiveFontSizes } from "@mui/material/styles";

// Define your custom typography
const typography = {
    h1: { fontSize: "3rem" },
};

// Define your custom color palette
const palette = {
    primary: {
        main: "#65AFFF", // Blue
        contrastText: "#E6EDF0", // White
    },
    secondary: {
        main: "#6C757D", // Gray
        contrastText: "#FFFFFF",
    },
    success: {
        main: "#28A745",
    },
    error: {
        main: "#DC3545",
    },
    warning: {
        main: "#FFC107",
    },
    info: {
        main: "#17A2B8",
    },
    background: {
        default: "#E6EDF0",
        paper: "#FFFFFF",
    },
    text: {
        primary: "#000000", // Dark
        secondary: "#6C757D", // Gray
    },
};

// Create the theme
let theme = createTheme({
    typography,
    palette,
});
theme = responsiveFontSizes(theme);
export default theme;
