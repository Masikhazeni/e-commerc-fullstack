import "./style.css";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

import {
  EffectFade,
  Autoplay,
  Navigation,
  Pagination,
} from "swiper/modules";
import { Box, Button, Typography, useTheme } from "@mui/material";
import fetchData from "../../../Utils/fetchData";
import { useNavigate } from "react-router-dom";

export default function MainSlider() {
  const [slider, setSlider] = useState([]);
  const navigate=useNavigate()
  const theme=useTheme()

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchData("slider");
        setSlider(res.data || []);
      } catch (err) {
        console.error("Failed to load slider data:", err);
      }
    })();
  }, []);

  return (
    <Box sx={{ width: "100%", height: "100vh", position: "relative" }}>
      <Swiper
        spaceBetween={0}
        effect="fade"
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        modules={[EffectFade, Autoplay, Navigation, Pagination]}
        className="home-swiper"
        style={{ height: "100%" }}
      >
        {slider.map((e, index) => (
          <SwiperSlide key={index}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: "95vh",
              }}
            >
              {/* بک‌گراند تصویر */}
              <Box
                component="img"
                src={`${import.meta.env.VITE_BASE_URL + e.image}`}
                alt={e.title || `slide-${index}`}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "top",
                }}
              />

              {/* لایه متن و دکمه */}
              <Box
                sx={{
                  position: "absolute",
                  top: "70%",
                  right: "10%",
                  transform: "translateY(-50%)",
                  background: "rgba(0,0,0,0.5)",
                  padding: { xs: 2, md: 4 },
                  borderRadius: "16px",
                  maxWidth: "500px",
                  color: "#fff",
                }}
              >
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {e.title}
                </Typography>
                <Box
                component={'button'}
                  variant="contained"
                  color="primary"
                  
                  onClick={()=>navigate(`${e.href}`)}
                  
                  sx={{
                    mt: 2,
                    borderRadius: "999px",
                    px: 4,
                    py: 1.5,
                    fontSize: "1rem",
                    backgroundColor:theme.palette.secondary.main,
                    
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  }}
                >
                  مشاهده بیشتر
                </Box>
              </Box>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}

