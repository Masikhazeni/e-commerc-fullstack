import { Box, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import fetchData from "../../../Utils/fetchData";
import NewProduct from "./NewProduct";

export default function NewestProducts() {
  const [products, setProducts] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchData("product?sort=-createdAt&limit=8");
        if (res.data) {
          setProducts(res.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    })();
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "300px",
        mt: 4,
        px: { xs: 2, md: 10 },
        backgroundColor: theme.palette.background.default,
        py: 4,
      }}
    >
      <Typography
        sx={{
          color: theme.palette.text.secondary,
          fontSize: { xs: "22px", md: "28px" },
          fontWeight: "600",
          mb: 3,
          textAlign: "center",
        }}
      >
        جدیدترین محصولات
      </Typography>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 4,
        }}
      >
        {products.map((product) => (
          <NewProduct
            key={product._id}
            title={product.title}
            image={product.imagesUrl?.[0]}
            id={product._id}
          />
        ))}
      </Box>
    </Box>
  );
}
