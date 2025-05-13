import React, { useState } from "react";
import fetchData from "../../../../Utils/fetchData";
import notify from "../../../../Utils/notify";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";

export default function ForgetPassStepOne({ handleStep }) {
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phoneNumber) {
      return notify("لطفاً شماره موبایل خود را وارد کنید", "error");
    }

    const res = await fetchData("auth/resend", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ phoneNumber }),
    });

    if (res.success) {
      localStorage.setItem("phoneNumber", phoneNumber);
      notify(res.message, "success");
      handleStep(2);
    } else {
      notify(res.message, "error");
    }
  };

  return (
    <Container maxWidth="sm" dir="rtl">
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, width: "100%" }}>
          <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom>
            فراموشی رمز عبور
          </Typography>
          <Typography variant="body2" textAlign="center" color="text.secondary" gutterBottom>
            لطفاً شماره موبایل خود را وارد کنید تا کد تأیید برای شما ارسال شود.
          </Typography>
          <Box component="form" onSubmit={handleSubmit} mt={3}>
            <TextField
              fullWidth
              type="tel"
              label="شماره موبایل"
              variant="outlined"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              margin="normal"
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              ارسال کد تایید
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}