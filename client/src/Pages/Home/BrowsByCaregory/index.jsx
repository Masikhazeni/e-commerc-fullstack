import { Box, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import fetchData from "../../../Utils/fetchData";
import { useNavigate } from "react-router-dom";

export default function BrowseByCategory() {
  const theme = useTheme();
  const [categories, setCategories] = useState([]);
  const navigate=useNavigate()

  useEffect(() => {
    (async () => {
      const res = await fetchData("category?limit=1000");
      setCategories(res.data || []);
    })();
  }, []);

  const subCategories = categories.filter((e) => e.parentCategory !== null);
  const items= subCategories?.map((e, index) => (
          <Box
            key={index}
            onClick={() => {
                navigate(
                  `/product/${e._id}/${e.name.replaceAll(" ", "-")}`
                )}}
            sx={{
              width: '220px',
              height: " 220px",
              border: `1px solid ${theme.palette.background.border}`,
              borderRadius: "50%",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 1,
              backgroundColor: theme.palette.background.paper,
              transition: "all 0.3s",
              "&:hover": {
                boxShadow: 4,
                transform: "scale(1.05)",
              },
              mb:'40px'
            }}
          >
            <Box
              component={"img"}
              src={`${import.meta.env.VITE_BASE_URL + e.image}`}
              alt={e.name}
              sx={{
                width: "100%",
                height: "70%",
              }}
            />
            {/* <Typography
              sx={{
                fontSize: "18px",
                fontWeight: 500,
                mt: 1,
                textAlign: "center",
                color:theme.palette.text.secondary,
                fontWeight:'600',
              }}
            >
              {e.name}
            </Typography> */}
          </Box>
        ))

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
        دسته‌بندی‌ها
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
       {items}
      </Box>
    </Box>
  );
}

