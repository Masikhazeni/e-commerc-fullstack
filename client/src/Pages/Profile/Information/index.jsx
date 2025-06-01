import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Grid,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { useSelector } from "react-redux";
import fetchData from "../../../Utils/fetchData";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EditIcon from "@mui/icons-material/Edit";
import InfoRow from "./InfoRow";



export default function Information({ handlePageType }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [userInfo, setUserInfo] = useState(null);
  const [address, setAddress] = useState(null);
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    (async () => {
      const res = await fetchData(`user/${user.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserInfo(res.data);
    })();
  }, [token, user]);

  useEffect(() => {
    (async () => {
      const res = await fetchData(`address?userId=${user.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAddress(res.data[0]);
    })();
  }, [token, user]);

  return (
    <Box
     sx={{ minHeight: "80vh", mt: { xs: "80px", md: "130px" } ,mb:'40px' }}
    >
      {/* Header */}
      <Box sx={{
          width: "100%",
          height: "50px",
          px:{xs:'5%',md:'3%'},
          borderBottom: `1px solid ${theme.palette.background.border}`,
          mb:'40px'
        }}>
          <Typography
          variant="h4"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: { xs: "13px", md: "16px" },
            lineHeight: "50px",
          }}
        >
         پروفایل کاربر<ChevronLeftIcon fontSize="small" />
        </Typography>
       
      </Box>

      {/* Profile Card */}
      <Box
        sx={{
          maxWidth: 800,
          mx: "auto",
          p: { xs: 3, md: 5 },
           background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.box})`,
          borderRadius: 4,
          boxShadow: 3,
          mx:{xs:'5%',md:'auto'}
        }}
      >
        {/* Avatar */}
        <Box textAlign="center" mb={4}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mx: "auto",
              mb: 1,
              bgcolor: theme.palette.primary.light,
              color: theme.palette.primary.contrastText,
            }}
          >
            <PersonIcon fontSize="large" />
          </Avatar>
          <Typography variant="h6" color={theme.palette.text.secondary}>
            اطلاعات حساب کاربری
          </Typography>
        </Box>

        {/* User Info */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} >
            <InfoRow label="نام کامل" value={userInfo?.fullname}/>
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoRow label="نام کاربری" value={userInfo?.username} />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoRow label="شماره موبایل" value={userInfo?.phoneNumber} />
          </Grid>
        </Grid>

        {/* Address Section */}
        <Box mt={5} mb={2} display="flex" alignItems="center" gap={1}>
          <LocationOnIcon color="primary" />
          <Typography variant="h6" color={theme.palette.text.secondary}>
            آدرس ثبت‌شده
          </Typography>
        </Box>

        {address ? (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <InfoRow label="نام گیرنده" value={address.receiverName} />
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoRow label="شماره تماس" value={address.receiverPhoneNumber} />
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoRow label="استان" value={address.province} />
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoRow label="شهر" value={address.city} />
            </Grid>
            <Grid item xs={12}>
              <InfoRow label="خیابان" value={address.street} />
            </Grid>
            <Grid item xs={6}>
              <InfoRow label="پلاک" value={address.plaque} />
            </Grid>
            <Grid item xs={6}>
              <InfoRow label="کد پستی" value={address.postalCode} />
            </Grid>
          </Grid>
        ) : (
          <Typography color="text.secondary">
            آدرسی ثبت نشده است.
          </Typography>
        )}

        {/* Edit Button */}
        <Box mt={4} textAlign="center">
          <Button
            variant="contained"
            onClick={handlePageType}
            sx={{
              borderRadius: 3,
              px: 5,
              py: 1.5,
              fontWeight: 600,
              backgroundColor: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            ویرایش اطلاعات
          </Button>
        </Box>
      </Box>
    </Box>
  );
}





