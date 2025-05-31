import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  useTheme,
  Divider,
  TextField,
  CircularProgress,
  Chip,
  Badge
} from "@mui/material";
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
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Comment from "./Comment";

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
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const [productRes, variantsRes] = await Promise.all([
          fetchData(`product/${id}`),
          fetchData(`product-variant?productId=${id}`)
        ]);

        if (productRes?.success) {
          setProduct(productRes.data.product);
          setCategoryName(productRes.data.product?.categoryId?.name || "");
          setMainImage(productRes.data.product.imagesUrl?.[0] || "");
        }

        if (variantsRes?.success) {
          setVariants(variantsRes.data);
          const defaultVariant = variantsRes.data.find(
            v => v._id === productRes?.data?.product?.defaultProductVariantId?._id
          );
          setSelectedVariant(defaultVariant || variantsRes.data[0]);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        notify("خطا در دریافت اطلاعات محصول", "error");
      }
    };

    fetchProductData();
  }, [id]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetchData(
          `comment/product/${id}?isActive=true&limit=1000&sort=-updatedAt`
        );
        setComments(res?.data || []);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [id]);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user && token) {
        try {
          const res = await fetchData(`user/favorites`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (res?.success) {
            const favoriteIds = res.data.map(p => String(p._id));
            setIsFavorite(favoriteIds.includes(id));
          }
        } catch (error) {
          console.error("Error checking favorite status:", error);
        }
      }
    };

    checkFavoriteStatus();
  }, [id, user, token]);

  const handleColorSelect = colorValue => {
    const variant = variants.find(
      v => v.variantId?.value.toLowerCase() === colorValue.toLowerCase()
    );
    if (variant) {
      setSelectedVariant(variant);
      setQuantity(1);
    }
  };

  const increaseQuantity = () => {
    if (selectedVariant && quantity < selectedVariant.quantity) {
      setQuantity(prev => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!token) {
      notify("برای افزودن به سبد خرید ابتدا وارد شوید", "warning");
      return;
    }

    if (!selectedVariant || !isInStock) return;

    try {
      const res = await fetchData("cart", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          productId: id,
          productVariantId: selectedVariant._id,
          categoryId: product.categoryId._id,
          quantity: quantity
        })
      });

      if (res?.success) {
        notify("محصول با موفقیت به سبد خرید اضافه شد", "success");
      } else {
        notify(res?.message || "خطا در افزودن به سبد خرید", "error");
      }
    } catch (error) {
      console.error(error);
      notify("خطا در ارتباط با سرور", "error");
    }
  };

  const handleSubmitComment = async e => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setLoading(true);

    try {
      const res = await fetchData("comment", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          productId: id,
          content: newComment
        })
      });

      if (res.success) {
        notify("نظر شما با موفقیت ثبت شد", "success");
        setNewComment("");
        setComments([res.data, ...comments]);
      }
    } catch (error) {
      console.error(error);
      notify("خطا در ثبت نظر", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!token) {
      notify("برای افزودن به علاقه‌مندی‌ها ابتدا وارد شوید", "warning");
      return;
    }

    if (favoriteLoading) return;

    setFavoriteLoading(true);
    try {
      const res = await fetchData(`user/favorites`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ productId: id })
      });

      if (res?.success) {
        setIsFavorite(!isFavorite);
        notify(
          !isFavorite
            ? "محصول به علاقه‌مندی‌ها اضافه شد"
            : "محصول از علاقه‌مندی‌ها حذف شد",
          "success"
        );
      }
    } catch (error) {
      console.error(error);
      notify("خطا در بروزرسانی علاقه‌مندی‌ها", "error");
    } finally {
      setFavoriteLoading(false);
    }
  };

  const isInStock = selectedVariant?.quantity > 0;
  const uniqueColors = [
    ...new Set(
      variants
        .filter(v => v.variantId?.type === "color")
        .map(v => v.variantId.value)
    )
  ];

  const commentItems = comments?.map((comment, index) => (
    <SwiperSlide key={index}>
      <Comment
        username={comment?.userId?.username}
        date={comment.createdAt}
        content={comment.content}
      />
    </SwiperSlide>
  ));

  if (!product) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh"
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 5 ,mt:{xs:'80px',md:'130px'} }}>
      {/* مسیر ناوبری */}
      <Box
        sx={{
          width: "100%",
          height: 50,
          mt: { xs: 8, md: 13 },
          px: { xs: 1, md: "5%" },
          borderBottom: `1px solid ${theme.palette.background.border}`
        }}
      >
        <Typography
          variant="body1"
          sx={{
            display: "flex",
            alignItems: "center",
            color: theme.palette.text.secondary,
            fontSize: { xs: 13, md: 16 },
            lineHeight: "50px"
          }}
        >
          خانه
          <ChevronLeftIcon fontSize="small" />
          دسته بندی ها
          <ChevronLeftIcon fontSize="small" />
          {categoryName}
          <ChevronLeftIcon fontSize="small" />
          <Box component="span" sx={{ fontWeight: 600 }}>
            {product?.title?.replaceAll("-", " ")}
          </Box>
        </Typography>
      </Box>

      {/* بخش اصلی محصول */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          mt: 4,
          px: { xs: 2, md: "5%" }
        }}
      >
        {/* گالری تصاویر */}
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            display: "flex",
            flexDirection: "column",
            gap: 2
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 500,
              mx: "auto",
              aspectRatio: "1/1",
              bgcolor: theme.palette.background.box,
              p: 2,
              borderRadius: 3,
              boxShadow: "0 0 10px 0 rgba(0,0,0,.2)",
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
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
                  zIndex: 10
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
                maxHeight: "100%",
                objectFit: "contain"
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent:{xs:'center',md:'start'},
              gap: 1,
              overflowX: "auto",
              py: 1,
              "&::-webkit-scrollbar": { height: 5 },
              "&::-webkit-scrollbar-thumb": {
                bgcolor: theme.palette.grey[400],
                borderRadius: 2
              }
            }}
          >
            {product.imagesUrl?.map((img, i) => (
              <Box
                key={i}
                onClick={() => setMainImage(img)}
                sx={{
                  width: 64,
                  height: 64,
                  flexShrink: 0,
                  border: 2,
                  borderColor:
                    mainImage === img
                      ? theme.palette.primary.main
                      : theme.palette.divider,
                  borderRadius: 1,
                  cursor: "pointer",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)"
                  }
                }}
              >
                <img
                  src={`${import.meta.env.VITE_BASE_URL}${img}`}
                  alt={`thumb-${i}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>

        {/* اطلاعات محصول */}
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            display: "flex",
            flexDirection: "column",
            gap: 3
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start"
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 700
              }}
            >
              {product.title}
            </Typography>
            <IconButton
              onClick={handleToggleFavorite}
              disabled={favoriteLoading}
              sx={{
                color: isFavorite ? "red" : theme.palette.text.secondary,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.2)"
                }
              }}
            >
              {favoriteLoading ? (
                <CircularProgress size={24} />
              ) : isFavorite ? (
                <FavoriteIcon />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
          </Box>

          {/* توضیحات محصول */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: "20px",
                fontWeight: "600",
                mb: 1
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
                lineHeight: 1.8
              }}
            >
              {product.description}
            </Typography>
          </Box>

          {/* مشخصات فنی */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: "20px",
                fontWeight: "600",
                mb: 2
              }}
            >
              مشخصات فنی:
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2
              }}
            >
              {product.information?.map(item => (
                <Box
                  key={item._id}
                  sx={{
                    width: "200px",
                    minHeight: "40px",
                    textAlign: "center",
                    backgroundColor: theme.palette.background.box,
                    padding: "5px",
                    borderRadius: "10px",
                    boxShadow: "0 0 5px 0 rgba(0,0,0,.2)",
                    color: theme.palette.text.secondary
                  }}
                >
                  {item.key}: {item.value}
                </Box>
              ))}
            </Box>
          </Box>

          {/* انتخاب رنگ */}
          {uniqueColors.length > 0 && (
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ mb: 1, color: theme.palette.text.secondary }}
              >
                رنگ:
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                {uniqueColors.map(color => (
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
                            ? `1px solid ${theme.palette.background.buttom}`
                            : `3px solid ${theme.palette.primary.main}`
                      }}
                      onClick={() => handleColorSelect(color)}
                    />
                  </Tooltip>
                ))}
              </Box>
            </Box>
          )}

          {/* قیمت و خرید */}
          {selectedVariant && (
            <Box
              sx={{
                bgcolor: theme.palette.background.box,
                borderRadius: 2,
                p: 3,
                boxShadow: "0 0 10px 0 rgba(0,0,0,.2)",
                display: "flex",
                flexDirection: "column",
                gap: 2
              }}
            >
              {selectedVariant.discount > 0 && (
                <Typography
                  variant="body2"
                  sx={{
                    textDecoration: "line-through",
                    color: theme.palette.background.buttom,
                    mb: 1
                  }}
                >
                  {selectedVariant.price.toLocaleString()} تومان
                </Typography>
              )}
              <Typography
                variant="h5"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 700
                }}
              >
                قیمت: {selectedVariant.priceAfterDiscount.toLocaleString()} تومان
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 1
                }}
              >
                <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                  تعداد:
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    bgcolor: theme.palette.action.hover,
                    borderRadius: 1
                  }}
                >
                  <IconButton
                    onClick={decreaseQuantity}
                    disabled={quantity === 1}
                    size="small"
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography
                    sx={{
                      px: 2,
                      minWidth: 40,
                      textAlign: "center",
                      color: theme.palette.text.secondary
                    }}
                  >
                    {quantity}
                  </Typography>
                  <IconButton
                    onClick={increaseQuantity}
                    disabled={quantity >= selectedVariant.quantity}
                    size="small"
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  borderRadius: 3,
                  py: 1.5,
                  fontWeight: "bold",
                  textTransform: "none",
                  fontSize: "16px",
                  backgroundColor: isInStock
                    ? theme.palette.primary.main
                    : theme.palette.background.err,
                  "&:hover": {
                    backgroundColor: isInStock
                      ? theme.palette.primary.dark
                      : theme.palette.background.err
                  }
                }}
                disabled={!isInStock || quantity > selectedVariant.quantity}
                onClick={handleAddToCart}
              >
                {isInStock ? "افزودن به سبد خرید" : "ناموجود"}
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* بخش نظرات */}
      <Box sx={{ mt: 6, px: { xs: 2, md: "5%" } }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: theme.palette.background.buttom,
            textAlign: "center",
            mb: 2
          }}
        >
          نظرات کاربران
        </Typography>
        <Divider sx={{ mb: 4, mx: "auto", width: "60%" }} />

        {/* فرم ثبت نظر */}
        <Box
          component="form"
          onSubmit={handleSubmitComment}
          sx={{
            bgcolor: theme.palette.background.box,
            borderRadius: 4,
            p: 3,
            mb: 4,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            maxWidth: 800,
            mx: "auto"
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ mb: 2, fontWeight: 600, color: theme.palette.text.secondary }}
          >
            ثبت نظر شما
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder="نظر خود را بنویسید..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 2,
              mb: 2,
              "& .MuiInputBase-input": {
                color: theme.palette.text.secondary
              }
            }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={!token || loading}
            fullWidth
            sx={{
              borderRadius: 2,
              py: 1.5,
              fontWeight: 600,
              fontSize: "1rem",
              backgroundColor: theme.palette.primary.main,
              "&:hover": {
                boxShadow: `0 0 15px ${theme.palette.primary.light}`
              }
            }}
          >
            {token
              ? loading
                ? "در حال ارسال..."
                : "ارسال نظر"
              : "ابتدا وارد شوید"}
          </Button>
        </Box>

        {/* لیست نظرات */}
        <Box sx={{ mb: 4 }}>
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              0: { slidesPerView: 1 },
              600: { slidesPerView: 1.2 },
              768: { slidesPerView: 1.8 },
              900: { slidesPerView: 2.5 },
              1200: { slidesPerView: 3.2 }
            }}
            style={{
              width: "100%",
              padding: "20px 0 40px"
            }}
          >
            {comments.length > 0 ? (
              commentItems
            ) : (
              <SwiperSlide>
                <Typography
                  variant="body1"
                  sx={{
                    textAlign: "center",
                    color: theme.palette.text.secondary,
                    py: 4
                  }}
                >
                  هنوز نظری ثبت نشده است.
                </Typography>
              </SwiperSlide>
            )}
          </Swiper>
        </Box>
      </Box>
    </Box>
  );
}