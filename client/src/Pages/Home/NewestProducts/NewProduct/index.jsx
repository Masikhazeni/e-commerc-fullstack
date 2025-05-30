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
import { useSelector } from "react-redux";
import notify from "../../../../Utils/notify";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

export default function NewProduct({ title, image, id }) {
  const [variant, setVariant] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    // دریافت جدیدترین واریانت محصول
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

  useEffect(() => {
    // بررسی علاقه‌مندی کاربر
    const checkFavoriteStatus = async () => {
      if (user && token) {
        const res = await fetchData("user/favorites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res?.success) {
          const favoriteIds = res.data.map((p) => String(p._id));
          setIsFavorite(favoriteIds.includes(id));
        }
      }
    };
    checkFavoriteStatus();
  }, [id, token, user]);

  const handleToggleFavorite = async () => {
    if (!token) {
      notify("برای افزودن به علاقه‌مندی‌ها ابتدا وارد شوید", "warning");
      return;
    }

    if (loading) return;
    setLoading(true);

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
      } else {
        notify(res?.message || "خطا در بروزرسانی علاقه‌مندی‌ها", "error");
      }
    } catch (error) {
      console.error(error);
      notify("خطا در بروزرسانی علاقه‌مندی‌ها", "error");
    } finally {
      setLoading(false);
    }
  };

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
        <Box sx={{ position: "relative", padding: "5px" }}>
          {/* تصویر محصول */}
          <Box
            component="img"
            src={`${import.meta.env.VITE_BASE_URL + image}`}
            alt={title}
            sx={{ width: "100%", height: "200px", objectFit: "contain" }}
          />

          {/* آیکون علاقه‌مندی */}
          <IconButton
            onClick={handleToggleFavorite}
            disabled={loading}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 2,
              color: isFavorite ? "red" : theme.palette.text.secondary,
              backgroundColor: "rgba(255,255,255,0.8)",
              transition:'all .5s',
              "&:hover": {
                transform: "scale(1.2)",
                backgroundColor: "rgba(255,255,255,1)",
              },
            }}
          >
            {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>

          {/* نشان تخفیف */}
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
