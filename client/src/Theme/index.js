import { createTheme } from "@mui/material/styles";

// تم روشن (Light Theme)
const lightTheme = createTheme({
  direction: "rtl",
  palette: {
    mode: "light",
    primary: { main: "#273F4F" }, //  بنفش اصلی
    secondary: { main: "#000000" }, //بنفش تیره تر
    text: {
      primary: "#FFFFFF", // سفید
      secondary: "#273F4F", // بنفش خیلی تیره
      third: "#273F4F", // مشکی
    },
    background: {
      default: "#ffffff", // سفید
      paper: "#EFEEEA", // خاکستری نفش خیلی روشن
      border: "#273F4F", // بنفش اصلی
      buttom: "red", // بنفش تیره تر
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
    primary: { main: "#3D3D3D" }, // زغال سنگی
    secondary: { main: "#000000" },
    text: {
      primary: "#EFEEEA", //   بنفش اصلی
      secondary: "#FFFFFF", // سفید
      third: "#3D3D3D", //  خاکستری تیره
    },
    background: {
      default: "#000000", // مشکی
      paper: "#666666", // خاکستری متوسط
      border: "#273F4F", // بنفش اصلی
      buttom: "#D15828", // بنفش تیره تر
      box:'#858F99',
      err: "#ED0202",
      card:'#666666'
    },
  },
});

export { lightTheme, darkTheme };
