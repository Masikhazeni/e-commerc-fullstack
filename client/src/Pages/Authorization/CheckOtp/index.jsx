import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import OtpInput from "./OtpInput";
import fetchData from "../../../Utils/fetchData";
import { useDispatch } from "react-redux";
import { login } from "../../../Store/Slices/AuthSlice";
import notify from "../../../Utils/notify";
import { useNavigate } from "react-router-dom";

const CheckOtp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [timer, setTimer] = useState(120);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const handleOtpComplete = async (code) => {
    const phoneNumber = localStorage.getItem("phoneNumber");
    const newAccount = localStorage.getItem("newAccount");
    const res = await fetchData("auth/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, newAccount, phoneNumber }),
    });
    if (res.success) {
      dispatch(login({ user: res?.data?.user, token: res?.data?.token }));
      //  const token = localStorage.getItem('token');
      //  const user = localStorage.getItem('user');
      notify(res.message, "success");
      navigate("/");
    } else {
      notify(res.message, "error");
    }
  };

  const handleResendOtp = async () => {
    const phoneNumber = localStorage.getItem("phoneNumber");
    const res = await fetchData("auth/resend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber }),
    });
    if (res.success) {
      notify(res.message, "success");
      setTimer(120);
      setIsResendDisabled(true);
    } else {
      notify(res.message, "error");
    }
  };

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <Box
      dir="rtl"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f0f4ff",
      }}
    >
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h5" align="center" gutterBottom>
          وارد کردن کد تایید
        </Typography>

        <OtpInput length={6} onComplete={handleOtpComplete} />

        <Typography variant="body2" align="center" sx={{ mt: 3, color: 'text.secondary' }}>
          یک کد 6 رقمی به شماره موبایل شما ارسال شده است.
        </Typography>

        <Button
          onClick={handleResendOtp}
          disabled={isResendDisabled}
          fullWidth
          sx={{ mt: 3, color: isResendDisabled ? 'grey.500' : 'primary.main' }}
        >
          {isResendDisabled
            ? `ارسال مجدد کد تا ${formatTime(timer)}`
            : "ارسال مجدد کد"}
        </Button>
      </Paper>
    </Box>
  );
};

export default CheckOtp;