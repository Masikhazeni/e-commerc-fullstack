import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      dir="rtl"
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.background.paper,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        px: 2,
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: "6rem", sm: "8rem" },
          fontWeight: "bold",
          color: theme.palette.background.buttom,
        }}
      >
        404
      </Typography>

      <Typography
        variant="h5"
        sx={{
          mt: 2,
          color: theme.palette.text.secondary,
        }}
      >
        صفحه‌ای که دنبال آن هستید پیدا نشد!
      </Typography>

      <Typography
        variant="body1"
        sx={{
          mt: 1,
          mb: 3,
          color: theme.palette.text.third,
          maxWidth: 400,
        }}
      >
        ممکن است آدرس اشتباه وارد شده باشد یا صفحه مورد نظر حذف شده باشد.
      </Typography>

      <Button
        variant="contained"
        onClick={() => navigate("/")}
        sx={{
          bgcolor: theme.palette.background.buttom,
          color: "#fff",
          px: 4,
          py: 1.5,
          fontWeight: "bold",
          borderRadius: "30px",
          "&:hover": {
            bgcolor: "#6d167e",
          },
        }}
      >
        بازگشت به خانه
      </Button>
    </Box>
  );
}
