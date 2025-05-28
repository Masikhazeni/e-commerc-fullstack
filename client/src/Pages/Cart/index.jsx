import { Box, Typography, useTheme, Button, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import fetchData from "../../Utils/fetchData";
import EmptyCart from "./EmptyCart";

export default function Cart() {
  const theme = useTheme();
  const [products, setProducts] = useState([]);
  const [allVariants, setAllVariants] = useState([]);
  const { token } = useSelector((state) => state.auth);

  const fetchCart = async () => {
    const res = await fetchData("cart", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    setProducts(res.data.items);
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  useEffect(() => {
    (async () => {
      const res = await fetchData("variant");
      setAllVariants(res.data);
    })();
  }, []);

  const handleAdd = async (variantId) => {
    await fetchData("cart", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productVariantId: variantId, quantity: 1 }),
    });
    fetchCart();
  };

  const handleRemove = async (variantId) => {
    await fetchData("cart", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productVariantId: variantId }),
    });
    fetchCart();
  };

  const handleClear = async () => {
    await fetchData("cart", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    fetchCart();
  };

  const totalPrice = products.reduce(
    (acc, item) => acc + item.finalPrice * item.quantity,
    0
  );

  const totalDiscount = products.reduce((acc, item) => {
    const realPrice = item.productVariantId.price;
    const discount = realPrice - item.finalPrice;
    return acc + discount * item.quantity;
  }, 0);

  const cartItems = products.map((e, index) => {
    const variant = allVariants.find(
      (a) => a._id === e.productVariantId.variantId
    );
    const maxStock = e.productVariantId.quantity;
    const isAddDisabled = e.quantity >= maxStock;

    return (
      <Box
        key={index}
        sx={{
          width: "100%",
          p: 2,
          backgroundColor: theme.palette.background.card,
          borderRadius: 2,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: 2,
          gap: 2,
        }}
      >
        <Box>
          <Typography
            fontWeight="bold"
            sx={{ color: theme.palette.text.third }}
          >
            نام محصول: {e.productId.title}
          </Typography>
          <Typography sx={{ color: theme.palette.text.third }}>
            قیمت: {e.productVariantId.priceAfterDiscount.toLocaleString()} تومان
          </Typography>
        </Box>

        {variant && (
          <Box
            sx={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              backgroundColor: variant.value,
              border: "1px solid #ccc",
            }}
          />
        )}

        <Box
          component="img"
          src={`${import.meta.env.VITE_BASE_URL + e.productId.imagesUrl[0]}`}
          sx={{ width: 80, height: 80, borderRadius: "50%" }}
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
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <IconButton
            onClick={() => handleAdd(e.productVariantId._id)}
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
              color: theme.palette.text.secondary,
              fontWeight: "bold",
              minWidth: "24px",
              textAlign: "center",
            }}
          >
            {e.quantity}
          </Typography>

          <IconButton
            onClick={() => handleRemove(e.productVariantId._id)}
            sx={{
              backgroundColor: theme.palette.error.light,
              color: theme.palette.error.contrastText,
              "&:hover": {
                backgroundColor: theme.palette.error.main,
              },
            }}
          >
            <RemoveIcon />
          </IconButton>
        </Box>
      </Box>
    );
  });

  return (
    <Box sx={{ minHeight: "80vh", mt: { xs: "80px", md: "130px" } }}>
      <Box
        sx={{
          width: "100%",
          height: "50px",
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
          سبد خرید <ChevronLeftIcon fontSize="small" />
        </Typography>
      </Box>

      <Box
        sx={{
          width: "100%",
          p: "5%",
          mb: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "start",
          gap: "30px",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "60%" },
            backgroundColor: theme.palette.background.box,
            borderRadius: 2,
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {products.length > 0 ? (
            cartItems
          ) : (
            <Box>{products.length === 0 ? <EmptyCart /> : cartItems}</Box>
          )}
        </Box>

        {products.length > 0 && (
          <Box
            sx={{
              width: { xs: "100%", md: "30%" },
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.text.primary,
              p: 3,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              boxShadow: 4,
            }}
          >
            <Typography fontWeight="bold">
              مبلغ کل: {totalPrice.toLocaleString()} تومان
            </Typography>
            <Typography>
              تخفیف کل: {totalDiscount.toLocaleString()} تومان
            </Typography>
            <Button
              variant="contained"
              color="inherit"
              sx={{
                backgroundColor: "white",
                color: "red",
                fontWeight: "bold",
              }}
              onClick={handleClear}
              startIcon={<DeleteIcon />}
            >
              پاک کردن کل سبد
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#fff",
                color: "green",
                fontWeight: "bold",
                mt: 2,
              }}
            >
              تکمیل خرید
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
