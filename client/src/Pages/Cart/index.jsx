// import {
//   Box,
//   Typography,
//   useTheme,
//   Button,
//   IconButton,
//   CircularProgress,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
// } from "@mui/material";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import AddIcon from "@mui/icons-material/Add";
// import RemoveIcon from "@mui/icons-material/Remove";
// import DeleteIcon from "@mui/icons-material/Delete";
// import React, { useEffect, useState, useMemo } from "react";
// import { useSelector } from "react-redux";
// import fetchData from "../../Utils/fetchData";
// import EmptyCart from "./EmptyCart";
// import CloseIcon from "@mui/icons-material/Close";
// import { useNavigate } from "react-router-dom";

// export default function Cart() {
//   const theme = useTheme();
//   const [products, setProducts] = useState([]);
//   const [allVariants, setAllVariants] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { token } = useSelector((state) => state.auth);
//   const navigate = useNavigate();
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
//   const [selectedVariantId, setSelectedVariantId] = useState(null);

//   const fetchCart = async () => {
//     try {
//       setLoading(true);
//       const res = await fetchData("cart", {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       setProducts(res.data.items);
//     } catch (error) {
//       console.error("Error fetching cart:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchVariants = async () => {
//     try {
//       const res = await fetchData("variant");
//       setAllVariants(res.data);
//     } catch (error) {
//       console.error("Error fetching variants:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCart();
//     fetchVariants();
//   }, []);

//   const modifyCart = async (variantId, method, body = {}) => {
//     try {
//       await fetchData("cart", {
//         method,
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(body),
//       });
//       fetchCart();
//     } catch (error) {
//       console.error("Cart operation error:", error);
//     }
//   };

//   const handleAdd = (variantId) =>
//     modifyCart(variantId, "POST", { productVariantId: variantId, quantity: 1 });

//   const handleRemove = (variantId) =>
//     modifyCart(variantId, "PATCH", { productVariantId: variantId });

//   const handleDeleteItem = (variantId) => {
//     setSelectedVariantId(variantId);
//     setOpenDeleteDialog(true);
//   };

//   const handleConfirmDelete = () => {
//     modifyCart(selectedVariantId, "PATCH", {
//       productVariantId: selectedVariantId,
//       removeAll: true,
//     });
//     setOpenDeleteDialog(false);
//   };

//   const handleClear = () => modifyCart(null, "DELETE");

//   const { totalPrice, totalDiscount } = useMemo(() => {
//     return products.reduce(
//       (acc, item) => {
//         const realPrice = item.productVariantId.price;
//         const discount = realPrice - item.finalPrice;
//         return {
//           totalPrice: acc.totalPrice + item.finalPrice * item.quantity,
//           totalDiscount: acc.totalDiscount + discount * item.quantity,
//         };
//       },
//       { totalPrice: 0, totalDiscount: 0 }
//     );
//   }, [products]);

//   const CartItem = React.memo(
//     ({ item, variant, onAdd, onRemove, onDelete }) => {
//       const maxStock = item.productVariantId.quantity;
//       const isAddDisabled = item.quantity >= maxStock;

//       return (
//         <Box
//           sx={{
//             width: "100%",
//             minHeight: "130px",
//             p: 2,
//             backgroundColor: theme.palette.background.card,
//             borderRadius: 2,
//             display: "flex",
//             flexDirection: { xs: "column", sm: "row" },
//             justifyContent: "space-between",
//             alignItems: "center",
//             boxShadow: 2,
//             gap: 2,
//             position: "relative",
//           }}
//         >
//           <IconButton
//             onClick={() => onDelete(item.productVariantId._id)}
//             sx={{
//               position: "absolute",
//               left: 0,
//               top: 0,
//               color: theme.palette.error.main,
//               "&:hover": { backgroundColor: theme.palette.error.light },
//             }}
//           >
//             <CloseIcon fontSize="small" />
//           </IconButton>

//           <Box sx={{ width: "40%" }}>
//             <Typography
//               fontWeight="bold"
//               color={theme.palette.text.third}
//               sx={{
//                 cursor: "pointer",
//                 "&:hover": {
//                   color: theme.palette.background.buttom,
//                 },
//               }}
//               onClick={() =>
//                 navigate(
//                   `/product-details/${
//                     item.productId._id
//                   }/${item.productId.title.replaceAll(" ", "-")}`
//                 )
//               }
//             >
//               {item.productId.title}
//             </Typography>
//             <Typography color={theme.palette.text.third}>
//               قیمت: {item.productVariantId.priceAfterDiscount.toLocaleString()}{" "}
//               تومان
//             </Typography>
//           </Box>

//           {variant && (
//             <Box
//               sx={{
//                 width: 40,
//                 height: 40,
//                 borderRadius: "50%",
//                 backgroundColor: variant.value,
//                 border: `3px solid ${theme.palette.background.box} `,
//               }}
//             />
//           )}

//           <Box
//             component="img"
//             src={`${
//               import.meta.env.VITE_BASE_URL + item.productId.imagesUrl[0]
//             }`}
//             sx={{ width: 80, height: 80, cursor: "pointer" }}
//             alt={item.productId.title}
//             onClick={() =>
//               navigate(
//                 `/product-details/${
//                   item.productId._id
//                 }/${item.productId.title.replaceAll(" ", "-")}`
//               )
//             }
//           />

//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               gap: 1.5,
//               mt: 1,
//               p: 1,
//               borderRadius: 2,
//               backgroundColor: theme.palette.background.paper,
//               border: `1px solid ${theme.palette.divider}`,
//             }}
//           >
//             <IconButton
//               onClick={() => onAdd(item.productVariantId._id)}
//               disabled={isAddDisabled}
//               sx={{
//                 backgroundColor: isAddDisabled
//                   ? theme.palette.action.disabledBackground
//                   : theme.palette.primary.light,
//                 color: isAddDisabled
//                   ? theme.palette.action.disabled
//                   : theme.palette.primary.contrastText,
//                 "&:hover": {
//                   backgroundColor: isAddDisabled
//                     ? theme.palette.action.disabledBackground
//                     : theme.palette.primary.main,
//                 },
//               }}
//             >
//               <AddIcon />
//             </IconButton>

//             <Typography
//               sx={{
//                 fontWeight: "bold",
//                 minWidth: "24px",
//                 textAlign: "center",
//                 color: theme.palette.primary.main,
//               }}
//             >
//               {item.quantity}
//             </Typography>

//             <IconButton
//               onClick={() => onRemove(item.productVariantId._id)}
//               sx={{
//                 backgroundColor: theme.palette.error.light,
//                 color: theme.palette.error.contrastText,
//                 "&:hover": { backgroundColor: theme.palette.error.main },
//               }}
//             >
//               <RemoveIcon />
//             </IconButton>
//           </Box>
//         </Box>
//       );
//     }
//   );

//   if (loading) {
//     return (
//       <Box
//         sx={{
//           minHeight: "80vh",
//           mt: { xs: "80px", md: "130px" },
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ minHeight: "80vh", mt: { xs: "80px", md: "130px" } }}>
//       {/* Delete Confirmation Dialog (only for complete removal) */}
//       <Dialog
//         open={openDeleteDialog}
//         onClose={() => setOpenDeleteDialog(false)}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//       >
//         <DialogTitle id="alert-dialog-title">{"حذف محصول"}</DialogTitle>
//         <DialogContent>
//           <DialogContentText id="alert-dialog-description">
//             آیا از حذف این محصول از سبد خرید مطمئن هستید؟
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
//             انصراف
//           </Button>
//           <Button onClick={handleConfirmDelete} color="error" autoFocus>
//             حذف
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Box
//         sx={{
//           height: 50,
//           px: { xs: 1, md: 4 },
//           borderBottom: `1px solid ${theme.palette.background.border}`,
//         }}
//       >
//         <Typography
//           variant="h6"
//           sx={{ color: theme.palette.text.secondary, lineHeight: "50px" }}
//         >
//           سبد خرید <ChevronLeftIcon fontSize="small" />
//         </Typography>
//       </Box>

//       <Box
//         sx={{
//           p: { xs: 2, md: 5 },
//           display: "flex",
//           gap: 4,
//           flexDirection: { xs: "column", md: "row" },
//         }}
//       >
//         <Box
//           sx={{
//             flex: 1,
//             backgroundColor: theme.palette.primary.main,
//             borderRadius: 2,
//             p: 2,
//             display: "flex",
//             flexDirection: "column",
//             gap: 2,
//           }}
//         >
//           {products.length > 0 ? (
//             products.map((item, index) => {
//               const variant = allVariants.find(
//                 (a) => a._id === item.productVariantId.variantId
//               );
//               return (
//                 <CartItem
//                   key={`${item.productVariantId._id}-${index}`}
//                   item={item}
//                   variant={variant}
//                   onAdd={handleAdd}
//                   onRemove={handleRemove}
//                   onDelete={handleDeleteItem}
//                 />
//               );
//             })
//           ) : (
//             <EmptyCart />
//           )}
//         </Box>

//         {products.length > 0 && (
//           <Box
//             sx={{
//               width: { xs: "100%", md: "30%" },
//               height: "300px",
//               backgroundColor: theme.palette.primary.main,
//               color: theme.palette.text.primary,
//               p: 3,
//               borderRadius: 2,
//               display: "flex",
//               flexDirection: "column",
//               gap: 2,
//               boxShadow: 4,
//             }}
//           >
//             <Typography fontWeight="bold">
//               مبلغ کل: {totalPrice.toLocaleString()} تومان
//             </Typography>
//             <Typography>
//               تخفیف کل: {totalDiscount.toLocaleString()} تومان
//             </Typography>
//             <Button
//               variant="contained"
//               color="inherit"
//               sx={{
//                 backgroundColor: "white",
//                 color: theme.palette.error.main,
//                 fontWeight: "bold",
//                 "&:hover": {
//                   backgroundColor: theme.palette.error.light,
//                   color: theme.palette.text.primary,
//                 },
//               }}
//               onClick={handleClear}
//               startIcon={<DeleteIcon />}
//             >
//               پاک کردن کل سبد
//             </Button>
//             <Button
//               variant="contained"
//               sx={{
//                 backgroundColor: "#fff",
//                 color: "green",
//                 fontWeight: "bold",
//                 "&:hover": {
//                   backgroundColor: "green",
//                   color: theme.palette.text.primary,
//                 },
//               }}
//             >
//               تکمیل خرید
//             </Button>
//           </Box>
//         )}
//       </Box>
//     </Box>
//   );
// }



import {
  Box,
  Typography,
  useTheme,
  Button,
  IconButton,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import fetchData from "../../Utils/fetchData";
import EmptyCart from "./EmptyCart";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const theme = useTheme();
  const [products, setProducts] = useState([]);
  const [allVariants, setAllVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await fetchData("cart", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setProducts(res.data.items);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVariants = async () => {
    try {
      const res = await fetchData("variant");
      setAllVariants(res.data);
    } catch (error) {
      console.error("Error fetching variants:", error);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchVariants();
  }, []);

  const modifyCart = async (variantId, method, body = {}, onSuccess) => {
    try {
      await fetchData("cart", {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Cart operation error:", error);
    }
  };

  const handleAdd = (variantId) => {
    modifyCart(variantId, "POST", { productVariantId: variantId, quantity: 1 }, () => {
      setProducts((prev) =>
        prev.map((item) =>
          item.productVariantId._id === variantId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    });
  };

  const handleRemove = (variantId) => {
    const item = products.find((item) => item.productVariantId._id === variantId);
    if (!item) return;

    if (item.quantity === 1) {
      handleDeleteItem(variantId);
    } else {
      modifyCart(variantId, "PATCH", { productVariantId: variantId }, () => {
        setProducts((prev) =>
          prev.map((item) =>
            item.productVariantId._id === variantId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
        );
      });
    }
  };

  const handleDeleteItem = (variantId) => {
    setSelectedVariantId(variantId);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    modifyCart(selectedVariantId, "PATCH", {
      productVariantId: selectedVariantId,
      removeAll: true,
    }, () => {
      setProducts((prev) =>
        prev.filter((item) => item.productVariantId._id !== selectedVariantId)
      );
      setOpenDeleteDialog(false);
    });
  };

  const handleClear = () => {
    modifyCart(null, "DELETE", {}, () => setProducts([]));
  };

  const { totalPrice, totalDiscount } = useMemo(() => {
    return products.reduce(
      (acc, item) => {
        const realPrice = item.productVariantId.price;
        const discount = realPrice - item.finalPrice;
        return {
          totalPrice: acc.totalPrice + item.finalPrice * item.quantity,
          totalDiscount: acc.totalDiscount + discount * item.quantity,
        };
      },
      { totalPrice: 0, totalDiscount: 0 }
    );
  }, [products]);

  const CartItem = React.memo(
    ({ item, variant, onAdd, onRemove, onDelete }) => {
      const maxStock = item.productVariantId.quantity;
      const isAddDisabled = item.quantity >= maxStock;

      return (
        <Box
          sx={{
            width: "100%",
            minHeight: "130px",
            p: 2,
            backgroundColor: theme.palette.background.card,
            borderRadius: 2,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: 2,
            gap: 2,
            position: "relative",
          }}
        >
          <IconButton
            onClick={() => onDelete(item.productVariantId._id)}
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              color: theme.palette.error.main,
              "&:hover": { backgroundColor: theme.palette.error.light },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          <Box sx={{ width: "40%" }}>
            <Typography
              fontWeight="bold"
              color={theme.palette.text.third}
              sx={{
                cursor: "pointer",
                "&:hover": { color: theme.palette.background.buttom },
              }}
              onClick={() =>
                navigate(
                  `/product-details/${item.productId._id}/${item.productId.title.replaceAll(" ", "-")}`
                )
              }
            >
              {item.productId.title}
            </Typography>
            <Typography color={theme.palette.text.third}>
              قیمت: {item.productVariantId.priceAfterDiscount.toLocaleString()} تومان
            </Typography>
          </Box>

          {variant && (
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: variant.value,
                border: `3px solid ${theme.palette.background.box}`,
              }}
            />
          )}

          <Box
            component="img"
            src={`${import.meta.env.VITE_BASE_URL + item.productId.imagesUrl[0]}`}
            sx={{ width: 80, height: 80, cursor: "pointer" }}
            alt={item.productId.title}
            onClick={() =>
              navigate(
                `/product-details/${item.productId._id}/${item.productId.title.replaceAll(" ", "-")}`
              )
            }
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mt: 1,
              p: 1,
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <IconButton
              onClick={() => onAdd(item.productVariantId._id)}
              disabled={isAddDisabled}
              sx={{
                backgroundColor: isAddDisabled
                  ? theme.palette.action.disabledBackground
                  : theme.palette.primary.light,
                color: isAddDisabled
                  ? theme.palette.action.disabled
                  : theme.palette.primary.contrastText,
                "&:hover": {
                  backgroundColor: isAddDisabled
                    ? theme.palette.action.disabledBackground
                    : theme.palette.primary.main,
                },
              }}
            >
              <AddIcon />
            </IconButton>

            <Typography
              sx={{
                fontWeight: "bold",
                minWidth: "24px",
                textAlign: "center",
                color: theme.palette.primary.main,
              }}
            >
              {item.quantity}
            </Typography>

            <IconButton
              onClick={() => onRemove(item.productVariantId._id)}
              sx={{
                backgroundColor: theme.palette.error.light,
                color: theme.palette.error.contrastText,
                "&:hover": { backgroundColor: theme.palette.error.main },
              }}
            >
              <RemoveIcon />
            </IconButton>
          </Box>
        </Box>
      );
    }
  );

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "80vh",
          mt: { xs: "80px", md: "130px" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "80vh", mt: { xs: "80px", md: "130px" } }}>
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>حذف محصول</DialogTitle>
        <DialogContent>
          <DialogContentText>
            آیا از حذف این محصول از سبد خرید مطمئن هستید؟
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            انصراف
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            حذف
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ height: 50, px: { xs: 1, md: 4 }, borderBottom: `1px solid ${theme.palette.background.border}` }}>
        <Typography variant="h6" sx={{ color: theme.palette.text.secondary, lineHeight: "50px" }}>
          سبد خرید <ChevronLeftIcon fontSize="small" />
        </Typography>
      </Box>

      <Box sx={{ p: { xs: 2, md: 5 }, display: "flex", gap: 4, flexDirection: { xs: "column", md: "row" } }}>
        <Box sx={{ flex: 1, backgroundColor: theme.palette.primary.main, borderRadius: 2, p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {products.length > 0 ? (
            products.map((item, index) => {
              const variant = allVariants.find((a) => a._id === item.productVariantId.variantId);
              return (
                <CartItem
                  key={`${item.productVariantId._id}-${index}`}
                  item={item}
                  variant={variant}
                  onAdd={handleAdd}
                  onRemove={handleRemove}
                  onDelete={handleDeleteItem}
                />
              );
            })
          ) : (
            <EmptyCart />
          )}
        </Box>

        {products.length > 0 && (
          <Box sx={{ width: { xs: "100%", md: "30%" }, height: "300px", backgroundColor: theme.palette.primary.main, color: theme.palette.text.primary, p: 3, borderRadius: 2, display: "flex", flexDirection: "column", gap: 2, boxShadow: 4 }}>
            <Typography fontWeight="bold">
              مبلغ کل: {totalPrice.toLocaleString()} تومان
            </Typography>
            <Typography>
              تخفیف کل: {totalDiscount.toLocaleString()} تومان
            </Typography>
            <Button variant="contained" color="inherit" sx={{ backgroundColor: "white", color: theme.palette.error.main, fontWeight: "bold", "&:hover": { backgroundColor: theme.palette.error.light, color: theme.palette.text.primary } }} onClick={handleClear} startIcon={<DeleteIcon />}>
              پاک کردن کل سبد
            </Button>
            <Button variant="contained" sx={{ backgroundColor: "#fff", color: "green", fontWeight: "bold", "&:hover": { backgroundColor: "green", color: theme.palette.text.primary } }}>
              تکمیل خرید
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
