import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline, Box } from "@mui/material";
import { Toaster } from "react-hot-toast";

import {
  Authorization,
  Auth,
  CheckOtp,

  ForgetPass,
  Home,
  Products,
  ProductsDetails,
  Profile,
  Cart,
  NotFound,
  About,Favorite,
  CheckPass
} from "./Pages";

import { darkTheme, lightTheme } from "./Theme";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import { login } from "./Store/Slices/AuthSlice";


export default function App() {
  const token = useSelector((state) => state.auth.token);
  const { mode } = useSelector((state) => state.theme);
  const dispatch=useDispatch()
   useEffect(() => {
    document.body.dir = 'rtl'; // خیلی مهم برای HTML
  }, []);
    useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      dispatch(login({ token, user: JSON.parse(user) }));
    }
  }, [dispatch]);

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
            <Route path="pass" element={<CheckPass/>} />
            <Route path="forget-pass" element={<ForgetPass />} />
          </Route>
          <Route path="/products/:categoryId/:categoryName" element={<Products/>}/>
           <Route path="/product-details/:id/:name" element={<ProductsDetails/>}/>
            <Route path="/profile" element={!token ? <Navigate to="/authorization" /> : <Profile />}/>
            <Route path="/favorite" element={!token ? <Navigate to="/authorization" /> : <Favorite />}/>
             <Route path="/cart" element={!token ? <Navigate to="/authorization" /> : <Cart />}/>
             <Route path="*" element={<NotFound/>}/>
        </Routes>
      </Box>
        <Footer />
      <Toaster />
    </ThemeProvider>
  );
}
