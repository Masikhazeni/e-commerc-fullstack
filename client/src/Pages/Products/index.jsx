import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

export default function Products() {
  const { categoryName } = useParams();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("920px"));

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        // height: "80vh",
        mt: { sm: "80px", md: "130px" }
      }}
    >
      {/* ✅ نوار آدرس (breadcrumb) */}
      <Box
        sx={{
          width: "100%",
          px: "5%",
          display: "flex",
          alignItems: "center",
          height: "60px",
          justifyContent: "start",
          flexDirection: "row",
          borderBottom: `.5px solid ${theme.palette.text.secondary}`,
          
        }}
      >
        <Typography
          sx={{
            fontSize: "16px",
            color: theme.palette.text.secondary,
            fontWeight: 600,
            opacity: 0.5,
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          خانه <ChevronLeftIcon fontSize="small" />
          دسته‌بندی‌ها <ChevronLeftIcon fontSize="small" />
        </Typography>

        <Typography
          sx={{
            fontSize: "18px",
            color: theme.palette.text.secondary,
            fontWeight: "600",
            ml: 1,
          }}
        >
          {categoryName ? categoryName.replaceAll("-", " ") : ""}
        </Typography>
      </Box>

      {/* ✅ سایدبار + محتوای اصلی */}
      {isMobile ? (
        <Box></Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            height: "100%", // کل ارتفاع صفحه منهای نوار آدرس
          }}
        >
          {/* سایدبار */}
          <Box
            sx={{
              width: "200px",
              backgroundColor: theme.palette.background.box,
              borderRight: `1px solid ${theme.palette.divider}`,
              height: "calc(75.5vh - 60px)",
            }}
          >
            <Typography sx={{ p: 2, fontWeight: 600 }}>سایدبار</Typography>
          </Box>

          {/* محتوای محصولات */}
          <Box sx={{ flex: 1, p: 2 }}>
            <Typography>محتوای محصولات یا پیام خالی بودن</Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
