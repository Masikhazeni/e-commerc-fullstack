import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton,
  Divider,
  Skeleton,
  styled,
  Pagination,
  Slider,
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import fetchData from "../../Utils/fetchData";
import Product from "./Product";

const SortButton = styled(Button)(({ theme, active }) => ({
  justifyContent: "flex-start",
  textTransform: "none",
  fontWeight: active ? 600 : 400,
  backgroundColor: active ? theme.palette.background.box : "transparent",
  color: active ? theme.palette.text.primary : theme.palette.text.secondary,
  borderColor: active ? theme.palette.primary.main : theme.palette.divider,
  "&:hover": {
    backgroundColor: active
      ? theme.palette.background.paper
      : theme.palette.action.hover,
    color: active ? "#fff" : theme.palette.text.primary,
  },
}));

const PriceSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.primary.main,
  height: 4,
  padding: "15px 0",
  "& .MuiSlider-thumb": {
    height: 20,
    width: 20,
    backgroundColor: "#fff",
    boxShadow: "0 0 2px 0px rgba(0, 0, 0, 0.1)",
    "&:hover": {
      boxShadow: "0 0 8px 0px rgba(0, 0, 0, 0.16)",
    },
    "&.Mui-active": {
      boxShadow: "0 0 14px 0px rgba(0, 0, 0, 0.16)",
    },
  },
  "& .MuiSlider-rail": {
    opacity: 0.5,
    backgroundColor: theme.palette.grey[500],
  },
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-valueLabel": {
    fontSize: 12,
    fontWeight: "normal",
    top: -6,
    backgroundColor: "unset",
    color: theme.palette.text.primary,
    "&:before": {
      display: "none",
    },
    "& *": {
      background: "transparent",
      color: theme.palette.mode === "dark" ? "#fff" : "#000",
    },
  },
}));

export default function Brands() {
  const { idBrand, brandName } = useParams();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [variants, setVariants] = useState([]);
  const [brands, setBrands] = useState([]);
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("lowest-price");
  const [page, setPage] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 0]);

  const itemsPerPage = 10;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const headerHeight = isMobile ? 90 : 130;

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  useEffect(() => {
    const fetchVariants = async () => {
      try {
        setLoading(true);
        const res = await fetchData("product-variant?limit=1000");
        setVariants(res.data);

        const groupedData = res.data.reduce((acc, variant) => {
          if (!acc[variant.productId._id]) {
            acc[variant.productId._id] = {
              product: variant.productId,
              variants: [],
            };
          }
          acc[variant.productId._id].variants.push(variant);
          return acc;
        }, {});
        setGrouped(groupedData);
      } catch (error) {
        console.error("Error fetching variants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVariants();
  }, [idBrand]);

  const getSortedProducts = () => {
    const filtered = Object.values(grouped).filter(
      (item) => item.product.brandId === idBrand
    );

    // Apply price range filter
    const priceFiltered = filtered.filter((item) => {
      const minVariantPrice = Math.min(
        ...item.variants.map((v) => v.priceAfterDiscount)
      );
      const maxVariantPrice = Math.max(
        ...item.variants.map((v) => v.priceAfterDiscount)
      );
      return (
        minVariantPrice >= priceRange[0] && maxVariantPrice <= priceRange[1]
      );
    });
    
    switch (sortOption) {
      case "lowest-price":
        return priceFiltered.sort((a, b) => {
          const minPriceA = Math.min(
            ...a.variants.map((v) => v.priceAfterDiscount)
          );
          const minPriceB = Math.min(
            ...b.variants.map((v) => v.priceAfterDiscount)
          );
          return minPriceA - minPriceB;
        });

      case "highest-price":
        return priceFiltered.sort((a, b) => {
          const maxPriceA = Math.max(
            ...a.variants.map((v) => v.priceAfterDiscount)
          );
          const maxPriceB = Math.max(
            ...b.variants.map((v) => v.priceAfterDiscount)
          );
          return maxPriceB - maxPriceA;
        });

      case "newest":
        return priceFiltered.sort((a, b) => {
          return new Date(b.product.createdAt) - new Date(a.product.createdAt);
        });

      case "oldest":
        return priceFiltered.sort((a, b) => {
          return new Date(a.product.createdAt) - new Date(b.product.createdAt);
        });

      default:
        return priceFiltered;
    }
  };

  const sortedProducts = getSortedProducts();
  const paginatedProducts = sortedProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fa-IR").format(price);
  };

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetchData("brand");
        setBrands(res.data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, []);

  const getBrandName = (brandId) => {
    if (!brands || brands.length === 0) return "نامشخص";
    const foundBrand = brands.find((brand) => brand._id === brandId);
    return foundBrand ? foundBrand.name : "نامشخص";
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    setPage(1);
  };

  const calculatePriceRange = () => {
    if (Object.keys(grouped).length === 0) return [0, 10000000];

    const allPrices = Object.values(grouped)
      .filter((item) => item.product.brandId === idBrand)
      .flatMap((item) => item.variants.map((v) => v.priceAfterDiscount));

    if (allPrices.length === 0) return [0, 10000000];

    const min = Math.min(...allPrices);
    const max = Math.max(...allPrices);
    return [Math.floor(min), Math.ceil(max)];
  };

  const [minPrice, maxPrice] = calculatePriceRange();
  useEffect(() => {
    if (minPrice !== undefined && maxPrice !== undefined) {
      setPriceRange([minPrice, maxPrice]);
    }
  }, [minPrice, maxPrice]);

  const renderProducts = () => {
    if (loading) {
      return [...Array(6)].map((_, index) => (
        <Box
          key={index}
          sx={{
            width: "300px",
            height: "400px",
            backgroundColor: theme.palette.grey[200],
            borderRadius: "4px",
            margin: "20px",
          }}
        >
          <Skeleton variant="rectangular" width="100%" height="200px" />
          <Box sx={{ p: 2 }}>
            <Skeleton variant="text" width="60%" height="30px" />
            <Skeleton variant="text" width="40%" height="20px" />
            <Skeleton
              variant="rectangular"
              width="100%"
              height="60px"
              sx={{ my: 2 }}
            />
            <Skeleton variant="text" width="80%" height="20px" />
            <Skeleton variant="text" width="80%" height="20px" />
          </Box>
        </Box>
      ));
    }

    return paginatedProducts.map((group) => {
      const { product, variants } = group;
      const prices = variants.map((v) => v.priceAfterDiscount);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const hasDiscount = variants.some((v) => v.discount > 0);
      
      return (
        <Product
          key={product._id}
          id={product._id}
          image={product.imagesUrl[0]}
          title={product.title}
          brand={product.brandId}
          minPrice={minPrice}
          maxPrice={maxPrice}
          hasDiscount={hasDiscount}
          theme={theme}
          getBrandName={getBrandName}
          formatPrice={formatPrice}
        />
      );
    });
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "50px",
          px: {xs:'6%',md:'4%'},
          mt: `${headerHeight}px`,
          borderBottom:`1px solid ${theme.palette.primary.main}`
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: theme.palette.text.secondary,
            fontSize: "16px",
            lineHeight: "50px",

          }}
        >
          خانه <ChevronLeftIcon />
          دسته بندی ها <ChevronLeftIcon />
          <span
            style={{
              fontSize: "18px",
              color: theme.palette.text.secondary,
              opacity: "1",
              fontWeight: "600",
            }}
          >
            {brandName?.replaceAll("-", " ")}
          </span>
        </Typography>
      </Box>

      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {/* Mobile sidebar */}
        {isMobile ? (
          <>
            <Box
              sx={{
                width: isSmallScreen ? "85%" : "65%",
                minHeight: "500px",
                position: "absolute",
                right: 0,
                top: "10%",
                backgroundColor: theme.palette.background.default,
                border: `1px solid ${theme.palette.text.secondary}`,
                borderRadius: "10px",
                boxShadow: theme.shadows[4],
                transform: mobileSidebarOpen
                  ? "translateX(0)"
                  : "translateX(100%)",
                transition: "transform 0.3s ease",
                zIndex: 800,
                p: "3% 6%",
                color: theme.palette.primary.main,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h6">فیلترها</Typography>
                <IconButton onClick={toggleMobileSidebar}>
                  <ChevronRightIcon />
                </IconButton>
              </Box>

              {/* Sorting options */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  مرتب‌سازی بر اساس:
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <SortButton
                    active={sortOption === "lowest-price"}
                    onClick={() => {
                      setSortOption("lowest-price");
                      setMobileSidebarOpen(false);
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <ArrowDownwardIcon fontSize="small" />
                      کمترین قیمت
                    </Box>
                  </SortButton>
                  <SortButton
                    active={sortOption === "highest-price"}
                    onClick={() => {
                      setSortOption("highest-price");
                      setMobileSidebarOpen(false);
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <ArrowUpwardIcon fontSize="small" />
                      بیشترین قیمت
                    </Box>
                  </SortButton>
                  <SortButton
                    active={sortOption === "newest"}
                    onClick={() => {
                      setSortOption("newest");
                      setMobileSidebarOpen(false);
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <NewReleasesIcon fontSize="small" />
                      جدیدترین محصولات
                    </Box>
                  </SortButton>
                  <SortButton
                    active={sortOption === "oldest"}
                    onClick={() => {
                      setSortOption("oldest");
                      setMobileSidebarOpen(false);
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AccessTimeIcon fontSize="small" />
                      قدیمی‌ترین محصولات
                    </Box>
                  </SortButton>
                </Box>
              </Box>

              {/* Price range slider */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  محدوده قیمت:
                </Typography>

                <PriceSlider
                  value={priceRange}
                  onChange={handlePriceChange}
                  valueLabelDisplay="auto"
                  aria-labelledby="range-slider"
                  min={minPrice}
                  max={maxPrice}
                  valueLabelFormat={(value) => formatPrice(value)}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "row-reverse",
                    mt: 1,
                  }}
                >
                  <Typography variant="caption">
                    {formatPrice(priceRange[0])} تومان
                  </Typography>
                  <Typography variant="caption">
                    {formatPrice(priceRange[1])} تومان
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Mobile sidebar toggle button */}
            {!mobileSidebarOpen && (
              <IconButton
                onClick={toggleMobileSidebar}
                sx={{
                  position: "absolute",
                  right: 0,
                  top: `${headerHeight + 5}px`,
                  backgroundColor: theme.palette.text.primary,
                  border:`1px solid ${theme.palette.primary.main}`,
                  color: theme.palette.primary.main,
                  borderRadius: "4px 0 0 4px",
                  zIndex: 700,
                }}
              >
                <ChevronLeftIcon />
              </IconButton>
            )}
          </>
        ) : (
          <Box
            sx={{
              width: "350px",
              height: "500px",
              backgroundColor: theme.palette.background.default,
              borderRadius: "10px",
              p: "3%",
              flexShrink: 0,
              color: theme.palette.text.secondary,
              m: "20px",
            }}
          >
            <Typography variant="h6" sx={{ mb: 3 }}>
              فیلترها
            </Typography>

            {/* Desktop sorting options */}
            <Box sx={{ mb: "16px", width: "100%" }}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, color: theme.palette.text.secondary }}
              >
                مرتب‌سازی بر اساس:
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <SortButton
                  active={sortOption === "lowest-price"}
                  onClick={() => setSortOption("lowest-price")}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: theme.palette.background.border,
                      fontSize: "18px",
                    }}
                  >
                    <ArrowDownwardIcon
                      fontSize="medium"
                      sx={{ color: theme.palette.text.secondary }}
                    />
                    کمترین قیمت
                  </Box>
                </SortButton>
                <SortButton
                  active={sortOption === "highest-price"}
                  onClick={() => setSortOption("highest-price")}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: theme.palette.background.border,
                      fontSize: "18px",
                    }}
                  >
                    <ArrowUpwardIcon fontSize="small" />
                    بیشترین قیمت
                  </Box>
                </SortButton>
                <SortButton
                  active={sortOption === "newest"}
                  onClick={() => setSortOption("newest")}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: theme.palette.background.border,
                      fontSize: "18px",
                    }}
                  >
                    <NewReleasesIcon fontSize="small" />
                    جدیدترین محصولات
                  </Box>
                </SortButton>
                <SortButton
                  active={sortOption === "oldest"}
                  onClick={() => setSortOption("oldest")}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: theme.palette.background.border,
                      fontSize: "18px",
                    }}
                  >
                    <AccessTimeIcon fontSize="small" />
                    قدیمی‌ترین محصولات
                  </Box>
                </SortButton>
              </Box>
            </Box>

            {/* Price range slider */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                محدوده قیمت:
              </Typography>
              <PriceSlider
                value={priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                min={minPrice}
                max={maxPrice}
                valueLabelFormat={(value) => formatPrice(value)}
              />
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
              >
                <Typography variant="caption">
                  {formatPrice(priceRange[1])} تومان
                </Typography>
                <Typography variant="caption">
                  {formatPrice(priceRange[0])} تومان
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* Products section */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            p: "20px",
            gap: "15px",
          }}
        >
          {renderProducts()}
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          mt: 4,
          direction: "ltr",
        }}
      >
        <Pagination
          count={Math.ceil(sortedProducts.length / itemsPerPage)}
          page={page}
          onChange={(e, value) => setPage(value)}
          sx={{
            marginBottom: "40px",
            color: theme.palette.primary.main,
            "& .MuiPaginationItem-root": {
              color: theme.palette.primary.main,
            },
            "& .MuiPaginationItem-root.Mui-selected": {
              backgroundColor: theme.palette.primary.main,
              color: "#fff",
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
            },
          }}
        />
      </Box>
    </>
  );
}