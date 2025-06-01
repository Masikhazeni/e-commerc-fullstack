import { Box, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import fetchData from "../../../Utils/fetchData";
import { useNavigate } from "react-router-dom";

export default function BrowseByCategory() {
  const theme = useTheme();
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const res = await fetchData("category?limit=1000");
      setCategories(res.data || []);
    })();
  }, []);

  const subCategories = categories.filter((e) => e.parentCategory !== null);
  
  const items = subCategories?.map((e, index) => (
    <Box
      key={index}
      onClick={() => navigate(`/product/${e._id}/${e.name.replaceAll(" ", "-")}`)}
      sx={{
        width: {
          xs: "120px",  // موبایل
          sm: "150px",  // تبلت کوچک
          md: "180px",  // تبلت بزرگ
          lg: "200px",  // دسکتاپ کوچک
          xl: "220px"   // دسکتاپ بزرگ
        },
        height: {
          xs: "120px",
          sm: "150px",
          md: "180px",
          lg: "200px",
          xl: "220px"
        },
        border: `1px solid ${theme.palette.background.border}`,
        borderRadius: "50%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 1,
        backgroundColor: theme.palette.primary.main,
        border:`3px solid ${theme.palette.background.box} `,
        transition: "all 0.3s ease",
        cursor: "pointer",
        "&:hover": {
          boxShadow: 4,
          transform: "scale(1.05)",
          zIndex: 2
        },
        marginBottom: {
          xs: "20px",
          sm: "30px",
          md: "40px"
        },
        "@media (max-width: 1200px) and (min-width: 900px)": {
          width: "160px",
          height: "160px"
        },
        "@media (max-width: 900px) and (min-width: 600px)": {
          width: "140px",
          height: "140px"
        }
      }}
    >
      <Box
        component={"img"}
        src={`${import.meta.env.VITE_BASE_URL + e.image}`}
        alt={e.name}
        sx={{
          width: "90%",
          height: "90%",
          objectFit: "contain",
          borderRadius: "50%"
        }}
      />
    </Box>
  ));

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "300px",
        marginTop: {
          xs: "20px",
          sm: "30px",
          md: "40px"
        },
        paddingX: {
          xs: "16px",  // موبایل
          sm: "24px",  // تبلت کوچک
          md: "48px",  // تبلت بزرگ
          lg: "80px"   // دسکتاپ
        },
        backgroundColor: theme.palette.background.default,
        paddingY: {
          xs: "24px",
          sm: "32px",
          md: "40px"
        }
      }}
    >
      <Typography
        sx={{
          color: theme.palette.text.secondary,
          fontSize: {
            xs: "1.4rem",  // ~22px
            sm: "1.6rem",  // ~25px
            md: "1.8rem"   // ~28px
          },
          fontWeight: "600",
          marginBottom: {
            xs: "16px",
            sm: "20px",
            md: "24px"
          },
          textAlign: "center"
        }}
      >
        دسته‌بندی‌ها
      </Typography>
      
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: {
            xs: "16px",  // موبایل
            sm: "20px",   // تبلت کوچک
            md: "24px",  // تبلت بزرگ
            lg: "32px"    // دسکتاپ
          }
        }}
      >
        {items}
      </Box>
    </Box>
  );
}
