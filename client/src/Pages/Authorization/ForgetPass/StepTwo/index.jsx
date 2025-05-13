import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Grid } from "@mui/material";
import notify from "../../../../Utils/notify";
import { useDispatch } from "react-redux";
import { login } from "../../../../Store/Slices/AuthSlice";
import fetchData from "../../../../Utils/fetchData";

export default function ForgetPassStepTwo({ handleStep }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [timer, setTimer] = useState(120);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const dispatch = useDispatch();

  const handleOtpChange = (index, value) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) return notify("لطفاً کد تأیید ۶ رقمی را کامل وارد کنید", "error");
    if (!newPassword) return notify("لطفاً رمز عبور جدید را وارد کنید", "error");

    const res = await fetchData("auth/forget", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        phoneNumber: localStorage.getItem("phoneNumber"),
        password: newPassword,
        code: otpCode,
      }),
    });

    if (res.success) {
      notify("رمز عبور با موفقیت تغییر یافت!", "success");
      dispatch(login({ token: res.data.token, user: res.data.user }));
    } else {
      notify(res.message, "error");
    }
  };

  const handleResendCode = async () => {
    const res = await fetchData("auth/resend", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ phoneNumber: localStorage.getItem("phoneNumber") }),
    });

    if (res.success) {
      notify("کد تأیید مجدداً ارسال شد", "success");
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
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <Box
      dir="rtl"
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f9fafb"
    >
      <Box maxWidth={400} width="100%" bgcolor="#fff" p={4} borderRadius={4} boxShadow={3}>
        <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
          بازیابی رمز عبور
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary" mb={3}>
          کد تأیید ارسال‌شده را وارد کنید و رمز عبور جدید خود را ثبت نمایید.
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} justifyContent="center" mb={2}>
            {otp.map((digit, index) => (
              <Grid item key={index}>
                <TextField
                  id={`otp-${index}`}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  inputProps={{ maxLength: 1, style: { textAlign: "center", fontSize: "1.25rem" } }}
                  autoFocus={index === 0}
                />
              </Grid>
            ))}
          </Grid>
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button
              onClick={handleResendCode}
              disabled={isResendDisabled}
              variant="text"
              size="small"
            >
              {isResendDisabled ? `ارسال مجدد (${formatTime(timer)})` : "ارسال مجدد کد"}
            </Button>
          </Box>
          <TextField
            label="رمز عبور جدید"
            type="password"
            fullWidth
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
          />
          <Button
            onClick={() => handleStep(1)}
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
          >
            بازگشت به مرحله قبل
          </Button>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
          >
            ثبت رمز جدید
          </Button>
        </form>
      </Box>
    </Box>
  );
}
