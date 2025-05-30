import React from 'react';
import {
  Card,
  Box,
  Typography,
  Button,
  CardContent
} from '@mui/material';
import { Link } from 'react-router-dom';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';

export default function Product({
  id,
  image,
  title,
  brand,
  minPrice,
  maxPrice,
  hasDiscount,
  theme,
  getBrandName,
  formatPrice
}) {
  return (
    <Card
      sx={{
        width: "300px",
        height: "520px",
        display: "flex",
        // border: `1px solid ${theme.palette.text.secondary}`,
        backgroundColor: theme.palette.background.Card,
        flexDirection: "column",
        padding: "5px",
        position: "relative",
        overflow: "hidden",
        transition: "transform .3s",
        boxShadow:'0 0 10px 0 rgba(0,0,0,.2)',
        "&:hover": { transform: "scale(1.04)" },
      }}
    >
      <Box
        component="img"
        src={`${import.meta.env.VITE_BASE_URL + image}`}
        alt={title}
        sx={{ width: "100%", height: "300px" }}
      />
      <CardContent
        sx={{
          flexGrow: 1,
          color: theme.palette.text.secondary,
        }}
      >
        <Typography gutterBottom variant="h6" component="h2">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {getBrandName(brand)}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.palette.grey[100],
            padding: "8px",
            gap: "5px",
            borderRadius: "4px",
          }}
        >
          <Box>
            <Typography
              variant="body1"
              color="primary"
              fontWeight="bold"
            >
              {formatPrice(minPrice)}
            </Typography>
          </Box>
          {minPrice !== maxPrice && (
            <Typography
              sx={{ color: theme.palette.primary.main }}
            >
              <HorizontalRuleIcon />
            </Typography>
          )}

          {minPrice !== maxPrice && (
            <Typography
              variant="body1"
              color="primary"
              fontWeight="bold"
            >
              {formatPrice(maxPrice)}
            </Typography>
          )}
          <Typography sx={{ width: "100%" }}>تومان</Typography>
        </Box>
      </CardContent>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Button
          component={Link}
          to={`/product-details/${id}/${title.replaceAll(" ", "-")}`}
          variant="contained"
          size="large"
          sx={{
            mt: 1,
            mb: "8px",
            borderRadius: 2,
            backgroundColor: theme.palette.background.buttom,
            "&:hover": {
              backgroundColor: theme.palette.background.buttomHover,
            },
          }}
        >
          مشاهده محصول
        </Button>
      </Box>
    </Card>
  );
}
