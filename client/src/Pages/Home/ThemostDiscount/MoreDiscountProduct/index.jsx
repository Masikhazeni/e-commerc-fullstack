import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  useTheme,
} from "@mui/material";

export default function MoreDiscountProduct({ title, image, id, variantData }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        transition: "transform .3s",
        "&:hover": { transform: "scale(1.04)", zIndex: 5 },
      }}
    >
      <Card
        sx={{
          width: 230,
          height: 350,
          borderRadius: 3,
          boxShadow: 2,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        {/* Image and discount badge */}
        <Box sx={{ position: "relative", padding: "5px" }}>
          <Box
            component="img"
            src={`${import.meta.env.VITE_BASE_URL + image}`}
            alt={title}
            sx={{ width: "100%", height: "200px", objectFit: "contain" }}
          />

          {/* Discount badge */}
          {variantData?.discount && (
            <Box
              sx={{
                position: "absolute",
                top: 8,
                left: 8,
                width: 34,
                height: 34,
                borderRadius: "50%",
                bgcolor: theme.palette.background.buttom,
                color: "#fff",
                fontSize: ".8rem",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ٪{variantData.discount}
            </Box>
          )}
        </Box>

        {/* Content */}
        <CardContent
          sx={{
            flexGrow: 1,
            px: 2,
            pt: 1,
            pb: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Typography
            noWrap
            sx={{
              fontWeight: 600,
              mb: 1,
              textAlign: "center",
              color: theme.palette.text.secondary,
            }}
          >
            {title}
          </Typography>

          {variantData ? (
            <Box sx={{ textAlign: "center" }}>
              <Typography
                sx={{
                  color: theme.palette.error.main,
                  textDecoration: "line-through",
                  fontSize: ".8rem",
                }}
              >
                {variantData.price.toLocaleString()} تومان
              </Typography>

              <Typography
                sx={{
                  fontWeight: "600",
                  fontSize: ".9rem",
                  color: theme.palette.text.secondary,
                }}
              >
                {variantData.priceAfterDiscount.toLocaleString()} تومان
              </Typography>
            </Box>
          ) : (
            <Typography sx={{ fontWeight: 600, textAlign: "center" }}>
              ناموجود
            </Typography>
          )}

          <Button
            component={Link}
            to={`/product-details/${id}/${title.replaceAll(" ", "-")}`}
            variant="contained"
            size="small"
            sx={{
              mt: 1,
              borderRadius: 2,
              backgroundColor: theme.palette.background.buttom,
              "&:hover": {
                backgroundColor: theme.palette.background.buttomHover,
              },
            }}
          >
            مشاهده محصول
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}