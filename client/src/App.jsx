import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline, Box } from "@mui/material";
import { Toaster } from "react-hot-toast";

import {
  Auth,
  Authorization,
  CheckOtp,
  CheckPass,
  ForgetPass,
  Home,
} from "./Pages";

import { darkTheme, lightTheme } from "../Theme";

export default function App() {
  const token = useSelector((state) => state.auth.token);
  const { mode } = useSelector((state) => state.theme);

  const theme = mode === "light" ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box dir="rtl">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/authorization"
            element={token ? <Navigate to="/" /> : <Authorization />}
          >
            <Route index element={<Auth />} />
            <Route path="otp" element={<CheckOtp />} />
            <Route path="pass" element={<CheckPass />} />
            <Route path="forget-pass" element={<ForgetPass />} />
          </Route>
        </Routes>
      </Box>
      <Toaster />
    </ThemeProvider>
  );
}

