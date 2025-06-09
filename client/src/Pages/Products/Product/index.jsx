import React, { useEffect, useState } from "react";
import {
  Card,
  Box,
  Typography,
  Button,
  CardContent,
  IconButton
} from "@mui/material";
import { Link } from "react-router-dom";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import { useSelector } from "react-redux";
import notify from "../../../Utils/notify";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import fetchData from "../../../Utils/fetchData";

export default function Product({
  id,
  image,
  title,
  brand,
  minPrice,
  maxPrice,
  hasDiscount,
  theme,
  getBrandName,
  formatPrice
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token, user } = useSelector((state) => state.auth);

  // بررسی وضعیت علاقه‌مندی در mount
  useEffect(() => {
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
  }, [id, user, token]);

  const handleToggleFavorite = async () => {
    if (!token) {
      notify("برای افزودن به علاقه‌مندی‌ها ابتدا وارد شوید", "error");
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
    } catch (err) {
      console.error(err);
      notify("خطا در بروزرسانی علاقه‌مندی‌ها", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      sx={{
        width: { xs: "100%", sm: "280px" },
        height: "500px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.background.Card,
        padding: 1,
        borderRadius: 3,
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        position: "relative",
        transition: "transform 0.3s ease",
        "&:hover": {
          transform: "scale(1.03)",
        },
      }}
    >
      {/* آیکون علاقه‌مندی در بالا راست */}
      <Box
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 2,
        }}
      >
        <IconButton
          onClick={handleToggleFavorite}
          disabled={loading}
          sx={{
            color: isFavorite ? "red" : theme.palette.text.secondary,
            backgroundColor: "rgba(255,255,255,0.8)",
            "&:hover": {
              transform: "scale(1.2)",
              backgroundColor: "rgba(255,255,255,1)",
            },
          }}
        >
          {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </Box>

      {/* تصویر محصول */}
      <Box
        component="img"
        src={`${import.meta.env.VITE_BASE_URL + image}`}
        alt={title}
        sx={{
          width: "100%",
          height: "280px",
          objectFit: "contain",
          borderRadius: 2,
        }}
      />

      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          color: theme.palette.text.secondary,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={600} noWrap>
            {title}
          </Typography>
          <Typography variant="body2" mt={0.5}>
            {getBrandName(brand)}
          </Typography>
        </Box>

        <Box
          sx={{
            mt: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            p: 1,
            backgroundColor: theme.palette.grey[100],
            borderRadius: 2,
          }}
        >
          <Typography variant="body1" fontWeight="bold" color="primary">
            {formatPrice(minPrice)}
          </Typography>

          {minPrice !== maxPrice && (
            <>
              <HorizontalRuleIcon color="primary" fontSize="small" />
              <Typography variant="body1" fontWeight="bold" color="primary">
                {formatPrice(maxPrice)}
              </Typography>
            </>
          )}
        </Box>

        <Button
          component={Link}
          to={`/product-details/${id}/${title.replaceAll(" ", "-")}`}
          fullWidth
          variant="contained"
          size="medium"
          sx={{
            mt: 2,
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
  );
}

