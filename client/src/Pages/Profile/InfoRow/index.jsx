import { useTheme } from "@emotion/react";
import { Box, Typography } from "@mui/material";

export default function InfoRow ({ label, value }) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        p: 2,
        mb: 1,
        backgroundColor: theme.palette.background.default,
        color:theme.palette.text.secondary
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
        {label} :
      </Typography>
     
      <Typography variant="body1" fontWeight="500" color="text.secondary" textAlign={'start'}>
        {value || "—"}
      </Typography>
    </Box>
  );
};