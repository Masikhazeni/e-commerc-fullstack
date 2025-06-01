import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  TextField,
  useMediaQuery,
  Divider,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { useSelector } from "react-redux";
import fetchData from "../../../Utils/fetchData";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useFormFields from "../../../Utils/useFormFields";
import EditField from "./EditField";



export default function Edit({ handlePageType }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { token, user } = useSelector((state) => state.auth);
  const [userInfo, setUserInfo] = useState(null);
  const [address, setAddress] = useState(null);
  const [userFields, handleUserChange] = useFormFields();
  const [addressFields, handleAddressChange] = useFormFields();

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

  const handleSubmit = async () => {
    try {
      // Update user info
      await fetchData(`user/${user.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userFields),
      });

      // Update or create address
      if (address) {
        await fetchData(`address/${address._id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(addressFields),
        });
      } else {
        await fetchData(`address`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...addressFields, userId: user.id }),
        });
      }

      handlePageType(); // Go back to view mode after successful update
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <Box sx={{ minHeight: "80vh", mt: { xs: "80px", md: "130px" }, mb: "40px" }}>
      {/* Header */}
      <Box
        sx={{
          width: "100%",
          height: "50px",
          px:{xs:'5%',md:'3%'},
          borderBottom: `1px solid ${theme.palette.background.border}`,
          mb: "40px",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: { xs: "13px", md: "16px" },
            lineHeight: "50px",
          }}
        >
          ویرایش پروفایل کاربر
          <ChevronLeftIcon fontSize="small" />
        </Typography>
      </Box>

      {/* Profile Card */}
      <Box
        sx={{
          maxWidth: 800,
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
              color: theme.palette.primary.main,
            }}
          >
            <PersonIcon fontSize="large" />
          </Avatar>
          <Typography variant="h6" color={theme.palette.text.secondary}>
            ویرایش اطلاعات حساب کاربری
          </Typography>
        </Box>

        {/* User Info */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
          <Box sx={{ flex: "1 1 calc(50% - 16px)", minWidth: "200px" }}>
            <EditField
              label={"نام کامل"}
              name={"fullname"}
              value={userFields.fullname || userInfo?.fullname}
              onChange={handleUserChange}
            />
          </Box>
          <Box sx={{ flex: "1 1 calc(50% - 16px)", minWidth: "200px" }}>
            <EditField
              label={"نام کاربری"}
              name={"username"}
              value={userFields.username || userInfo?.username}
              onChange={handleUserChange}
            />
          </Box>
          <Box sx={{ flex: "1 1 calc(50% - 16px)", minWidth: "200px" }}>
            <EditField
              label={"شماره موبایل"}
              name={"phoneNumber"}
              value={userFields.phoneNumber || userInfo?.phoneNumber}
              onChange={''}
            />
          </Box>
        </Box>

        {/* Address Section */}
        <Divider sx={{ my: 3 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <LocationOnIcon color="primary" />
            <Typography variant="h6" color="text.primary">
              ویرایش آدرس
            </Typography>
          </Box>
        </Divider>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
          <Box sx={{ flex: "1 1 calc(50% - 16px)", minWidth: "200px" }}>
            <EditField
              label={"نام گیرنده"}
              name={"receiverName"}
              value={addressFields.receiverName || address?.receiverName}
              onChange={handleAddressChange}
            />
          </Box>
          <Box sx={{ flex: "1 1 calc(50% - 16px)", minWidth: "200px" }}>
            <EditField
              label={"شماره تماس"}
              name={"receiverPhoneNumber"}
              value={
                addressFields.receiverPhoneNumber ||
                address?.receiverPhoneNumber
              }
              onChange={handleAddressChange}
            />
          </Box>
          <Box sx={{ flex: "1 1 calc(50% - 16px)", minWidth: "200px" }}>
            <EditField
              label={"استان"}
              name={"province"}
              value={addressFields.province || address?.province}
              onChange={handleAddressChange}
            />
          </Box>
          <Box sx={{ flex: "1 1 calc(50% - 16px)", minWidth: "200px" }}>
            <EditField
              label={"شهر"}
              name={"city"}
              value={addressFields.city || address?.city}
              onChange={handleAddressChange}
            />
          </Box>
          <Box sx={{ flex: "1 1 100%", minWidth: "200px" }}>
            <EditField
              label={"خیابان"}
              name={"street"}
              value={addressFields.street || address?.street}
              onChange={handleAddressChange}
            />
          </Box>
          <Box sx={{ flex: "1 1 calc(50% - 16px)", minWidth: "200px" }}>
            <EditField
              label={"پلاک"}
              name={"plaque"}
              value={addressFields.plaque || address?.plaque}
              onChange={handleAddressChange}
            />
          </Box>
          <Box sx={{ flex: "1 1 calc(50% - 16px)", minWidth: "200px" }}>
            <EditField
              label={"کد پستی"}
              name={"postalCode"}
              value={addressFields.postalCode || address?.postalCode}
              onChange={handleAddressChange}
            />
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box
          mt={4}
          display="flex"
          justifyContent="space-between"
          flexDirection={isMobile ? "column" : "row"}
          gap={2}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handlePageType}
            sx={{
              borderRadius: 3,
              px: 5,
              py: 1.5,
              fontWeight: 600,
              order: isMobile ? 2 : 1,
            }}
          >
            بازگشت
          </Button>
          <Button
            variant="contained"
            
            onClick={handleSubmit}
            sx={{
              borderRadius: 3,
              px: 5,
              py: 1.5,
              fontWeight: 600,
              backgroundColor: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
              order: isMobile ? 1 : 2,
            }}
          >
            ذخیره تغییرات
          </Button>
        </Box>
      </Box>
    </Box>
  );
}