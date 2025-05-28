import { Avatar, Box, Typography, useTheme } from '@mui/material'
import React from 'react'


export default function Comment({username,content,date}) {
    const theme=useTheme()
  return (
     <Box
              sx={{
                width: { xs: "90%", sm: "230px", md: "250px" },
                minHeight: { xs: "180px", sm: "200px", md: "220px" },
                p: { xs: 2, sm: 2.5, md: 3 },
                borderRadius: 4,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.box})`,
                boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  boxShadow: `0px 8px 15px ${theme.palette.primary.light}`,
                },
              }}
            >
              {/* Header */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Avatar
                  sx={{
                    width: 30,
                    height: 30,
                    bgcolor: theme.palette.primary.main,
                    ml: "5px",
                    fontSize: 13,
                  }}
                >
                  {username?.charAt(0)?.toUpperCase() || "؟"}
                </Avatar>
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  sx={{
                    fontSize: { xs: "13px", sm: "14px" },
                    color: theme.palette.primary.dark,
                  }}
                >
                  {username || "بی‌نام"}
                </Typography>
              </Box>

              {/* Content */}
              <Box sx={{ flexGrow: 1, my: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: "14px", sm: "15px" },
                    color: theme.palette.text.primary,
                    lineHeight: 1.7,
                  }}
                >
                  {content}
                </Typography>
              </Box>

              {/* Footer */}
              <Box sx={{ textAlign: "right" }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: { xs: "11px", sm: "12px" },
                    color: theme.palette.text.secondary,
                  }}
                >
                  {new Date(date).toLocaleDateString("fa-IR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Typography>
              </Box>
            </Box>
  )
}
