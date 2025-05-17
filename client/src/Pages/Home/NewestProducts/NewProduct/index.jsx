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
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function NewProduct({ title, image, id }) {
  const [variant, setVariant] = useState(null);
  const [isFav, setIsFav] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchData(`product-variant?productId=${id}`);
        if (res.data?.length > 0) {
          const sorted = res.data.sort(
            (a, b) => a.priceAfterDiscount - b.priceAfterDiscount
          );
          setVariant(sorted[0]);
        }
      } catch (error) {
        console.error("Error fetching variant:", error);
      }
    })();
  }, [id]);

  const handleToggleFavorite = () => {
    setIsFav((prev) => !prev);
    // اتصال به API علاقه‌مندی رو می‌تونی اینجا اضافه کنی
  };

  return (
    <Card
      sx={{
        width: 260,
        minHeight: 390,
        borderRadius: 3,
        boxShadow: 2,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "transform 0.3s ease",
        position: "relative",
        "&:hover": {
          transform: "scale(1.04)",
          boxShadow: 5,
        },
      }}
    >
      {/* تصویر و آیکون علاقه‌مندی */}
      <Box sx={{ position: "relative" }}>
        <Box
          component="img"
          src={`${import.meta.env.VITE_BASE_URL + image}`}
          alt={title}
          sx={{
            width: "100%",
            height: 200,
            objectFit: "cover",
            display: "block",
          }}
        />
        <IconButton
          onClick={handleToggleFavorite}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            padding: 0.5,
            border: "2px solid white",
            borderRadius: 1,
            backgroundColor: "transparent",
            boxShadow: "0 0 8px rgba(0,0,0,0.2)",
            "&:hover": {
              transform: "scale(1.1)",
            },
          }}
        >
          {isFav ? (
            <FavoriteIcon sx={{ color: theme.palette.error.main }} />
          ) : (
            <FavoriteBorderIcon sx={{ color: theme.palette.grey[700] }} />
          )}
        </IconButton>
      </Box>

      {/* محتوا */}
      <CardContent
        sx={{
          px: 2,
          pt: 1,
          pb: 2,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="subtitle1"
          noWrap
          sx={{
            fontWeight: 600,
            mb: 1,
            color: theme.palette.text.secondary,
            textAlign: "center",
          }}
        >
          {title}
        </Typography>

        {variant ? (
          <Box sx={{ mb: 2, textAlign: "center" }}>
           
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.error.main,
                textDecoration: "line-through",
                fontSize: "0.8rem",
                mt: 0.5,
              }}
            >
              {variant.price?.toLocaleString("fa-IR")} تومان
            </Typography>
             <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: "600" }}
            >
              {`${variant.priceAfterDiscount.toLocaleString("fa-IR")} تومان`}
            </Typography>
          </Box>
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, textAlign: "center", fontWeight: "600" }}
          >
            ناموجود
          </Typography>
        )}

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            component={Link}
            to={`/product-details/${id}/${title}`}
            variant="contained"
            size="small"
            sx={{
              borderRadius: 2,
              px: 3,
              py: 0.8,
              fontWeight: 500,
            }}
          >
            مشاهده محصول
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}



