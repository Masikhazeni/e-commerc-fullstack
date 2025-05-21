import React, { useEffect, useState } from "react";
import fetchData from "../../../../Utils/fetchData";
import { Link } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  useTheme,
} from "@mui/material";

export default function NewProduct({ title, image, id }) {
  const [variant, setVariant] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchData(`product-variant?productId=${id}`);
        if (Array.isArray(res.data) && res.data.length)
          setVariant(
            res.data.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            )[0]
          );
      } catch (e) {
        console.error("variant fetch error:", e);
      }
    })();
  }, [id]);

  const hasDiscount = variant?.discount > 0;

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
          height: 350 /* ارتفاع ثابت */,
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
        {/* تصویر و آیکون‌ها */}
        <Box sx={{ position: "relative" ,padding:'5px'}}>
          <Box
            component="img"
            src={`${import.meta.env.VITE_BASE_URL + image}`}
            alt={title}
            sx={{ width: "100%", height:'200px' }}
          />

          {/* تخفیف */}
          {hasDiscount && (
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
              ٪{variant.discount}
            </Box>
          )}
        </Box>

        {/* محتوا */}
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

          {variant ? (
            <Box sx={{ textAlign: "center" }}>
              {hasDiscount && (
                <Typography
                  sx={{
                    color: theme.palette.error.main,
                    textDecoration: "line-through",
                    fontSize: ".8rem",
                  }}
                >
                  {variant.price.toLocaleString("fa-IR")} تومان
                </Typography>
              )}
              <Typography
                sx={{
                  fontWeight: "600",
                  fontSize: ".9rem",
                  color: theme.palette.text.secondary,
                }}
              >
                {variant.priceAfterDiscount.toLocaleString("fa-IR")} تومان
              </Typography>
            </Box>
          ) : (
            <Typography sx={{ fontWeight: 600, textAlign: "center" }}>
              ناموجود
            </Typography>
          )}

          <Button
            component={Link}
            to={`/product-details/${id}/${title}`}
            variant="contained"
            size="small"
            sx={{
              mt: 1,
              borderRadius: 2,
              backgroundColor: theme.palette.background.buttom,
            }}
          >
            مشاهده محصول
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
