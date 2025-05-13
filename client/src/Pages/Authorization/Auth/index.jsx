import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button } from '@mui/material';
import notify from '../../../Utils/notify';
import fetchData from '../../../Utils/fetchData';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phoneNumber) {
      return notify('لطفاً شماره موبایل را وارد کنید', 'error');
    }

    const res = await fetchData('auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber }),
    });

    localStorage.setItem('phoneNumber', phoneNumber);
    localStorage.setItem('newAccount', res.newAccount);

    if (res.success) {
      if (res.password) {
        navigate('pass');
      } else {
        notify(res.message, 'success');
        navigate('otp');
      }
    } else {
      notify(res.message, 'error');
    }
  };

  const handleForgotPassword = () => {
    navigate('forget-pass');
  };

  return (
    <Box
      dir="rtl"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.100',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          width: '100%',
          maxWidth: 400,
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          ورود
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="شماره موبایل"
            type="tel"
            fullWidth
            margin="normal"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="شماره موبایل خود را وارد کنید"
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            ارسال
          </Button>
        </Box>

        <Box textAlign="center" mt={2}>
          <Button variant="text" onClick={handleForgotPassword}>
            فراموشی رمز عبور؟
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Auth;
