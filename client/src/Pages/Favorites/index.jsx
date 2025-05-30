import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useSelector } from "react-redux";
import fetchData from "../../Utils/fetchData";
import FavProduct from "./FavProduct";
import EmptyFavorites from "./EmptyFavorites";

export default function Favorite() {
  const theme = useTheme();
  const [products, setProducts] = useState([]);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    (async () => {
      const res = await fetchData("user/favorites", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setProducts(res.data);
    })();
  }, [token]);

  const handleRemoveFromFavorites = (id) => {
    setProducts((prev) => prev.filter((item) => item._id !== id));
  };

  return (
    <Box sx={{ Height: "80vh", mt: { xs: "80px", md: "130px" } }}>
      <Box
        sx={{
          width: "100%",
          height: "50px",
          px: { xs: 1, md: "4%" },
          borderBottom: `1px solid ${theme.palette.background.border}`,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: { xs: "14px", md: "16px" },
            lineHeight: "50px",
          }}
        >
          علاقه‌مندی‌ها
          <ChevronLeftIcon fontSize="small" />
        </Typography>
      </Box>

      {products.length === 0 ? (
        <Box
                  sx={{
                    width: { xs: "100%", md: "60%" },
                    backgroundColor: theme.palette.background.box,
                    borderRadius: 2,
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                   margin:'40px auto',
                    gap: 2,
                  }}
                >
                  <EmptyFavorites/>
                </Box>
        
      ) : (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 2,
            px: { xs: 1, md: 4 },
            py: 3,
          }}
        >
          {products.map((product) => (
            <FavProduct
              key={product._id}
              title={product.title}
              variantId={product.defaultProductVariantId}
              id={product._id}
              image={product.imagesUrl[0]}
              onRemove={handleRemoveFromFavorites}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
