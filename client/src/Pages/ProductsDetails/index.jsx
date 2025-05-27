import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Grid,
  useTheme,
  Divider,
  TextField,
} from "@mui/material";
import mongoose from "mongoose";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import fetchData from "../../Utils/fetchData";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useSelector } from "react-redux";
import notify from "../../Utils/notify";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { token, user } = useSelector((state) => state.auth);
  const theme = useTheme();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetchData(`product/${id}`);
      if (res?.success) {
        setProduct(res.data.product);
        setCategoryName(res.data.product?.categoryId?.name);
        setMainImage(res.data.product.imagesUrl?.[0] || "");
      }
    };

    const fetchVariants = async () => {
      const res = await fetchData(`product-variant?productId=${id}`);
      if (res?.success) {
        setVariants(res.data);
        const defaultVariant = res.data.find(
          (v) => v._id === res.data.product?.defaultProductVariantId?._id
        );
        setSelectedVariant(defaultVariant || res.data[0]);
      }
    };

    fetchProduct();
    fetchVariants();
  }, [id]);

  const handleColorSelect = (colorValue) => {
    const variant = variants.find(
      (v) => v.variantId?.value.toLowerCase() === colorValue.toLowerCase()
    );
    if (variant) {
      setSelectedVariant(variant);
      setQuantity(1);
    }
  };

  const isInStock = selectedVariant?.quantity > 0;
  const uniqueColors = [
    ...new Set(
      variants
        .filter((v) => v.variantId?.type === "color")
        .map((v) => v.variantId.value)
    ),
  ];

  const increaseQuantity = () => {
    if (selectedVariant && quantity < selectedVariant.quantity) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (selectedVariant && quantity <= selectedVariant.quantity) {
      console.log("افزودن به سبد خرید", {
        variantId: selectedVariant._id,
        quantity,
      });
    }
  };

  useEffect(() => {
    (async () => {
      const res = await fetchData(`comment?productId=${id}&isActive=true`);
      setComments(res?.data || []);
    })();
  }, [id]);
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setLoading(true);

    const res = await fetchData("comment", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: id,
        content: newComment,
      }),
    });
    console.log(res);
    setLoading(false);
    console.log(comments);
    if (res.success) {
      notify("نظر شما با موفقیت ثبت شد", "success");
      setNewComment("");
      setComments([...comments, res.data]);
    }
  };

  // چک کردن وضعیت favorite در useEffect
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user) {
        const res = await fetchData(`user/favorites`, {
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
  }, [id, user]);

  // تابع toggleFavorite
 const handleToggleFavorite = async () => {
  if (!token) {
    notify("برای افزودن به علاقه‌مندی‌ها ابتدا وارد شوید", "warning");
    return;
  }

  if (favoriteLoading) return;

  setFavoriteLoading(true);
  try {
    const res = await fetchData(`user/favorites`, {
      method: "POST", // ✅ درستش اینه
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId: id }), // ✅ id رو توی body بفرست
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
    setFavoriteLoading(false);
  }
};


  
  return (
    <>
      <Box sx={{ pb: "40px" }}>
        <Box
          sx={{
            width: "100%",
            height: "50px",
            mt: { xs: "80px", md: "130px" },
            px: { xs: "2px", md: "4%" },
            borderBottom: `1px solid ${theme.palette.background.border}`,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: { xs: "13px", md: "16px" },
              lineHeight: "50px",
            }}
          >
            خانه <ChevronLeftIcon fontSize="small" />
            دسته بندی ها <ChevronLeftIcon fontSize="small" />
            {categoryName} <ChevronLeftIcon fontSize="small" />
            <span
              style={{
                fontSize: { sx: "14px", md: "18px" },
                fontWeight: 600,
                color: theme.palette.text.secondary,
                opacity: 1,
              }}
            >
              {product?.title?.replaceAll("-", " ")}
            </span>
          </Typography>
        </Box>

        {product && (
          <Grid container spacing={4} sx={{ mt: 4, px: "4%" }}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  width: "450px",
                  height: "450px",
                  backgroundColor: theme.palette.background.box,
                  padding: "20px",
                  borderRadius: 8,
                  boxShadow: "0 0 10px 0 rgba(0,0,0,.2)",
                  position: "relative",
                }}
              >
                {selectedVariant?.discount && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      backgroundColor: theme.palette.background.buttom,
                      color: theme.palette.text.primary,
                      padding: "4px 12px",
                      fontWeight: "bold",
                      fontSize: "14px",
                      transform: "rotate(-15deg)",
                      borderRadius: "8px",
                      border: `1px dashed ${theme.palette.text.primary}`,
                      zIndex: 10,
                    }}
                  >
                    {selectedVariant.discount}٪ تخفیف
                  </Box>
                )}
                <img
                  src={`${import.meta.env.VITE_BASE_URL}${mainImage}`}
                  alt="product"
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "400px",
                    objectFit: "contain",
                  }}
                />
              </Box>

              <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
                {product.imagesUrl?.map((img, i) => (
                  <img
                    key={i}
                    src={`${import.meta.env.VITE_BASE_URL}${img}`}
                    alt={`thumb-${i}`}
                    onClick={() => setMainImage(img)}
                    style={{
                      width: 64,
                      height: 64,
                      border:
                        mainImage === img
                          ? "2px solid black"
                          : "1px solid #ccc",
                      borderRadius: 4,
                      cursor: "pointer",
                      // objectFit: "cover",
                      transition: "all 0.3s ease",
                      boxShadow:
                        mainImage === img ? "0 0 5px rgba(0,0,0,0.5)" : "none",
                    }}
                  />
                ))}
              </Box>
            </Grid>

            <Grid
              item
              xs={12}
              md={6}
              sx={{
                mr: "20px",
                width: { xs: "100%", md: "70%" },
                px: { xs: "4%", md: "5%" },
              }}
            >
              <Typography
                variant="h4"
                gutterBottom
                sx={{ color: theme.palette.text.secondary }}
              >
                {product.title}
              </Typography>
              <IconButton
                onClick={handleToggleFavorite}
                disabled={loading} // جلوگیری از کلیک همزمان چندباره
                sx={{
                  color: isFavorite ? "red" : theme.palette.text.secondary,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.2)",
                  },
                }}
              >
                {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>

              <Box sx={{ width: { md: "100%", lg: "60%" } }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "20px",
                    fontWeight: "600",
                  }}
                >
                  توضیحات:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: "500",
                    fontSize: "19px",
                  }}
                >
                  {product.description}
                </Typography>
              </Box>

              <Box sx={{ mt: 4 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "20px",
                    fontWeight: "600",
                  }}
                >
                  مشخصات فنی:
                </Typography>
                <Box
                  component="ul"
                  sx={{
                    width: { xs: "100%", md: "50%" },
                    color: theme.palette.text.secondary,
                    display: "flex",
                    justifyContent: "start",
                    alignItems: "center",
                    gap: "20px",
                    flexWrap: "wrap",
                  }}
                >
                  {product.information?.map((item) => (
                    <Box
                      component={"li"}
                      sx={{
                        width: "200px",
                        minHeight: "40px",
                        textAlign: "center",
                        backgroundColor: theme.palette.background.box,
                        padding: "5px",
                        borderRadius: "10px",
                        boxShadow: "0 0 5px 0 rgba(0,0,0,.2)",
                      }}
                      key={item._id}
                    >
                      {item.key}: {item.value}
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box sx={{ mt: 4 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 1, color: theme.palette.text.secondary }}
                >
                  رنگ:
                </Typography>
                <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                  {uniqueColors.map((color) => (
                    <Tooltip title={color} key={color}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          backgroundColor: color,
                          cursor: "pointer",
                          border:
                            selectedVariant?.variantId?.value === color
                              ? "3px solid black"
                              : "1px solid gray",
                        }}
                        onClick={() => handleColorSelect(color)}
                      />
                    </Tooltip>
                  ))}
                </Box>

                {selectedVariant && (
                  <>
                    {selectedVariant.discount > 0 && (
                      <Typography
                        variant="body2"
                        sx={{
                          textDecoration: "line-through",
                          color: theme.palette.background.buttom,
                          mb: 2,
                        }}
                      >
                        {selectedVariant.price.toLocaleString()} تومان
                      </Typography>
                    )}
                    <Typography
                      variant="h6"
                      sx={{ mb: 1, color: theme.palette.text.secondary }}
                    >
                      قیمت:{" "}
                      {selectedVariant.priceAfterDiscount.toLocaleString()}{" "}
                      تومان
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <IconButton
                        onClick={decreaseQuantity}
                        disabled={quantity === 1}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography sx={{ color: theme.palette.text.secondary }}>
                        {quantity}
                      </Typography>
                      <IconButton
                        onClick={increaseQuantity}
                        disabled={quantity >= selectedVariant.quantity}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>

                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        borderRadius: 3,
                        py: 1.5,
                        mt: 2,
                        fontWeight: "bold",
                        textTransform: "none",
                        fontSize: "16px",
                        backgroundColor: isInStock
                          ? theme.palette.primary.main
                          : theme.palette.background.err,
                      }}
                      disabled={
                        !isInStock || quantity > selectedVariant.quantity
                      }
                      onClick={handleAddToCart}
                    >
                      {isInStock ? "افزودن به سبد خرید" : "ناموجود"}
                    </Button>
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>

      {/* بخش نظرات */}
      <Box mt={4}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          نظرات کاربران
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {/* نمایش نظرات */}
        {comments?.length > 0 ? (
          comments.map((comment, index) => (
            <Box
              key={index}
              sx={{
                width: "400px",
                height: "400px",
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                borderRadius: 2,
                backgroundColor: "#f9f9f9",
                mb: 2,
                boxShadow: 1,
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.primary.main }}
                >
                  {comment?.userId?.username || "بی نام"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.primary.main }}
                >
                  {comment.content}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: theme.palette.primary.main }}
                >
                  {new Date(comment.createdAt).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          ))
        ) : (
          <Typography variant="body2" sx={{ color: theme.palette.text.third }}>
            هنوز نظری ثبت نشده است.
          </Typography>
        )}

        {/* فرم ارسال نظر */}
        <Box component="form" onSubmit={handleSubmitComment} mt={3}>
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            placeholder="نظر خود را بنویسید..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{
              backgroundColor: "#fff",
              borderRadius: 2,

              "& .MuiInputBase-input": {
                color: "#000",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#ccc",
                },
                "&:hover fieldset": {
                  borderColor: "#888",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#0d9488",
                },
              },
              "& .MuiInputBase-input::placeholder": {
                color: "#000",
                opacity: 1,
              },
            }}
          />

          <Button
            type="submit"
            disabled={!token || loading}
            variant="contained"
            color="primary"
            sx={{
              mt: 2,
              borderRadius: 2,

              py: 1.5,
              fontSize: "1rem",
              transition: "all .5s",
              "&:hover": { transform: "scale(1.1)" },
            }}
          >
            {token
              ? loading
                ? "در حال ارسال..."
                : "ارسال نظر"
              : "ابتدا وارد شوید"}
          </Button>
        </Box>
      </Box>
    </>
  );
}
