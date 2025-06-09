import React, { useRef, useState } from "react";
import { Box, TextField, useTheme } from "@mui/material";

const OtpInput = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputsRef = useRef([]);
  const theme = useTheme();

  const handleChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputsRef.current[index + 1].focus();
    }

    if (newOtp.every((digit) => digit !== "")) {
      onComplete(newOtp.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  return (
    <Box
      dir="ltr"
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 2,
      }}
    >
      {otp.map((digit, index) => (
        <TextField
          key={index}
          inputProps={{
            maxLength: 1,
            style: {
              textAlign: "center",
              fontSize: "1.5rem",
              fontWeight: "bold",
              padding: 0,
              width: "3.5rem",
              height: "3.5rem",
            },
          }}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          inputRef={(el) => (inputsRef.current[index] = el)}
          variant="outlined"
          sx={{
            '& .MuiInputBase-input': {
              color: theme.palette.primary.main, // رنگ متن تایپ شده
            },
          }}
        />
      ))}
    </Box>
  );
};

export default OtpInput;
