import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import fetchData from "../../../Utils/fetchData";
import { useNavigate } from "react-router-dom";

export default function MainSection() {
  const [parents, setParents] = useState([]);
  const theme = useTheme();
  const navigate=useNavigate()

  useEffect(() => {
    (async () => {
      const res = await fetchData("brand");
      setParents(res.data);
    })();
  }, []);

  const items = parents?.map((e, index) => (
    <Box
      key={index}
      onClick={() => navigate(`/brands/${e._id}/${e.name.replaceAll(" ", "-")}`)}
      sx={{
        width: {
          xs: "150px", // موبایل
          sm: "180px", // تبلت کوچک
          md: "200px", // تبلت بزرگ
          lg: "220px", // دسکتاپ کوچک
          xl: "250px" // دسکتاپ بزرگ
        },
        height: {
          xs: "150px",
          sm: "180px",
          md: "200px",
          lg: "220px",
          xl: "250px"
        },
        padding: "10px",
        flexShrink: 0,
        borderRadius: "10px",
        border: `2px solid ${theme.palette.primary.main}`,
        backgroundColor: theme.palette.background.box,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: 4,
          zIndex: 2
        },
        "@media (max-width: 1200px) and (min-width: 900px)": {
          width: "180px",
          height: "180px"
        },
        "@media (max-width: 900px) and (min-width: 600px)": {
          width: "160px",
          height: "160px"
        }
      }}
    >
      <Box
        component={"img"}
        src={import.meta.env.VITE_BASE_URL + e?.image}
        alt={e.name}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          transition: "all 0.3s ease",
          borderRadius: "8px",
          padding: "5px"
        }}
      />
    </Box>
  ));

  return (
    <Box
      component={"section"}
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        width: "94%",
        margin: "0 auto",
        borderRadius: "10px",
        py: 4,
        px: { xs: "2%", sm: "3%", md: "5%" },
        backgroundColor: theme.palette.primary.main,
        minHeight: "100px",
        mb: "40px",
        overflow: "hidden"
      }}
    >
      <Typography
        sx={{
          color: theme.palette.text.primary,
          fontSize: { xs: "1.4rem", sm: "1.7rem", md: "2rem" },
          fontWeight: 600,
          mb: 3,
          textAlign: "center",
          padding: "0 10px"
        }}
      >
        خرید از طریق برندها
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          gap: {
            xs: "10px",
            sm: "12px",
            md: "15px",
            lg: "20px"
          },
          minHeight: "300px",
          maxWidth: "1400px",
          margin: "0 auto",
          padding: { xs: "0 5px", sm: "0 10px", md: "0 15px" }
        }}
      >
        {items}
      </Box>
    </Box>
  );
}
