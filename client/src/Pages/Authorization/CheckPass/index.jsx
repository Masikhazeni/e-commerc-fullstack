import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button } from '@mui/material';
import notify from '../../../Utils/notify';
import fetchData from '../../../Utils/fetchData';
import { useNavigate } from 'react-router-dom';

const CheckPass = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const phoneNumber = localStorage.getItem('phoneNumber');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      return notify('لطفاً رمز عبور را وارد کنید', 'error');
    }

    try {
      setLoading(true);
      const res = await fetchData('auth/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, password }),
      });

      if (res.success) {
        notify(res.message || 'ورود موفقیت‌آمیز بود', 'success');
        localStorage.setItem('token', res.data.token);
        navigate('/'); // یا هر صفحه‌ای که کاربر بعد از ورود باید بره
      } else {
        notify(res.message || 'خطا در ورود', 'error');
      }
    } catch (err) {
      notify('خطایی رخ داده است', 'error');
    } finally {
      setLoading(false);
    }
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
          ورود با رمز عبور
        </Typography>

        <Typography variant="body2" align="center" color="text.secondary">
          شماره وارد شده: {phoneNumber}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} mt={2}>
          <TextField
            label="رمز عبور"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="رمز عبور خود را وارد کنید"
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? 'در حال ورود...' : 'ورود'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CheckPass;

