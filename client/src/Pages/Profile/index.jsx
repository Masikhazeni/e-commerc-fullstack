import { Box, Typography, useTheme } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import React from 'react'

export default function Profile() {
  const theme=useTheme()
  return (
    <>
    <Box sx={{minHeight:'80vh',mt:{xs:'80px',md:'130px'}}}>
      <Box
          sx={{
            width: "100%",
            height: "50px",
            mt: { xs: "80px", md: "130px" },
            px: { xs: "2px", md: "4%" },
            borderBottom: `1px solid ${theme.palette.background.border}`,
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
           پروفایل<ChevronLeftIcon fontSize="small" />
           
          </Typography>
        </Box>

    </Box>
      
    </>
  )
}
