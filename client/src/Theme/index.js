import { createTheme } from "@mui/material/styles";

// تم روشن (Light Theme)
const lightTheme = createTheme({
  direction: "rtl",
  palette: {
    mode: "light",
    primary: { main: "#273F4F" }, 
    secondary: { main: "#000000" }, 
    text: {
      primary: "#FFFFFF", 
      secondary: "#273F4F", 
      third: "#273F4F", 
    },
    background: {
      default: "#ffffff", 
      paper: "#EFEEEA", 
      border: "#273F4F", 
      buttom: "red", 
      box:'#9EC9E8',
      err: "#841E96",
      card:'#ffffff'
    },
  },
});

const darkTheme = createTheme({
  direction: "rtl",
  palette: {
    mode: "dark",
    primary: { main: "#3D3D3D" }, 
    secondary: { main: "#000000" },
    text: {
      primary: "#EFEEEA", 
      secondary: "#FFFFFF", 
      third: "#3D3D3D", 
    },
    background: {
      default: "#000000", 
      paper: "#666666", 
      border: "#273F4F", 
      buttom: "#D15828", 
      box:'#858F99',
      err: "#ED0202",
      card:'#666666'
    },
  },
});

export { lightTheme, darkTheme };
