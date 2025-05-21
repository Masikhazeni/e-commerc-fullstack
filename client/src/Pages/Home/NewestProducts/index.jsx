import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import fetchData from "../../../Utils/fetchData";
import NewProduct from "./NewProduct";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

export default function NewestProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const swiperRef = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetchData("product?sort=-createdAt&limit=8");
        if (res.data) {
          setProducts(res.data);
          setIsLoading(false);
          
          // به روزرسانی Swiper پس از بارگذاری داده‌ها
          if (swiperRef.current) {
            setTimeout(() => {
              swiperRef.current.swiper.update();
              swiperRef.current.swiper.slideTo(0);
            }, 100);
          }
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);
  

  const handleSwiperReady = (swiper) => {
    setTimeout(() => {
      swiper.update();
      swiper.slideTo(0);
    }, 300);
  };

  const items = products.map((p) => (
    <SwiperSlide
      key={p._id}
      style={{
        width:'330px',
        height: "360px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <NewProduct title={p.title} image={p.imagesUrl?.[0]} id={p._id} />
    </SwiperSlide>
  ));

  return (
    <Box
      sx={{
        width: "94%",
        margin: "0 auto",
       borderRadius:'10px',
        py: 4,
        px:'5%',
        backgroundColor:theme.palette.background.box ,
        overflow: "hidden",
        height:'500px',
        pb:'40px',
        mb:'40px'
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
        جدیدترین محصولات
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
            1200: { slidesPerView: 5 },
          }}
          loop={products.length > 1}
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

