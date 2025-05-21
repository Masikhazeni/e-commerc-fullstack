import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";

/* -------- کمک: محاسبه اختلاف زمان -------- */
const diffObj = (target) => {
  const t = new Date(target).getTime() - Date.now();
  const total = Math.max(t, 0);
  const secs = Math.floor((total / 1000) % 60);
  const mins = Math.floor((total / 1000 / 60) % 60);
  const hrs  = Math.floor((total / 1000 / 60 / 60) % 24);
  const days = Math.floor(total / 1000 / 60 / 60 / 24);
  return { total, days, hrs, mins, secs };
};

/* -------- جزء عدد+برچسب -------- */
const TimeBox = ({ label, val }) => (
  <Box sx={{ textAlign: "center" }}>
    <Typography variant="h4" fontWeight={700}>
      {String(val).padStart(2, "0")}
    </Typography>
    <Typography variant="caption">{label}</Typography>
  </Box>
);

/* -------- پوستر اصلی -------- */
export default function DiscountPoster({
  code = "summer404",
  percent = 30,
  expireTime = "2025-06-30T14:30:00.000Z",
}) {
  const theme = useTheme();
  const [time, setTime] = useState(() => diffObj(expireTime));

  /* هر ثانیه آپدیت */
  useEffect(() => {
    if (time.total <= 0) return;
    const id = setInterval(() => setTime(diffObj(expireTime)), 1000);
    return () => clearInterval(id);
  }, [time.total, expireTime]);

  if (time.total <= 0) return null; // منقضی شده 🕛

  return (
    <Box
      sx={{
        width: '100%',
        mx: "auto",
        p: 4,
        textAlign: "center",
        color: "#fff",
        background: `linear-gradient(135deg, ${theme.palette.background.buttom} 0%, ${theme.palette.background.buttom} 100%)`,
        boxShadow: 6,
        fontFamily: "monospace",
        display:'flex',
        flexDirection:{xs:'column',md:'row'},
        alignItems:'center',
        justifyContent:'center',
        gap:{xs:'20px',md:'80px'},
        mb:'40px'
      }}
    >
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
        🎉 {percent}%  تخفیف ویژه تابستانی
      </Typography>

      {/* کد تخفیف */}
      <Box
        sx={{
          border: "2px dashed #fff",
          display: "inline-block",
          px: 3,
          py: 1,
          borderRadius: 2,
          letterSpacing: 2,
          fontSize: 24,
          fontWeight: 800,
          mb: 3,
          bgcolor: "rgba(255,255,255,0.1)",
          userSelect: "all",
        }}
      >
        {code.toUpperCase()}
      </Box>

      {/* شمارش معکوس */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 3,
          mt: 1,
        }}
      >
        <TimeBox label="ثانیه"  val={time.secs} />:
        <TimeBox label="دقیقه"  val={time.mins} />:
        <TimeBox label="ساعت"   val={time.hrs} />:
        <TimeBox label="روز"    val={time.days} />
      </Box>
    </Box>
  );
}

