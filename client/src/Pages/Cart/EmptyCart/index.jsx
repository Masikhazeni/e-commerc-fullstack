import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function EmptyCart() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        textAlign: "center",
        py: 10,
        px: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        backgroundColor: "#f9f9f9",
        borderRadius: 3,
        boxShadow: 2,
      }}
    >
      <ShoppingCartIcon sx={{ fontSize: 80, color: "#ccc" }} />
      <Typography variant="h6" sx={{ color: "text.secondary", fontWeight: "bold" }}>
        سبد خرید شما خالی است!
      </Typography>
      <Typography sx={{ color: "text.disabled" }}>
        برای مشاهده و خرید محصولات به فروشگاه ما سر بزنید.
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate("/")}
        sx={{
          mt: 2,
          px: 4,
          py: 1,
          borderRadius: "8px",
          fontWeight: "bold",
          backgroundColor: "primary.main",
          color: "white",
          "&:hover": {
            backgroundColor: "primary.dark",
          },
        }}
      >
        رفتن به فروشگاه
      </Button>
    </Box>
  );
}

export default EmptyCart;
