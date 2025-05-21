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
      third: "#000000", // مشکی
    },
    background: {
      default: "#ffffff", // سفید
      paper: "#EFEEEA", // خاکستری نفش خیلی روشن
      border: "#273F4F", // بنفش اصلی
      buttom: "#FE7743", // بنفش تیره تر
      err: "#841E96",
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
      err: "#ED0202",
    },
  },
});

export { lightTheme, darkTheme };
