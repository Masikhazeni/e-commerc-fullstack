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
          height: 340,             /* ارتفاع ثابت */
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
        <Box sx={{ position: "relative" }}>
          <Box
            component="img"
            src={`${import.meta.env.VITE_BASE_URL + image}`}
            alt={title}
            sx={{ width: "100%", height: 180, objectFit: "cover" }}
          />
          {/* قلب */}
          <IconButton
            onClick={() => setIsFav((p) => !p)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              p: .5,
              border: "2px solid #fff",
              borderRadius: 1,
              background: "#fff",
            }}
          >
            {isFav ? (
              <FavoriteIcon sx={{ color: theme.palette.background.err }} />
            ) : (
              <FavoriteBorderIcon sx={{ color: theme.palette.grey[600] }} />
            )}
          </IconButton>

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
                bgcolor: theme.palette.background.err,
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
            sx={{ fontWeight: 600, mb: 1, textAlign: "center" ,color:theme.palette.text.secondary}}
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
              <Typography sx={{ fontWeight: '600', fontSize: ".9rem",color:theme.palette.text.secondary }}>
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
            sx={{ mt: 1, borderRadius: 2 }}
          >
            مشاهده محصول
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

// import React, { useEffect, useState } from "react";
// import fetchData from "../../../../Utils/fetchData";
// import { Link } from "react-router-dom";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   IconButton,
//   useTheme,
//   Snackbar,
//   CircularProgress,
// } from "@mui/material";
// import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import { useSelector, useDispatch } from "react-redux";
// import { login } from "../../../../Store/Slices/AuthSlice";

// export default function NewProduct({ title, image, id }) {
//   const [variant, setVariant] = useState(null);
//   const [isFav, setIsFav] = useState(false);
//   const [snackbar, setSnackbar] = useState({ open: false, msg: "" });
//   const [loadingFav, setLoadingFav] = useState(false);

//   const theme = useTheme();
//   const dispatch = useDispatch();
//   const { user, token } = useSelector((state) => state.auth);

//   // دریافت واریانت محصول - نسخه اصلاح شده
//   useEffect(() => {
//     const fetchProductVariant = async () => {
//       try {
//         const res = await fetchData(`product-variant?productId=${id}`);
        
//         // بررسی ساختار پاسخ سرور
//         if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
//           const sortedVariants = [...res.data].sort(
//             (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//           );
//           setVariant(sortedVariants[0]);
//         } else {
//           console.warn("No valid variants received");
//         }
//       } catch (error) {
//         console.error("Error fetching product variants:", error);
//         setSnackbar({
//           open: true,
//           msg: "خطا در دریافت اطلاعات محصول"
//         });
//       }
//     };

//     fetchProductVariant();
//   }, [id]);

//   // تابع مدیریت علاقه‌مندی‌ها - نسخه اصلاح شده
//   const handleFavoriteToggle = async () => {
//     if (!user || !token) {
//       setSnackbar({ 
//         open: true, 
//         msg: "برای افزودن به علاقه‌مندی‌ها باید وارد شوید" 
//       });
//       return;
//     }

//     setLoadingFav(true);

//     try {
//       // ساخت بدنه درخواست
//       const updatedFavorites = isFav
//         ? user.favoriteProduct.filter(pid => pid.toString() !== id.toString())
//         : [...user.favoriteProduct, id];

//       const response = await fetchData(`user/${user.id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           favoriteProduct: updatedFavorites
//         }),
//       });

//       if (response?.success) {
//         setIsFav(!isFav);
//         dispatch(login({
//           user: response.data,
//           token
//         }));
//         setSnackbar({
//           open: true,
//           msg: isFav 
//             ? "محصول از علاقه‌مندی‌ها حذف شد" 
//             : "محصول به علاقه‌مندی‌ها اضافه شد"
//         });
//       } else {
//         throw new Error(response?.message || "عملیات ناموفق بود");
//       }
//     } catch (error) {
//       console.error("Error updating favorites:", error);
//       setSnackbar({
//         open: true,
//         msg: "خطا در بروزرسانی علاقه‌مندی‌ها"
//       });
//     } finally {
//       setLoadingFav(false);
//     }
//   };
// console.log(user)
//   // بررسی وضعیت علاقه‌مندی
//   useEffect(() => {
//     if (user?.favoriteProduct) {
//       const found = user.favoriteProduct.some(
//         pid => pid.toString() === id.toString()
//       );
//       setIsFav(found);
//     }
//   }, [user, id]);

//   // محاسبه قیمت با تخفیف
//   const hasDiscount = variant?.discount > 0;
//   const priceAfterDiscount = hasDiscount
//     ? variant.price * (1 - variant.discount / 100)
//     : variant?.price;

//   return (
//     <Box sx={{ /* استایل‌های قبلی */ }}>
//       <Card sx={{ /* استایل‌های قبلی */ }}>
//         {/* بخش تصویر محصول */}
//         <Box sx={{ position: "relative" }}>
//           <Box
//             component="img"
//             src={`${import.meta.env.VITE_BASE_URL}${image}`}
//             alt={title}
//             sx={{ width: "100%", height: 180, objectFit: "cover" }}
//           />

//           {/* دکمه علاقه‌مندی */}
//           <IconButton
//             onClick={handleFavoriteToggle}
//             disabled={loadingFav}
//             sx={{
//               position: "absolute",
//               top: 8,
//               right: 8,
//               p: 0.5,
//               border: "2px solid #fff",
//               borderRadius: 1,
//               backgroundColor: "#ffffffaa",
//               "&:hover": {
//                 backgroundColor: "#ffffffdd",
//               }
//             }}
//           >
//             {loadingFav ? (
//               <CircularProgress size={18} />
//             ) : isFav ? (
//               <FavoriteIcon sx={{ color: theme.palette.error.main }} />
//             ) : (
//               <FavoriteBorderIcon sx={{ color: theme.palette.grey[600] }} />
//             )}
//           </IconButton>

//           {/* نمایش تخفیف */}
//           {hasDiscount && (
//             <Box
//               sx={{
//                 position: "absolute",
//                 top: 8,
//                 left: 8,
//                 width: 34,
//                 height: 34,
//                 borderRadius: "50%",
//                 bgcolor: theme.palette.error.main,
//                 color: "#fff",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontSize: "0.8rem",
//                 fontWeight: 700,
//               }}
//             >
//               ٪{variant.discount}
//             </Box>
//           )}
//         </Box>

//         {/* محتوای کارت */}
//         <CardContent sx={{ /* استایل‌های قبلی */ }}>
//           <Typography
//             noWrap
//             sx={{
//               fontWeight: 600,
//               mb: 1,
//               textAlign: "center",
//               color: theme.palette.text.secondary,
//             }}
//           >
//             {title}
//           </Typography>

//           {/* نمایش قیمت‌ها */}
//           {variant ? (
//             <Box sx={{ textAlign: "center" }}>
//               {hasDiscount && (
//                 <Typography
//                   sx={{
//                     color: theme.palette.error.main,
//                     textDecoration: "line-through",
//                     fontSize: "0.8rem",
//                   }}
//                 >
//                   {variant.price.toLocaleString("fa-IR")} تومان
//                 </Typography>
//               )}
//               <Typography
//                 sx={{
//                   fontWeight: "600",
//                   fontSize: "0.9rem",
//                   color: theme.palette.text.secondary,
//                 }}
//               >
//                 {priceAfterDiscount.toLocaleString("fa-IR")} تومان
//               </Typography>
//             </Box>
//           ) : (
//             <Typography sx={{ fontWeight: 600, textAlign: "center" }}>
//               در حال دریافت اطلاعات...
//             </Typography>
//           )}

//           <Button
//             component={Link}
//             to={`/product-details/${id}`}
//             variant="contained"
//             size="small"
//             sx={{ mt: 1, borderRadius: 2 }}
//           >
//             مشاهده محصول
//           </Button>
//         </CardContent>
//       </Card>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={3000}
//         onClose={() => setSnackbar({ open: false, msg: "" })}
//         message={snackbar.msg}
//       />
//     </Box>
//   );
// }




// import React, { useEffect, useState } from "react";
// import fetchData from "../../../../Utils/fetchData";
// import { Link } from "react-router-dom";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   IconButton,
//   useTheme,
//   Snackbar,
//   CircularProgress,
// } from "@mui/material";
// import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import { useSelector, useDispatch } from "react-redux";
// import { login } from "../../../../Store/Slices/AuthSlice";

// export default function NewProduct({ title, image, id }) {
//   const [variant, setVariant] = useState(null);
//   const [isFav, setIsFav] = useState(false);
//   const [snackbar, setSnackbar] = useState({ open: false, msg: "" });
//   const [loadingFav, setLoadingFav] = useState(false);

//   const theme = useTheme();
//   const dispatch = useDispatch();
//   const { user, token, isAuthenticated } = useSelector((state) => state.auth);

//   // دریافت واریانت محصول
//   useEffect(() => {
//     const fetchProductVariant = async () => {
//       try {
//         const res = await fetchData(`product-variant?productId=${id}`);
        
//         if (res?.data?.length > 0) {
//           const sortedVariants = [...res.data].sort(
//             (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//           );
//           setVariant(sortedVariants[0]);
//         }
//       } catch (error) {
//         console.error("خطا در دریافت واریانت:", error);
//       }
//     };

//     fetchProductVariant();
//   }, [id]);

//   // بررسی وضعیت علاقه‌مندی محصول
//   useEffect(() => {
//     if (isAuthenticated && user?.favoriteProduct) {
//       const found = user.favoriteProduct.some(
//         productId => productId.toString() === id.toString()
//       );
//       setIsFav(found);
//     } else {
//       setIsFav(false);
//     }
//   }, [user, id, isAuthenticated]);

//   // مدیریت افزودن/حذف از علاقه‌مندی‌ها
//   const handleFavoriteToggle = async () => {
//     if (!token) {
//       setSnackbar({ 
//         open: true, 
//         msg: "برای مدیریت علاقه‌مندی‌ها باید وارد حساب کاربری خود شوید" 
//       });
//       return;
//     }

//     setLoadingFav(true);

//     try {
//       // ایجاد کپی ایمن از آرایه علاقه‌مندی‌ها
//       const currentFavorites = Array.isArray(user.favoriteProduct) 
//         ? [...user.favoriteProduct] 
//         : [];

//       // ایجاد آرایه جدید بر اساس عمل مورد نظر
//       const updatedFavorites = isFav
//         ? currentFavorites.filter(pid => pid.toString() !== id.toString())
//         : [...currentFavorites, id];
// console.log(updatedFavorites)
//       // ارسال درخواست به سرور
//       const response = await fetchData(`user/${user.id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           favoriteProduct: updatedFavorites
//         }),
//       });

//       if (response?.success) {
//         setIsFav(!isFav);
//         dispatch(login({
//           user: {
//             ...user,
//             favoriteProduct: updatedFavorites
//           },
//           token,
//           // isAuthenticated: true
//         }));
//         setSnackbar({
//           open: true,
//           msg: isFav 
//             ? "محصول از علاقه‌مندی‌ها حذف شد" 
//             : "محصول به علاقه‌مندی‌ها اضافه شد"
//         });
//       } else {
//         throw new Error(response?.message || "عملیات ناموفق بود");
//       }
//     } catch (error) {
//       console.error("Error updating favorites:", error);
//       setSnackbar({
//         open: true,
//         msg: "خطا در بروزرسانی علاقه‌مندی‌ها"
//       });
//     } finally {
//       setLoadingFav(false);
//     }
//   };

//   // محاسبه قیمت با تخفیف
//   const hasDiscount = variant?.discount > 0;
//   const priceAfterDiscount = hasDiscount
//     ? variant.price * (1 - variant.discount / 100)
//     : variant?.price;

//   return (
//     <Box sx={{ 
//       transition: "transform 0.3s",
//       "&:hover": { transform: "scale(1.03)" }
//     }}>
//       <Card sx={{
//         width: 230,
//         height: 340,
//         borderRadius: 3,
//         boxShadow: 2,
//         overflow: "hidden",
//         display: "flex",
//         flexDirection: "column",
//       }}>
//         {/* بخش تصویر محصول */}
//         <Box sx={{ position: "relative", height: 180 }}>
//           <Box
//             component="img"
//             src={`${import.meta.env.VITE_BASE_URL}${image}`}
//             alt={title}
//             sx={{ 
//               width: "100%", 
//               height: "100%", 
//               objectFit: "cover" 
//             }}
//           />

//           {/* دکمه علاقه‌مندی */}
//           <IconButton
//             onClick={handleFavoriteToggle}
//             disabled={loadingFav}
//             sx={{
//               position: "absolute",
//               top: 8,
//               right: 8,
//               p: 1,
//               backgroundColor: "rgba(255,255,255,0.8)",
//               "&:hover": {
//                 backgroundColor: "rgba(255,255,255,0.9)",
//               }
//             }}
//           >
//             {loadingFav ? (
//               <CircularProgress size={20} />
//             ) : isFav ? (
//               <FavoriteIcon color="error" />
//             ) : (
//               <FavoriteBorderIcon />
//             )}
//           </IconButton>

//           {/* نمایش تخفیف */}
//           {hasDiscount && (
//             <Box
//               sx={{
//                 position: "absolute",
//                 top: 8,
//                 left: 8,
//                 width: 34,
//                 height: 34,
//                 borderRadius: "50%",
//                 bgcolor: "error.main",
//                 color: "#fff",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontWeight: "bold",
//                 fontSize: "0.8rem",
//               }}
//             >
//               ٪{variant.discount}
//             </Box>
//           )}
//         </Box>

//         {/* محتوای کارت */}
//         <CardContent sx={{ 
//           flex: 1,
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "space-between",
//           p: 2
//         }}>
//           <Typography
//             noWrap
//             sx={{
//               fontWeight: 600,
//               textAlign: "center",
//               mb: 1,
//             }}
//           >
//             {title}
//           </Typography>

//           {/* نمایش قیمت‌ها */}
//           {variant ? (
//             <Box sx={{ textAlign: "center" }}>
//               {hasDiscount && (
//                 <Typography
//                   sx={{
//                     color: "error.main",
//                     textDecoration: "line-through",
//                     fontSize: "0.8rem",
//                   }}
//                 >
//                   {variant.price.toLocaleString("fa-IR")} تومان
//                 </Typography>
//               )}
//               <Typography
//                 sx={{
//                   fontWeight: 600,
//                   fontSize: "0.9rem",
//                 }}
//               >
//                 {priceAfterDiscount.toLocaleString("fa-IR")} تومان
//               </Typography>
//             </Box>
//           ) : (
//             <Typography sx={{ fontWeight: 600 }}>
//               در حال دریافت اطلاعات...
//             </Typography>
//           )}

//           <Button
//             component={Link}
//             to={`/product-details/${id}`}
//             variant="contained"
//             size="small"
//             sx={{ mt: 1, borderRadius: 2 }}
//           >
//             مشاهده محصول
//           </Button>
//         </CardContent>
//       </Card>

//       {/* پیام‌های سیستم */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={3000}
//         onClose={() => setSnackbar({ open: false, msg: "" })}
//         message={snackbar.msg}
//       />
//     </Box>
//   );
// }