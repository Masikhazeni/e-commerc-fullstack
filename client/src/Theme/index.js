import { createTheme } from "@mui/material/styles";

// تم روشن (Light Theme)
const lightTheme = createTheme({
  direction: "rtl",
  palette: {
    mode: "light",
    primary: { main: "#841E96" }, //  بنفش اصلی
    secondary: { main: "#631C80" }, //بنفش تیره تر
    text: {
      primary: "#FFFFFF", // سفید
      secondary: "#53156B", // بنفش خیلی تیره
      third: "#000000", // مشکی
    },
    background: {
      default: "#ffffff", // سفید
      paper: "#E6E6FA", // خاکستری نفش خیلی روشن
      border: "#841E96", // بنفش اصلی
      buttom: "#631C80", // بنفش تیره تر
      err:'#841E96'
    },
  },
});

// تم تاریک (Dark Theme)
const darkTheme = createTheme({
  direction: "rtl",
  palette: {
    mode: "dark",
    primary: { main: "#3D3D3D" }, // زغال سنگی
    secondary: { main: "#000000" },
    text: {
      primary: "#E6E6FA", //   بنفش اصلی
      secondary: "#FFFFFF", // سفید
      third: "#3D3D3D", //  خاکستری تیره
    },
    background: {
      default: "#000000", // مشکی
      paper: "#666666", // خاکستری متوسط
      border: "#631C80", // بنفش اصلی
      buttom: "#631C80", // بنفش تیره تر
         err:'#ED0202'
    },
  },
});

export { lightTheme, darkTheme };
