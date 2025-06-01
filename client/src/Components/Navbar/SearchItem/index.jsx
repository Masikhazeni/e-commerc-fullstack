import { Box, Stack, Typography, useTheme } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function SearchItem({ img, title, type, id }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const handleClick = () => {
    let path = "";

    if (type === "category") {
      path = "product";
    } else if (type === "product") {
      path = "product-details";
    } else if (type === "brand") {
      path = "brands";
    } else {
      path = "unknown";
    }

    navigate(`/${path}/${id}/${title.replaceAll(" ", "-")}`);
  };
  return (
    <Stack
      onClick={handleClick}
      sx={{
        flexDirection: "row",
        justifyContent:'space-around',
        alignItems: "center",
        // gap: "10%",
        cursor: "pointer",
        borderBottom:`1px solid ${theme.palette.text.secondary}`
      }}
    >
      <Box
        component={"img"}
        src={import.meta.env.VITE_BASE_URL + img}
        alt={title}
        sx={{ height: "60px", width: "60px" }}
      />
      <Typography sx={{ color: theme.palette.text.secondary }} variant="body2">
        {title}
      </Typography>
    </Stack>
  );
}
