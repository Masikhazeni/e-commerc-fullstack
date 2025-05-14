import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline, Box } from "@mui/material";
import { Toaster } from "react-hot-toast";

import {
  Authorization,
  Auth,
  CheckOtp,
  CheckPass,
  ForgetPass,
  Home,
  Products,
  ProductsDetails,
  Profile,
  Cart,
  NotFound,
  About
} from "./Pages";

import { darkTheme, lightTheme } from "./Theme";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

export default function App() {
  const token = useSelector((state) => state.auth.token);
  const { mode } = useSelector((state) => state.theme);

  const theme = mode === "light" ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <Navbar />
      <Box dir="rtl">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/authorization"
            element={token ? <Navigate to="/" /> : <Authorization />}
          >
            <Route index element={<Auth />} />
            <Route path="otp" element={<CheckOtp />} />
            <Route path="pass" element={<CheckPass />} />
            <Route path="forget-pass" element={<ForgetPass />} />
          </Route>
          <Route path="/products/:categoryId/:categoryName" element={<Products/>}/>
           <Route path="/product-details/:id/:name" element={<ProductsDetails/>}/>
            <Route path="/profile" element={!token ? <Navigate to="/authorization" /> : <Profile />}/>
             <Route path="/cart" element={!token ? <Navigate to="/authorization" /> : <Cart />}/>
             <Route path="*" element={<NotFound/>}/>
        </Routes>
      </Box>
        <Footer />
      <Toaster />
    </ThemeProvider>
  );
}
