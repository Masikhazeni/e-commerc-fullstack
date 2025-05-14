import { createTheme } from "@mui/material/styles";

// تم روشن (Light Theme)
const lightTheme = createTheme({
  direction: "ltr",
  palette: {
    mode: "light",
    primary: { main: "#0d9488" },
    secondary: { main: "#4b5563" },
    text: {
      primary: "#010101",
      secondary: "#4f5e53",
      third:'#000000',
      furth:'#ffffff'
    },
    background: {
      default: "#ffffff",
      paper: "#f5f5f5",
    },
  },
});

// تم تاریک (Dark Theme)
const darkTheme = createTheme({
  direction: "rtl",
  palette: {
    mode: "dark",
    primary: { main: "#535E6E" },
    secondary: { main: "#353D4A" },
    text: {
      primary: "#ffffff",
      secondary: "#d1d5db",
      third:'#FFFFFF',
      furth:'#000000'
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },
});

export { lightTheme, darkTheme };

