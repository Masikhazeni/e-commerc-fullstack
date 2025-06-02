import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import fetchData from "../../../Utils/fetchData";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import MoreDiscountProduct from "./MoreDiscountProduct";
export default function ThemostDiscount() {
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const swiperRef = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        setIsLoading(true);
        
        // Fetch products and variants in parallel
        const [productsRes, variantsRes] = await Promise.all([
          fetchData("product?limit=1000"),
          fetchData("product-variant?limit=1000&discount[gte]=15")
        ]);

        if (productsRes.data && variantsRes.data) {
          setProducts(productsRes.data);
          setVariants(variantsRes.data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataAsync();
  }, []);

  // Get products with high discount variants
  const highDiscountProducts = products.filter(product => 
    variants.some(variant => variant.productId._id === product._id)
  );

  const handleSwiperReady = (swiper) => {
    setTimeout(() => {
      swiper.update();
      swiper.slideTo(0);
    }, 300);
  };

  const items = highDiscountProducts.map((product) => {
    // Find the variant with highest discount for this product
    const productVariants = variants.filter(v => v.productId._id === product._id);
    const highestDiscountVariant = productVariants.reduce((prev, current) => 
      (prev.discount > current.discount) ? prev : current
    );

    return (
      <SwiperSlide
        key={product._id}
        style={{
          width: '330px',
          height: "360px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MoreDiscountProduct 
          title={product.title} 
          image={product.imagesUrl?.[0]} 
          id={product._id} 
          variantData={highestDiscountVariant}
        />
      </SwiperSlide>
    );
  });

  return (
    <Box
      sx={{
        width: "94%",
        margin: "0 auto",
        borderRadius: '10px',
        py: 4,
        px: '5%',
        backgroundColor: theme.palette.background.buttom,
        overflow: "hidden",
        height: '500px',
        pb: '40px',
        mb: '40px'
      }}
    >
      <Typography
        sx={{
          color: theme.palette.text.secondary,
          fontSize: { xs: 22, md: 28 },
          fontWeight: 600,
          mb: 3,
          textAlign: "center",
        }}
      >
        پیشنهادهای شگفت انگیز
      </Typography>

      {!isLoading && (
        <Swiper
          ref={swiperRef}
          slidesPerView={6}
          spaceBetween={40}
          breakpoints={{
            320: { slidesPerView: 1 },
            600: { slidesPerView: 2 },
            900: { slidesPerView: 3 },
             1100: { slidesPerView: 3 },
             1170: { slidesPerView: 3.5 },
            1200: { slidesPerView: 4.5 },
          }}
          loop={highDiscountProducts.length > 1}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{ clickable: true }}
          modules={[Pagination, Autoplay]}
          onInit={handleSwiperReady}
          onAfterInit={handleSwiperReady}
          style={{ 
            paddingBottom: "40px",
            width: "100%",
          }}
        >
          {items}
        </Swiper>
      )}
    </Box>
  );
}