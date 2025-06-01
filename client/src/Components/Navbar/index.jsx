import { useTheme } from "@emotion/react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../Store/Slices/AuthSlice";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import fetchData from "../../Utils/fetchData";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import { changeTheme } from "../../Store/Slices/ThemeSlice";
import SearchItem from "./SearchItem";

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#aab4be",
        ...theme.applyStyles("dark", {
          backgroundColor: "#8796A5",
        }),
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: "#001e3c",
    width: 32,
    height: 32,
    "&::before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#fff"
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
    ...theme.applyStyles("dark", {
      backgroundColor: "#003892",
    }),
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: "#aab4be",
    borderRadius: 20 / 2,
    ...theme.applyStyles("dark", {
      backgroundColor: "#8796A5",
    }),
  },
}));

export default function Navbar() {
  const theme = useTheme();
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [categories, setCategories] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchResult, setSearchResult] = useState();
  const [searchInp, setSearchInp] = useState();
  const [searchOpen, setSearchOpen] = useState(false);
  const menuRef = useRef(null);
  const searchRef = useRef(null);

  // مدیریت کلیک خارج از قسمت جستجو
  useEffect(() => {
    function handleClickOutside(event) {
      
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
        setSearchInp('')
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
        setSearchInp('')
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // منطق جستجو
  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchInp(value);
    if (value) {
      const res = await fetchData("search", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ query: value }),
      });
      setSearchResult(res.data);
      setSearchOpen(true);
    } else {
      setSearchOpen(false);
    }
    
  };

  const catItems = searchResult?.categories?.filter(e=>e.parentCategory !=null)?.map((e, index) => (
    <SearchItem
      key={index}
      type={"category"}
      title={e.name}
      id={e._id}
      img={e.image}
      onClick={() => setSearchOpen(false)}
    />
  ));

  const brandItems = searchResult?.brands?.map((e, index) => (
    <SearchItem
      key={index}
      type={"brand"}
      title={e.name}
      id={e._id}
      img={e.image}
      onClick={() => setSearchOpen(false)}
    />
  ));

  const proItems = searchResult?.products?.map((e, index) => (
    <SearchItem
      key={index}
      type={"product"}
      title={e.title}
      id={e._id}
      img={e.imagesUrl[0]}
      onClick={() => setSearchOpen(false)}
    />
  ));

  useEffect(() => {
    (async () => {
      const res = await fetchData("category?limit=1000");
      setCategories(res.data || []);
    })();
  }, []);

  const parentCategories = categories.filter((cat) => !cat.parentCategory);

  const items = parentCategories.map((parent, index) => {
    const isLast = index === parentCategories.length - 1;
    const isOpen = openIndex === index;

    const children = categories.filter(
      (cat) => cat.parentCategory === parent._id
    );

    return (
      <Box
        key={parent._id}
        component="button"
        onClick={() => setOpenIndex(isOpen ? null : index)}
        sx={{
          width: "30%",
          height: "100%",
          position: "relative",
          cursor: "pointer",
          transition: "all 0.3s ease",
          borderLeft: isLast
            ? "none"
            : `1px solid ${theme.palette.text.primary}`,
          background: "transparent",
        }}
      >
        <Typography
          sx={{
            color: theme.palette.text.primary,
            fontSize: "18px",
            "&:hover": {
              opacity: 0.6,
            },
          }}
        >
          {parent.name}
        </Typography>

        <Box
          sx={{
            position: "absolute",
            zIndex: 1000,
            width: "60%",
            backgroundColor: theme.palette.primary.main,
            borderRadius: "10px",
            border: `1px solid ${theme.palette.background.box} `,
            top: "110%",
            left: "50%",
            transform: "translateX(-50%)",
            overflow: "hidden",
            transition: "all 0.5s",
            height: isOpen ? "auto" : "0px",
            opacity: isOpen ? 1 : 0,
            padding: isOpen ? "10px" : "0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {children.map((child) => (
            <Box
              key={child._id}
              sx={{
                padding: "8px 12px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: "10%",
                width: "100%",
                color: theme.palette.text.primary,
                fontSize: "14px",
                cursor: "pointer",
              }}
              onClick={() => {
                navigate(
                  `/product/${child._id}/${child.name.replaceAll(" ", "-")}`
                );
                setOpenIndex(null);
              }}
            >
              <Box
                sx={{
                  fontSize: "18px",
                  "&:hover": {
                    opacity: ".5",
                  },
                }}
              >
                {child.name}
              </Box>
            </Box>
          ))}
          {children.length === 0 && (
            <Typography
              sx={{
                color: theme.palette.text.secondary,
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              دسته‌بندی ندارد
            </Typography>
          )}
        </Box>
      </Box>
    );
  });

  return (
    <Stack
      position="fixed"
      top="0"
      zIndex="1100"
      sx={{
        background: theme.palette.primary.main,
        width: "100%",
        height: { sm: "80px", md: "130px" },
        direction: "rtl",
      }}
    >
      {isMobile ? (
        <>
          <Box
            sx={{
              width: "100%",
              height: "80px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 2,
              
            }}
          >
            <Typography
              component="h1"
              sx={{ color: theme.palette.text.primary, fontSize: "28px" }}
            >
              رایاپلاس
            </Typography>

            <Box>
              <FormControlLabel
                control={
                  <MaterialUISwitch
                    onClick={() => dispatch(changeTheme())}
                    sx={{ m: 1 }}
                    defaultChecked
                  />
                }
              />

              <IconButton onClick={() => setOpen(true)}>
                <MenuIcon
                  sx={{ color: theme.palette.text.primary, fontSize: 30 }}
                />
              </IconButton>
            </Box>
          </Box>

          <Box
            ref={menuRef}
            sx={{
              position: "fixed",
              top: 0,
              left: open ? 0 : "-100%",
              width: "80%",
              height: "100vh",
              backgroundColor: theme.palette.background.paper,
              zIndex: 2000,
              p: 2,
              transition: "left 0.3s ease-in-out",
              overflowY: "auto",
              borderRight:`1px solid ${theme.palette.text.secondary}`,
               borderBottom:`1px solid ${theme.palette.text.secondary}`
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <IconButton onClick={() => setOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Box
              ref={searchRef}
              sx={{
                display: "flex",
                alignItems: "center",
                
                backgroundColor: theme.palette.background.paper,
                borderRadius: 1,
                px: 1,
                my: 2,
                border: `1px solid ${theme.palette.primary.main}`
              }}
            >
              <SearchIcon sx={{ 
                color: theme.palette.primary.main,
                fontSize: "1.3rem"
              }} />
              <TextField
                variant="standard"
                placeholder="جستجو..."
                fullWidth
                InputProps={{ 
                  disableUnderline: true,
                  sx: {
                    color: theme.palette.text.secondary,
                    fontSize: "0.9rem",
                    "&::placeholder": {
                      color: theme.palette.text.third,
                      opacity: 0.7
                    }
                  }
                }}
                sx={{ 
                  color: theme.palette.text.secondary,
                  p: 1
                }}
                value={searchInp}
                onChange={handleSearch}
                onFocus={() => setSearchOpen(true)}
              />
            </Box>

            {searchOpen && searchInp && (
              <Box
                sx={{
                  position: "fixed",
                  width:'80%',
                  top: "120px",
                  left: 0,
                  bottom: 0,
                  backgroundColor: theme.palette.background.paper,
                  zIndex: 1999,
                  overflowY: "auto",
                  p: 2,
                  borderTop: `2px solid ${theme.palette.primary.main}`
                }}
              >
                {catItems?.length > 0 && (
                  <>
                    <Typography 
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: "bold",
                        fontSize: "0.9rem",
                        mb: 1
                      }}
                    >
                      دسته بندی ها
                    </Typography>
                    <Divider sx={{ borderColor: theme.palette.primary.main, mb: 1 }} />
                    <Stack spacing={1}>{catItems}</Stack>
                  </>
                )}
                
                {brandItems?.length > 0 && (
                  <>
                    <Typography 
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: "bold",
                        fontSize: "0.9rem",
                        mt: 2,
                        mb: 1
                      }}
                    >
                      برند ها
                    </Typography>
                    <Divider sx={{ borderColor: theme.palette.primary.main, mb: 1 }} />
                    <Stack spacing={1}>{brandItems}</Stack>
                  </>
                )}
                
                {proItems?.length > 0 && (
                  <>
                    <Typography 
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: "bold",
                        fontSize: "0.9rem",
                        mt: 2,
                        mb: 1
                      }}
                    >
                      محصولات
                    </Typography>
                    <Divider sx={{ borderColor: theme.palette.primary.main, mb: 1 }} />
                    <Stack spacing={1}>{proItems}</Stack>
                  </>
                )}
                
                {catItems?.length === 0 && brandItems?.length === 0 && proItems?.length === 0 && (
                  <Typography 
                    sx={{
                      color: theme.palette.text.third,
                      textAlign: "center",
                      p: 2,
                      fontSize: "0.9rem"
                    }}
                  >
                    نتیجه‌ای یافت نشد
                  </Typography>
                )}
              </Box>
            )}

            <Stack spacing={2} mt={2}>
              <Button
                sx={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: theme.palette.text.secondary,
                }}
                onClick={() => {
                  navigate("/");
                  setOpen(false);
                }}
              >
                خانه
              </Button>
              <Button
                sx={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: theme.palette.text.secondary,
                }}
                onClick={() => {
                  navigate(token ? "/profile" : "/authorization");
                  setOpen(false);
                }}
              >
                پروفایل
              </Button>
              <Button
                sx={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: theme.palette.text.secondary,
                }}
                onClick={() => {
                  navigate(token ? "/favorite" : "/authorization");
                  setOpen(false);
                }}
              >
                مورد علاقه ها
              </Button>
              <Button
                sx={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: theme.palette.text.secondary,
                }}
                onClick={() => {
                  navigate(token ? "/cart" : "/authorization");
                  setOpen(false);
                }}
              >
                سبد خرید
              </Button>
            </Stack>

            <Typography
              variant="h6"
              mt={3}
              mb={1}
              sx={{ color: theme.palette.primary.main }}
            >
              دسته‌بندی‌ها
            </Typography>
            {parentCategories.map((parent) => {
              const subs = categories.filter(
                (cat) => cat.parentCategory === parent._id
              );
              return (
                <Accordion key={parent._id} sx={{ boxShadow: "none" }}>
                  <AccordionSummary
                    sx={{
                      color: theme.palette.secondary.main,
                      fontWeight: "600",
                    }}
                    expandIcon={<ExpandMoreIcon />}
                  >
                    {parent.name}
                  </AccordionSummary>
                  <AccordionDetails>
                    {subs.length > 0 ? (
                      subs.map((sub) => (
                        <Button
                          key={sub._id}
                          fullWidth
                          sx={{
                            justifyContent: "flex-start",
                            textAlign: "right",
                          }}
                          onClick={() => {
                            navigate(
                              `/product/${sub._id}/${sub.name.replaceAll(
                                " ",
                                "-"
                              )}`
                            );
                            setOpen(false);
                          }}
                        >
                          {sub.name}
                        </Button>
                      ))
                    ) : (
                      <Typography fontSize={14} color="text.secondary">
                        زیر‌دسته‌ای ندارد
                      </Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              );
            })}

            <Box mt={4}>
              {token ? (
                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  onClick={() => {
                    dispatch(logout());
                    setOpen(false);
                  }}
                  startIcon={<LogoutIcon />}
                >
                  خروج
                </Button>
              ) : (
                <Button
                  fullWidth
                  variant="outlined"
                  backgroundColor={theme.palette.background.Button}
                  onClick={() => {
                    navigate("/authorization");
                    setOpen(false);
                  }}
                >
                  ورود / ثبت‌نام
                </Button>
              )}
            </Box>
          </Box>
        </>
      ) : (
        <>
          {/* هدر بالا */}
          <Box
            sx={{
              background: theme.palette.primary.main,
              width: "100%",
              height: "90px",
              padding: { lg: "0 1%", xl: "0 5%" },
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", gap: "5%", flex: "1", px: "20px" }}>
              <Typography
                component="h1"
                sx={{
                  color: theme.palette.text.primary,
                  fontSize: "32px",
                  width: "30%",
                  textAlign: "center",
                }}
              >
                رایاپلاس
              </Typography>
              <FormControlLabel
                control={
                  <MaterialUISwitch
                    onClick={() => dispatch(changeTheme())}
                    sx={{ m: 1 }}
                    defaultChecked
                  />
                }
              />
            </Box>

            <Box
              ref={searchRef}
              sx={{
                width: "25%",
                height: "50px",
                backgroundColor: theme.palette.background.default,
                display: "flex",
                alignItems: "center",
                borderRadius: "10px",
                mx: "5%",
                flex: "1",
                position: "relative",
                border: `1px solid ${theme.palette.primary.main}`
              }}
            >
              <SearchIcon
                sx={{
                  color: theme.palette.primary.main,
                  mr: 1,
                  fontSize: "1.5rem"
                }}
              />
              <input
                type="text"
                placeholder="جستجو..."
                style={{
                  width: "90%",
                  outline: "none",
                  border: "none",
                  backgroundColor: "transparent",
                  color: theme.palette.text.secondary,
                  fontSize: "0.9rem",
                }}
                value={searchInp}
                onChange={handleSearch}
                onFocus={() => setSearchOpen(true)}
              />
              
              {searchOpen && searchInp && (
                <Stack
                  sx={{
                    position: "absolute",
                    width: "100%",
                    maxHeight: "400px",
                    borderRadius: "0 0 10px 10px",
                    overflowY: "auto",
                    backgroundColor: theme.palette.background.paper,
                    zIndex: "1200",
                    top: "100%",
                    left: 0,
                    boxShadow: theme.shadows[3],
                    border: `1px solid ${theme.palette.primary.main}`,
                  }}
                >
                  {catItems?.length > 0 && (
                    <>
                      <Typography 
                        sx={{
                          p: 1,
                          color: theme.palette.primary.main,
                          fontWeight: "bold",
                          fontSize: "0.9rem",
                          textAlign: "right"
                        }}
                      >
                        دسته بندی ها
                      </Typography>
                      <Divider sx={{ borderColor: theme.palette.primary.main }} />
                      {catItems}
                    </>
                  )}
                  
                  {brandItems?.length > 0 && (
                    <>
                      <Typography 
                        sx={{
                          p: 1,
                          color: theme.palette.primary.main,
                          fontWeight: "bold",
                          fontSize: "0.9rem",
                          textAlign: "right"
                        }}
                      >
                        برند ها
                      </Typography>
                      <Divider sx={{ borderColor: theme.palette.primary.main }} />
                      {brandItems}
                    </>
                  )}
                  
                  {proItems?.length > 0 && (
                    <>
                      <Typography 
                        sx={{
                          p: 1,
                          color: theme.palette.primary.main,
                          fontWeight: "bold",
                          fontSize: "0.9rem",
                          textAlign: "right"
                        }}
                      >
                        محصولات
                      </Typography>
                      <Divider sx={{ borderColor: theme.palette.primary.main }} />
                      {proItems}
                    </>
                  )}
                  
                  {catItems?.length === 0 && brandItems?.length === 0 && proItems?.length === 0 && (
                    <Typography 
                      sx={{
                        p: 2,
                        color: theme.palette.text.third,
                        textAlign: "center",
                        fontSize: "0.9rem"
                      }}
                    >
                      نتیجه‌ای یافت نشد
                    </Typography>
                  )}
                </Stack>
              )}
            </Box>

            <Box
              component="ul"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "end",
                height: "100%",
                width: "30%",
                gap: "1%",
                listStyle: "none",
                padding: 0,
                margin: 0,
                flex: "1",
              }}
            >
              <Button onClick={() => navigate("/")}>
                <HomeIcon
                  sx={{
                    color: theme.palette.text.primary,
                    "&:hover": {
                      opacity: 0.5,
                    },
                    transition: "all 0.5s",
                  }}
                />
              </Button>

              <Button
                sx={{
                  color: theme.palette.text.primary,
                  "&:hover": {
                    opacity: 0.5,
                  },
                  transition: "all 0.5s",
                }}
                onClick={() => navigate(token ? "/profile" : "/authorization")}
              >
                <PersonIcon />
              </Button>

              <Button
                sx={{
                  color: theme.palette.text.primary,
                  "&:hover": {
                    opacity: 0.5,
                  },
                  transition: "all 0.5s",
                }}
                onClick={() => navigate(token ? "/favorite" : "/authorization")}
              >
                <FavoriteIcon />
              </Button>

              <Button
                sx={{
                  color: theme.palette.text.primary,
                  "&:hover": {
                    opacity: 0.5,
                  },
                  transition: "all 0.5s",
                }}
                onClick={() => navigate(token ? "/cart" : "/authorization")}
              >
                <ShoppingCartIcon />
              </Button>

              {token ? (
                <Button
                  onClick={() => dispatch(logout())}
                  sx={{
                    color: "red",
                    "&:hover": {
                      opacity: 0.5,
                    },
                    transition: "all 0.5s",
                  }}
                >
                  <LogoutIcon />
                </Button>
              ) : (
                <Button
                  onClick={() => navigate("/authorization")}
                  sx={{
                    color: theme.palette.text.primary,
                    "&:hover": {
                      opacity: 0.5,
                    },
                    transition: "all 0.5s",
                  }}
                >
                  <LoginIcon />
                </Button>
              )}
            </Box>
          </Box>

          {/* نوار دسته‌بندی‌ها */}
          <Box
            sx={{
              background: theme.palette.secondary.main,
              width: "100%",
              height: "40px",
              padding: "0 5%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {items}
          </Box>
        </>
      )}
    </Stack>
  );
}
