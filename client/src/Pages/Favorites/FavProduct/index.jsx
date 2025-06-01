import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  useTheme,
  IconButton,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import fetchData from "../../../Utils/fetchData";
import notify from "../../../Utils/notify";
import { useSelector } from "react-redux";

export default function FavProduct({ title, image, id, variantId, onRemove }) {
  const theme = useTheme();
  const { token } = useSelector((state) => state.auth);
  const [variant, setVariant] = useState(null);
  const [isFavorite, setIsFavorite] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetchData(`product-variant/${variantId}`);
      setVariant(res.data);
    })();
  }, [variantId]);

  const handleToggleFavorite = async () => {
    if (!token) {
      notify("برای افزودن به علاقه‌مندی‌ها ابتدا وارد شوید", "warning");
      return;
    }

    try {
      const res = await fetchData("user/favorites", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: id }),
      });

      if (res?.success) {
        const newStatus = !isFavorite;
        setIsFavorite(newStatus);
        notify(
          newStatus
            ? "محصول به علاقه‌مندی‌ها اضافه شد"
            : "محصول از علاقه‌مندی‌ها حذف شد",
          "success"
        );
        if (!newStatus && onRemove) onRemove(id);
      } else {
        notify(res?.message || "خطا در بروزرسانی علاقه‌مندی‌ها", "error");
      }
    } catch (err) {
      console.error(err);
      notify("خطا در بروزرسانی علاقه‌مندی‌ها", "error");
    }
  };

  return (
    <Box
      sx={{
        transition: "transform 0.3s",
        "&:hover": { transform: "scale(1.04)", zIndex: 5 },
      }}
    >
      <Card
        sx={{
          width: { xs: 160, sm: 180, md: 230 },
          height: 360,
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
        <Box sx={{ position: "relative", p: "5px" }}>
          <Box
            component="img"
            src={`${import.meta.env.VITE_BASE_URL + image}`}
            alt={title}
            sx={{
              width: "100%",
              height: '200px',
              objectFit: "contain",
            }}
          />

          <IconButton
            onClick={handleToggleFavorite}
            sx={{
              color: isFavorite ? "red" : theme.palette.text.secondary,
              top: 8,
              right: 8,
              position: "absolute",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.2)",
              },
            }}
          >
            <FavoriteIcon />
          </IconButton>

          {variant?.discount && (
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

        <CardContent
          sx={{
            px: 2,
            pt: 1,
            pb: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flexGrow: 1,
          }}
        >
          <Typography
            noWrap
            sx={{
              fontWeight: 600,
              mb: 1,
              textAlign: "center",
              color: theme.palette.text.secondary,
              fontSize: ".9rem",
            }}
          >
            {title}
          </Typography>

          {variant ? (
            <Box sx={{ textAlign: "center" }}>
              <Typography
                sx={{
                  color: theme.palette.error.main,
                  textDecoration: "line-through",
                  fontSize: ".8rem",
                }}
              >
                {variant.price} تومان
              </Typography>

              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: ".9rem",
                  color: theme.palette.text.secondary,
                }}
              >
                {variant.priceAfterDiscount} تومان
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
