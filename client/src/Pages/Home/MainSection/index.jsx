import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import fetchData from "../../../Utils/fetchData";

export default function MainSection() {
  const [parents, setParents] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    (async () => {
      const res = await fetchData("category?parentCategory=null");
      setParents(res.data);
    })();
  }, []);

  if (!parents.length) return null;
  


  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
        gap: 2,
        mt: 4,
        px: { xs: 2, md: 10 },
        height: "600px",
      }}
    >
      {/* Right big box */}
      <Box
        sx={{
          position: "relative",
          backgroundColor: theme.palette.primary.main,
          borderRadius: 3,
          overflow: "hidden",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          "&:hover .bg-image": {
            transform: "scale(1.05)",
          },
        }}
      >
        <Box
          className="bg-image"
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundImage: `url(${import.meta.env.VITE_BASE_URL + parents[1].image})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 1,
            zIndex: 1,
            transition: "transform 0.4s ease",
          }}
        />
        <Box sx={{ position: "relative", zIndex: 2, p: 3, width: "100%" }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#fff" }}>
            {parents[1].name}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: "#fff" }}>
            محصولات محبوب در دسته {parents[1].name}
          </Typography>
        </Box>
      </Box>

      {/* Left two stacked boxes */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {[0, 2].map((i) =>
          parents[i] ? (
            <Box
              key={parents[i]._id}
              sx={{
                flex: 1,
                borderRadius: 3,
                overflow: "hidden",
                position: "relative",
                backgroundColor: theme.palette.primary.main,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                "&:hover .bg-image": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <Box
                className="bg-image"
                sx={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  backgroundImage: `url(${import.meta.env.VITE_BASE_URL + parents[i].image})`,
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  opacity: 1,
                  zIndex: 1,
                  transition: "transform 0.4s ease",
                }}
              />
              <Box sx={{ position: "relative", zIndex: 2, p: 2, width: "100%" }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: "#fff",
                  }}
                >
                  {parents[i].name}
                </Typography>
                <Typography variant="caption" sx={{ color: "#fff" }}>
                  دسته‌بندی {parents[i].name}
                </Typography>
              </Box>
            </Box>
          ) : null
        )}
      </Box>
    </Box>

   
  );
}
